import { biometricMeasurementEngine } from '../src/modules/bespoke/bespoke.measurements.engine';
import { fabricCatalogService } from '../src/modules/bespoke/bespoke.fabrics.catalog';
import { bespokeConfiguratorEngine } from '../src/modules/bespoke/bespoke.configurator.engine';
import { BodyMeasurementProfile, BespokeGarmentConfig } from '../src/modules/bespoke/bespoke.types';

describe('Bespoke Tailoring & Atelier Engine', () => {
  test('should retrieve luxury fabric swatches from top European mills', () => {
    const fabrics = fabricCatalogService.getAllFabrics();
    expect(fabrics.length).toBeGreaterThan(3);
    const loroPiana = fabrics.find((f) => f.mill === 'LORO_PIANA');
    expect(loroPiana).toBeDefined();
    expect(loroPiana?.woolGrade).toContain('Super');
  });

  test('should validate 32-point biometric measurements and detect chest drop', () => {
    const profile: BodyMeasurementProfile = {
      userId: 'test-user',
      profileName: 'Standard Athletic',
      fitPreference: 'TAILORED_SLIM',
      units: 'INCHES',
      height: 72,
      weight: 180,
      neckCircumference: 16.5,
      chestCircumference: 42.0,
      underChestCircumference: 40.0,
      stomachWaistCircumference: 32.0, // Drop 10
      pantWaistCircumference: 33.0,
      hipSeatCircumference: 40.0,
      shoulderWidthFull: 19.0,
      halfShoulderWidth: 9.5,
      sleeveLengthLeft: 26.0,
      sleeveLengthRight: 26.0,
      bicepCircumference: 14.0,
      forearmCircumference: 12.0,
      wristCircumference: 7.2,
      jacketBackLength: 30.5,
      frontJacketLength: 31.0,
      armholeDepth: 9.75,
      frontChestWidth: 17.0,
      backWidth: 16.5,
      trouserOutseamLeft: 42.0,
      trouserOutseamRight: 42.0,
      trouserInseamLeft: 32.0,
      trouserInseamRight: 32.0,
      thighCircumference: 24.0,
      kneeCircumference: 17.0,
      pantLegOpening: 15.5,
      crotchTotalRise: 27.5,
      frontRise: 10.5,
      backRise: 17.0,
      posture: 'NORMAL_BALANCED',
      shoulderSlope: 'REGULAR_SLOPE',
      chestShape: 'STANDARD_MUSCULAR',
      stomachShape: 'FLAT',
      isVerifiedByMasterTailor: true,
    };

    const analysis = biometricMeasurementEngine.analyzeMeasurements(profile);
    expect(analysis.isValid).toBe(true);
    expect(analysis.proportions.chestToWaistDrop).toBe(10);
    expect(analysis.proportions.bmiEstimate).toBeGreaterThan(20);
  });

  test('should compute dynamic pricing quote for bespoke 3-piece tuxedo', () => {
    const config: BespokeGarmentConfig = {
      userId: 'test-user',
      garmentType: 'THREE_PIECE_SUIT',
      silhouette: 'TUXEDO_BLACK_TIE',
      fabricId: 'fab-loro-tasmanian-charcoal',
      lapel: 'SHAWL_SATIN',
      buttons: 'SINGLE_1_BUTTON',
      pockets: 'JETTED_LUXURY',
      vents: 'VENTLESS_FORMAL',
      lining: 'FULL_BEMBERG_SILK',
      liningPatternId: 'silk-jacquard-black',
      buttonMaterial: 'MOTHER_OF_PEARL_AUSTRALIAN',
      canvasConstruction: 'FULL_FLOATING_CANVAS',
      shoulderPad: 'ROPPED_ENGLISH',
      monogram: {
        text: 'V.G.',
        font: 'SCRIPT_TRADITIONAL',
        threadColor: 'GOLDEN_ROD',
        placement: 'INSIDE_RIGHT_BREAST',
      },
      estimatedPrice: 0,
      currency: 'USD',
    };

    const quote = bespokeConfiguratorEngine.calculatePrice(config);
    expect(quote.totalPrice).toBeGreaterThan(2500);
    expect(quote.currency).toBe('USD');
    expect(quote.fabricMetersRequired).toBe(4.2);
  });
});
