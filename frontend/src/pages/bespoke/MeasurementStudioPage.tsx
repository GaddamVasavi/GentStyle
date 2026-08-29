import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { bespokeService } from '../../services/bespoke.service';
import { Ruler, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MeasurementStudioPage: React.FC = () => {
  const [units, setUnits] = useState<'INCHES' | 'CENTIMETERS'>('INCHES');
  const [profileName] = useState('Lord Sartorial Standard');
  const [fitPreference] = useState<'TAILORED_SLIM' | 'CLASSIC_COMFORT' | 'SKINNY_FASHION' | 'RELAXED_DRAPE'>('TAILORED_SLIM');

  // Measurements
  const [height, setHeight] = useState(71);
  const [weight, setWeight] = useState(175);
  const [neck, setNeck] = useState(16.5);
  const [chest, setChest] = useState(40.5);
  const [waist, setWaist] = useState(33.0);
  const [hips, setHips] = useState(39.5);
  const [shoulder, setShoulder] = useState(18.5);
  const [sleeveL, setSleeveL] = useState(25.5);
  const [sleeveR, setSleeveR] = useState(25.5);
  const [inseam, setInseam] = useState(31.5);
  const [outseam, setOutseam] = useState(41.5);
  const [bicep, setBicep] = useState(13.5);

  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const payload = {
        profileName,
        fitPreference,
        units,
        height,
        weight,
        neckCircumference: neck,
        chestCircumference: chest,
        underChestCircumference: chest - 2,
        stomachWaistCircumference: waist,
        pantWaistCircumference: waist + 1,
        hipSeatCircumference: hips,
        shoulderWidthFull: shoulder,
        halfShoulderWidth: shoulder / 2,
        sleeveLengthLeft: sleeveL,
        sleeveLengthRight: sleeveR,
        bicepCircumference: bicep,
        forearmCircumference: bicep - 2,
        wristCircumference: 7.0,
        jacketBackLength: 30.0,
        frontJacketLength: 30.5,
        armholeDepth: 9.5,
        frontChestWidth: 16.5,
        backWidth: 16.0,
        trouserOutseamLeft: outseam,
        trouserOutseamRight: outseam,
        trouserInseamLeft: inseam,
        trouserInseamRight: inseam,
        thighCircumference: 23.5,
        kneeCircumference: 16.5,
        pantLegOpening: 15.0,
        crotchTotalRise: 27.0,
        frontRise: 10.5,
        backRise: 16.5,
        posture: 'NORMAL_BALANCED',
        shoulderSlope: 'REGULAR_SLOPE',
        chestShape: 'STANDARD_MUSCULAR',
        stomachShape: 'FLAT',
        isVerifiedByMasterTailor: false,
      };

      const res = await bespokeService.analyzeMeasurements(payload);
      setAnalysisResult(res.data);
    } catch {
      alert('Error analyzing biometric profile');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
          <Ruler className="w-4 h-4" />
          Biometric Master Studio
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          32-Point Sartorial Body Profile
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Machine-verified anatomical ease calculation and posture distortion analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gentborder">
            <h3 className="font-serif font-bold text-white text-base">Key Anatomical Landmarks</h3>
            <div className="flex gap-2 bg-[#12151b] p-1 rounded-xl border border-gentborder">
              <button
                onClick={() => setUnits('INCHES')}
                className={`px-3 py-1 text-xs rounded-lg font-mono ${
                  units === 'INCHES' ? 'bg-gold-400 text-gentblack font-bold' : 'text-gray-400'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnits('CENTIMETERS')}
                className={`px-3 py-1 text-xs rounded-lg font-mono ${
                  units === 'CENTIMETERS' ? 'bg-gold-400 text-gentblack font-bold' : 'text-gray-400'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={`Height (${units === 'INCHES' ? 'inches' : 'cm'})`}
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
            <Input
              label={`Weight (${units === 'INCHES' ? 'lbs' : 'kg'})`}
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
            <Input
              label="Neck Circumference"
              type="number"
              value={neck}
              onChange={(e) => setNeck(Number(e.target.value))}
            />
            <Input
              label="Chest Circumference"
              type="number"
              value={chest}
              onChange={(e) => setChest(Number(e.target.value))}
            />
            <Input
              label="Stomach / Waist Circumference"
              type="number"
              value={waist}
              onChange={(e) => setWaist(Number(e.target.value))}
            />
            <Input
              label="Hip / Seat Circumference"
              type="number"
              value={hips}
              onChange={(e) => setHips(Number(e.target.value))}
            />
            <Input
              label="Full Shoulder Width"
              type="number"
              value={shoulder}
              onChange={(e) => setShoulder(Number(e.target.value))}
            />
            <Input
              label="Bicep Circumference"
              type="number"
              value={bicep}
              onChange={(e) => setBicep(Number(e.target.value))}
            />
            <Input
              label="Sleeve Length Left"
              type="number"
              value={sleeveL}
              onChange={(e) => setSleeveL(Number(e.target.value))}
            />
            <Input
              label="Sleeve Length Right"
              type="number"
              value={sleeveR}
              onChange={(e) => setSleeveR(Number(e.target.value))}
            />
            <Input
              label="Trouser Inseam"
              type="number"
              value={inseam}
              onChange={(e) => setInseam(Number(e.target.value))}
            />
            <Input
              label="Trouser Outseam"
              type="number"
              value={outseam}
              onChange={(e) => setOutseam(Number(e.target.value))}
            />
          </div>

          <Button
            variant="gold"
            size="md"
            className="w-full"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Computing Sartorial Tolerances...' : 'Verify & Analyze Profile'}
          </Button>
        </div>

        {/* Right: Analysis & Feedback */}
        <div className="lg:col-span-5 space-y-6">
          {analysisResult ? (
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder space-y-6">
              <div className="flex items-center gap-2 text-emerald-400 font-serif font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>Anatomical Drop Validated</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-gentborder/60 pb-2">
                  <span className="text-gray-400">Chest-to-Waist Drop</span>
                  <span className="text-white font-mono font-bold">
                    {analysisResult.analysis.proportions.chestToWaistDrop.toFixed(1)} inches
                  </span>
                </div>
                <div className="flex justify-between border-b border-gentborder/60 pb-2">
                  <span className="text-gray-400">BMI Estimate</span>
                  <span className="text-white font-mono">
                    {analysisResult.analysis.proportions.bmiEstimate}
                  </span>
                </div>
              </div>

              {/* Finished Pattern Specs */}
              <div className="bg-[#12151b] p-4 rounded-xl border border-gentborder space-y-2 text-xs">
                <p className="font-serif font-bold text-gold-300">Finished Garment Cut Tolerances</p>
                <div className="flex justify-between text-gray-300">
                  <span>Target Finished Chest:</span>
                  <span className="font-mono text-white">
                    {analysisResult.finishedSpecs.finishedChest.toFixed(1)}"
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Target Finished Waist:</span>
                  <span className="font-mono text-white">
                    {analysisResult.finishedSpecs.finishedWaist.toFixed(1)}"
                  </span>
                </div>
              </div>

              <Link to="/bespoke/appointments">
                <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Schedule Master Fitting
                </Button>
              </Link>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-8 border border-gentborder text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-gold-400 mx-auto" />
              <h3 className="font-serif font-bold text-white text-base">Atelier Precision Heuristics</h3>
              <p className="text-xs text-gray-400">
                Enter your key biometric landmarks to compute anatomical drops, ease allowances, and balance checks before cutting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
