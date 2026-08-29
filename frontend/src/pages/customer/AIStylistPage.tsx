import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchOutfitRecommendations } from '../../store/slices/crmAnalyticsSlice';
import { Sparkles } from 'lucide-react';

export const AIStylistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { outfits } = useSelector((state: RootState) => state.crmAnalytics);
  const [selectedOccasion, setSelectedOccasion] = useState('');

  useEffect(() => {
    dispatch(fetchOutfitRecommendations(selectedOccasion || undefined));
  }, [selectedOccasion, dispatch]);

  const occasions = [
    { id: '', label: 'All Dress Codes' },
    { id: 'BOARDROOM_EXECUTIVE', label: 'Executive Boardroom' },
    { id: 'BLACK_TIE_GALA', label: 'Black Tie Gala' },
    { id: 'SUMMER_RIVIERA', label: 'Amalfi Coast Riviera' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Algorithmic Sartorialist
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          AI Color Theory & Ensemble Matcher
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Expert styling rules: Lapel stance, silk tie drape, pocket square fold geometry, and footwear leather harmony.
        </p>
      </div>

      {/* Occasion Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {occasions.map((occ) => (
          <button
            key={occ.id}
            onClick={() => setSelectedOccasion(occ.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all ${
              selectedOccasion === occ.id
                ? 'bg-gold-400 text-gentblack font-bold shadow-lg shadow-gold-500/20'
                : 'glass-panel text-gray-400 hover:text-white border border-gentborder'
            }`}
          >
            {occ.label}
          </button>
        ))}
      </div>

      {/* Outfits Grid */}
      <div className="space-y-6">
        {outfits.map((outfit) => (
          <div key={outfit.id} className="glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gentborder pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded">
                    {outfit.harmonyRule} Harmony
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    Formality Index: <strong className="text-white">{outfit.formalityScoreOutOf100}/100</strong>
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mt-1">{outfit.ensembleTitle}</h3>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl">{outfit.curatedDescription}</p>
              </div>
            </div>

            {/* Component Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-[#12151b] p-4 rounded-xl border border-gentborder space-y-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.components.suit.colorHex }} />
                <p className="text-[10px] text-gray-400 uppercase font-mono">1. Tailored Jacket</p>
                <p className="text-xs font-bold text-white line-clamp-2">{outfit.components.suit.name}</p>
                <p className="text-[11px] text-luxury-400 font-mono">{outfit.components.suit.lapel}</p>
              </div>

              <div className="bg-[#12151b] p-4 rounded-xl border border-gentborder space-y-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.components.shirt.colorHex }} />
                <p className="text-[10px] text-gray-400 uppercase font-mono">2. Dress Shirt</p>
                <p className="text-xs font-bold text-white line-clamp-2">{outfit.components.shirt.name}</p>
                <p className="text-[11px] text-luxury-400 font-mono">{outfit.components.shirt.collar}</p>
              </div>

              <div className="bg-[#12151b] p-4 rounded-xl border border-gentborder space-y-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.components.tieOrBowtie.colorHex }} />
                <p className="text-[10px] text-gray-400 uppercase font-mono">3. Silk Cravat / Tie</p>
                <p className="text-xs font-bold text-white line-clamp-2">{outfit.components.tieOrBowtie.name}</p>
                <p className="text-[11px] text-luxury-400 font-mono">{outfit.components.tieOrBowtie.pattern}</p>
              </div>

              <div className="bg-[#12151b] p-4 rounded-xl border border-gentborder space-y-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.components.pocketSquare.colorHex }} />
                <p className="text-[10px] text-gray-400 uppercase font-mono">4. Pocket Square</p>
                <p className="text-xs font-bold text-white line-clamp-2">{outfit.components.pocketSquare.name}</p>
                <p className="text-[11px] text-luxury-400 font-mono">{outfit.components.pocketSquare.foldType}</p>
              </div>

              <div className="bg-[#12151b] p-4 rounded-xl border border-gentborder space-y-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: outfit.components.footwear.colorHex }} />
                <p className="text-[10px] text-gray-400 uppercase font-mono">5. Footwear</p>
                <p className="text-xs font-bold text-white line-clamp-2">{outfit.components.footwear.name}</p>
                <p className="text-[11px] text-luxury-400 font-mono">{outfit.components.footwear.style}</p>
              </div>
            </div>

            {/* Etiquette Tips */}
            <div className="bg-black/30 p-4 rounded-xl border border-gentborder/60 space-y-2">
              <p className="text-[10px] text-gold-400 uppercase tracking-widest font-mono font-bold">
                Sartorial Etiquette Rulebook
              </p>
              <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                {outfit.etiquetteNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
