import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchBespokeFabrics,
  computeBespokeQuote,
  updateGarmentConfig,
  setSelectedFabric,
} from '../../store/slices/bespokeSlice';
import { Bespoke3DViewer } from '../../components/bespoke/Bespoke3DViewer';
import { Button } from '../../components/common/Button';
import { Scissors, Check, Calendar, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SuitSilhouette,
  LapelType,
  ButtonConfiguration,
  PocketStyle,
  ButtonMaterial,
} from '../../types/bespoke.types';

export const BespokeCustomizerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { fabrics, selectedFabric, currentConfig, quote } = useSelector(
    (state: RootState) => state.bespoke
  );

  const [activeTab, setActiveTab] = useState<'STYLE' | 'FABRIC' | 'DETAILS' | 'MONOGRAM'>('STYLE');

  useEffect(() => {
    dispatch(fetchBespokeFabrics());
  }, [dispatch]);

  useEffect(() => {
    if (currentConfig.fabricId) {
      dispatch(computeBespokeQuote(currentConfig));
    }
  }, [currentConfig, dispatch]);

  const silhouettes: Array<{ id: SuitSilhouette; title: string; desc: string }> = [
    { id: 'NEAPOLITAN_SOFT', title: 'Neapolitan Soft Tailoring', desc: 'Unstructured shirt-like shoulder (Spalla Camicia), light drape, relaxed high armholes.' },
    { id: 'CLASSIC_BRITISH', title: 'Savile Row Structured', desc: 'Roped english shoulder, pronounced waist suppression, firm floating horsehair canvas.' },
    { id: 'PARISIAN_STRUCTURED', title: 'Parisian Architectural', desc: 'Pagoda shoulder, sharp clean chest drape, sophisticated high gorge lapels.' },
    { id: 'TUXEDO_BLACK_TIE', title: 'Grand Black Tie Gala', desc: 'Silk satin facings, formal covered buttons, immaculate evening silhouette.' },
  ];

  const lapels: Array<{ id: LapelType; title: string }> = [
    { id: 'PEAK_WIDE', title: 'Wide Peak Lapel (4.25 in)' },
    { id: 'NOTCH_STANDARD', title: 'Standard Notch Lapel (3.5 in)' },
    { id: 'PEAK_TOM_FORD', title: 'Bold Statement Peak (4.75 in)' },
    { id: 'SHAWL_SATIN', title: 'Silk Satin Shawl Lapel' },
  ];

  const buttons: Array<{ id: ButtonConfiguration; title: string }> = [
    { id: 'SINGLE_2_BUTTON', title: 'Single-Breasted 2 Button' },
    { id: 'SINGLE_3_ROLL_2', title: 'Single-Breasted 3-Roll-2' },
    { id: 'DOUBLE_BREASTED_6X2', title: 'Double-Breasted 6x2 (Classic Duke)' },
    { id: 'DOUBLE_BREASTED_4X2', title: 'Double-Breasted 4x2 (Contemporary)' },
  ];

  const pockets: Array<{ id: PocketStyle; title: string }> = [
    { id: 'FLAP_SLANTED_TICKET', title: 'Slanted Flap with Ticket Pocket' },
    { id: 'FLAP_STANDARD', title: 'Straight Flap Pockets' },
    { id: 'JETTED_LUXURY', title: 'Double Jetted Minimalist' },
    { id: 'PATCH_CASUAL', title: 'Rounded Patch Pockets' },
  ];

  const buttonMaterials: Array<{ id: ButtonMaterial; title: string }> = [
    { id: 'GENUINE_HORN_BUFFALO', title: 'Hand-Carved Buffalo Horn (Dark Brown / Smoke)' },
    { id: 'MOTHER_OF_PEARL_AUSTRALIAN', title: 'Australian White Mother-of-Pearl' },
    { id: 'COROZO_NUT_ECO', title: 'Natural Sustainable Corozo Palm Nut' },
    { id: 'ENAMELED_GOLD_CREST', title: '24K Gold-Plated Heraldic Crest Buttons' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gentborder pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase font-semibold text-gold-400 tracking-[0.25em]">
            <Scissors className="w-4 h-4 text-gold-400" />
            <span>Artisanal Master Atelier</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
            Bespoke Suit 3D Configurator
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            Custom-tailor every anatomical curve, choice mill fabric, and monogram detail with master Savile Row cutters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/bespoke/measurements">
            <Button variant="outline" size="sm">
              Biometric Measurements
            </Button>
          </Link>
          <Link to="/bespoke/appointments">
            <Button variant="gold" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
              Book Master Tailor Fitting
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: 3D Visualizer */}
        <div className="lg:col-span-5 space-y-6">
          <Bespoke3DViewer config={currentConfig} fabric={selectedFabric} />

          {/* Pricing Quote Summary Card */}
          {quote && (
            <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gentborder">
                <span className="font-serif font-bold text-white text-base">Bespoke Atelier Quote</span>
                <span className="font-serif font-bold text-2xl text-gold-300">
                  ${quote.totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2 text-xs text-gray-400 font-mono">
                <div className="flex justify-between">
                  <span>Bench-Hand Labor (80+ hours)</span>
                  <span className="text-white">${quote.baseLaborPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mill Fabric ({quote.fabricMetersRequired}m Wool)</span>
                  <span className="text-white">${quote.fabricPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Horsehair Canvas & Finishes</span>
                  <span className="text-white">${(quote.constructionSurcharge + quote.embellishmentsPrice).toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="gold"
                size="md"
                className="w-full mt-4"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/bespoke/appointments')}
              >
                Proceed with this Tailoring Spec
              </Button>
            </div>
          )}
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border-b border-gentborder gap-2">
            {[
              { key: 'STYLE', label: '1. Silhouette & Cut' },
              { key: 'FABRIC', label: '2. Mill Fabric Swatch' },
              { key: 'DETAILS', label: '3. Lapel & Buttons' },
              { key: 'MONOGRAM', label: '4. Monogram & Lining' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-gold-400 text-gold-300'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Silhouette */}
          {activeTab === 'STYLE' && (
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg text-white">Choose Sartorial Silhouette</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {silhouettes.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => dispatch(updateGarmentConfig({ silhouette: s.id }))}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      currentConfig.silhouette === s.id
                        ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                        : 'border-gentborder bg-[#12151b] hover:border-gray-500'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif font-bold text-white text-sm">{s.title}</h4>
                      {currentConfig.silhouette === s.id && (
                        <Check className="w-4 h-4 text-gold-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Mill Fabrics */}
          {activeTab === 'FABRIC' && (
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg text-white">Select Heritage Mill Swatch</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {fabrics.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => dispatch(setSelectedFabric(f))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-3 ${
                      selectedFabric?.id === f.id
                        ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                        : 'border-gentborder bg-[#12151b] hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl border border-white/20 shrink-0"
                        style={{ backgroundColor: f.hexCode }}
                      />
                      <div>
                        <h4 className="font-serif font-bold text-white text-xs">{f.name}</h4>
                        <p className="text-[11px] text-luxury-400 font-mono">{f.mill}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 border-t border-gentborder pt-2">
                      <span>{f.woolGrade}</span>
                      <span className="font-mono text-gold-300">${f.pricePerMeter}/m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Details */}
          {activeTab === 'DETAILS' && (
            <div className="space-y-6">
              {/* Lapels */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-white">Lapel Architecture</h4>
                <div className="grid grid-cols-2 gap-3">
                  {lapels.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => dispatch(updateGarmentConfig({ lapel: l.id }))}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        currentConfig.lapel === l.id
                          ? 'border-gold-400 bg-gold-400/10 text-gold-300 font-semibold'
                          : 'border-gentborder bg-[#12151b] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {l.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-white">Button Stance</h4>
                <div className="grid grid-cols-2 gap-3">
                  {buttons.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => dispatch(updateGarmentConfig({ buttons: b.id }))}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        currentConfig.buttons === b.id
                          ? 'border-gold-400 bg-gold-400/10 text-gold-300 font-semibold'
                          : 'border-gentborder bg-[#12151b] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {b.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pockets */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-white">Pocket Architecture</h4>
                <div className="grid grid-cols-2 gap-3">
                  {pockets.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => dispatch(updateGarmentConfig({ pockets: p.id }))}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        currentConfig.pockets === p.id
                          ? 'border-gold-400 bg-gold-400/10 text-gold-300 font-semibold'
                          : 'border-gentborder bg-[#12151b] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Material */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-white">Button Raw Material</h4>
                <div className="space-y-2">
                  {buttonMaterials.map((bm) => (
                    <button
                      key={bm.id}
                      onClick={() => dispatch(updateGarmentConfig({ buttonMaterial: bm.id }))}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                        currentConfig.buttonMaterial === bm.id
                          ? 'border-gold-400 bg-gold-400/10 text-gold-300 font-semibold'
                          : 'border-gentborder bg-[#12151b] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {bm.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Monogram */}
          {activeTab === 'MONOGRAM' && (
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-lg text-white">Hand-Embroidered Monogram</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300">Monogram Initials / Motto (Up to 8 characters)</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={currentConfig.monogram?.text || ''}
                    onChange={(e) =>
                      dispatch(
                        updateGarmentConfig({
                          monogram: {
                            text: e.target.value.toUpperCase(),
                            font: currentConfig.monogram?.font || 'SCRIPT_TRADITIONAL',
                            threadColor: currentConfig.monogram?.threadColor || 'GOLDEN_ROD',
                            placement: currentConfig.monogram?.placement || 'INSIDE_RIGHT_BREAST',
                          },
                        })
                      )
                    }
                    placeholder="e.g. A.R.B."
                    className="w-full bg-[#12151b] border border-gentborder rounded-xl p-3 text-sm text-white font-serif uppercase tracking-widest mt-1 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
