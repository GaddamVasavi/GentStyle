import { BodyMeasurementProfile } from './bespoke.types';
import { ValidationError } from '../../utils/errors';

export interface MeasurementAnomalyReport {
  isValid: boolean;
  warnings: string[];
  anomalies: string[];
  suggestedAdjustments: Record<string, number>;
  proportions: {
    chestToWaistDrop: number;
    shoulderToChestRatio: number;
    torsoToLegRatio: number;
    bmiEstimate: number;
  };
}

export class BiometricMeasurementEngine {
  /**
   * Validates 32 body measurements and calculates sartorial drape adjustments
   */
  public analyzeMeasurements(m: BodyMeasurementProfile): MeasurementAnomalyReport {
    const warnings: string[] = [];
    const anomalies: string[] = [];
    const suggestedAdjustments: Record<string, number> = {};

    // Standardize to inches for computation
    const toInches = (val: number) => (m.units === 'CENTIMETERS' ? val / 2.54 : val);
    const toCm = (val: number) => (m.units === 'CENTIMETERS' ? val : val * 2.54);

    const heightIn = toInches(m.height);
    const weightLbs = m.units === 'CENTIMETERS' ? m.weight * 2.20462 : m.weight;
    const chestIn = toInches(m.chestCircumference);
    const waistIn = toInches(m.stomachWaistCircumference);
    const hipIn = toInches(m.hipSeatCircumference);
    const neckIn = toInches(m.neckCircumference);
    const shoulderIn = toInches(m.shoulderWidthFull);
    const sleeveIn = toInches(m.sleeveLengthLeft);
    const inseamIn = toInches(m.trouserInseamLeft);

    // 1. Calculate Anatomical Drop (Chest - Waist)
    const drop = chestIn - waistIn;

    // 2. BMI heuristic check
    const heightM = toCm(m.height) / 100;
    const weightKg = m.units === 'CENTIMETERS' ? m.weight : m.weight * 0.453592;
    const bmi = weightKg / (heightM * heightM);

    // 3. Drop analysis
    if (drop > 10) {
      warnings.push(`Athletic high-drop figure detected (Drop ${drop.toFixed(1)}"). Jacket waist suppression will require bespoke back darting.`);
    } else if (drop < 0) {
      warnings.push(`Portly figure detected (Waist is ${Math.abs(drop).toFixed(1)}" larger than chest). Front button placement and lower quarters will be adjusted.`);
    }

    // 4. Neck-to-Chest ratio check
    const neckToChest = neckIn / chestIn;
    if (neckToChest > 0.45) {
      warnings.push(`Collar stance alert: High neck circumference relative to chest (${neckIn.toFixed(1)}" / ${chestIn.toFixed(1)}"). Collar gorge will be widened.`);
    }

    // 5. Arm asymmetry check
    const sleeveDiff = Math.abs(toInches(m.sleeveLengthLeft) - toInches(m.sleeveLengthRight));
    if (sleeveDiff >= 0.5) {
      warnings.push(`Sleeve asymmetry detected: Left/Right difference of ${sleeveDiff.toFixed(2)}". Individual sleeve patterns will be cut.`);
    }

    // 6. Inseam / Outseam validation
    const outseamIn = toInches(m.trouserOutseamLeft);
    if (inseamIn >= outseamIn) {
      anomalies.push(`Inseam (${inseamIn.toFixed(1)}") cannot be greater than or equal to Outseam (${outseamIn.toFixed(1)}"). Please re-measure.`);
    }

    // 7. Posture & Shoulder Slope Compensations
    if (m.posture === 'STOOPED_FORWARD') {
      suggestedAdjustments['jacketBackLength'] = 0.5; // lengthen back
      suggestedAdjustments['frontJacketLength'] = -0.5; // shorten front
    } else if (m.posture === 'ERECT_MILITARY') {
      suggestedAdjustments['jacketBackLength'] = -0.5;
      suggestedAdjustments['frontJacketLength'] = 0.5;
    }

    if (m.shoulderSlope === 'SLOPING_LOW_SHOULDERS') {
      suggestedAdjustments['armholeDepth'] = 0.35;
      suggestedAdjustments['collarGorgeLower'] = 0.25;
    } else if (m.shoulderSlope === 'SQUARE_HIGH_SHOULDERS') {
      suggestedAdjustments['armholeDepth'] = -0.25;
    }

    // Proportions
    const proportions = {
      chestToWaistDrop: drop,
      shoulderToChestRatio: shoulderIn / chestIn,
      torsoToLegRatio: (heightIn - inseamIn) / inseamIn,
      bmiEstimate: parseFloat(bmi.toFixed(1)),
    };

    return {
      isValid: anomalies.length === 0,
      warnings,
      anomalies,
      suggestedAdjustments,
      proportions,
    };
  }

  /**
   * Generates tailored ease allowances based on fit preference
   */
  public calculateGarmentFinishedSpecs(m: BodyMeasurementProfile) {
    let chestEase = 4.0; // standard ease in inches
    let waistEase = 3.0;
    let hipEase = 3.5;
    let bicepEase = 2.5;

    switch (m.fitPreference) {
      case 'SKINNY_FASHION':
        chestEase = 2.5;
        waistEase = 1.75;
        hipEase = 2.0;
        bicepEase = 1.5;
        break;
      case 'TAILORED_SLIM':
        chestEase = 3.5;
        waistEase = 2.5;
        hipEase = 3.0;
        bicepEase = 2.0;
        break;
      case 'CLASSIC_COMFORT':
        chestEase = 4.5;
        waistEase = 3.5;
        hipEase = 4.0;
        bicepEase = 2.8;
        break;
      case 'RELAXED_DRAPE':
        chestEase = 6.0;
        waistEase = 4.5;
        hipEase = 5.0;
        bicepEase = 3.5;
        break;
    }

    return {
      finishedChest: m.chestCircumference + chestEase,
      finishedWaist: m.stomachWaistCircumference + waistEase,
      finishedHips: m.hipSeatCircumference + hipEase,
      finishedBicep: m.bicepCircumference + bicepEase,
      easeAllowanceInches: { chestEase, waistEase, hipEase, bicepEase },
    };
  }
}

export const biometricMeasurementEngine = new BiometricMeasurementEngine();
