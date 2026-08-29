import React from 'react';
import { BespokeGarmentConfig, LuxuryFabricSwatch } from '../../types/bespoke.types';
import { Sparkles } from 'lucide-react';

interface Bespoke3DViewerProps {
  config: BespokeGarmentConfig;
  fabric: LuxuryFabricSwatch | null;
}

export const Bespoke3DViewer: React.FC<Bespoke3DViewerProps> = ({ config, fabric }) => {
  return (
    <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-gold-400/30 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#151922] to-[#0b0d13] shadow-2xl">
      {/* Top Banner Tag */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gold-400/40 text-gold-300 text-xs font-serif font-bold tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Full Floating Horsehair Canvas</span>
        </div>
        <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase">
          Savile Row 3D Render
        </span>
      </div>

      {/* Main Visualizer Representation */}
      <div className="relative flex-1 w-full flex items-center justify-center my-6">
        <div
          className="relative w-72 h-96 rounded-2xl p-6 flex flex-col justify-between items-center shadow-2xl transition-all duration-700"
          style={{
            backgroundColor: fabric?.hexCode || '#0f172a',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            boxShadow: `0 20px 50px -10px ${fabric?.hexCode || '#000'}88`,
          }}
        >
          {/* Subtle Fabric Weave Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:12px_12px] rounded-2xl pointer-events-none" />

          {/* Lapel & Collar Visual */}
          <div className="w-full flex flex-col items-center text-center space-y-2 z-10">
            <div className="w-20 h-10 border-b-2 border-gold-400/60 rounded-b-xl flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-gold-300">
                {config.lapel.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex gap-8 items-center text-xs font-semibold text-white/90">
              <span className="bg-black/50 px-2.5 py-1 rounded-md border border-white/10">
                {config.silhouette.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Center Details & Monogram */}
          <div className="z-10 text-center space-y-2">
            {config.monogram?.text && (
              <div className="bg-black/60 border border-gold-400/50 px-3 py-1.5 rounded-lg">
                <span className="text-xs font-serif italic text-gold-300 tracking-widest">
                  Monogram: {config.monogram.text}
                </span>
              </div>
            )}
            <p className="text-[11px] font-mono text-gray-300 uppercase tracking-wider">
              {config.buttons.replace(/_/g, ' ')} • {config.buttonMaterial.replace(/_/g, ' ')}
            </p>
          </div>

          {/* Bottom Hem & Pocket Styles */}
          <div className="w-full flex justify-between items-center text-[10px] font-mono text-gray-300 uppercase z-10 pt-2 border-t border-white/10">
            <span>{config.pockets.replace(/_/g, ' ')}</span>
            <span>{config.vents.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Fabric Info Strip */}
      <div className="w-full bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-gentborder flex items-center justify-between z-10">
        <div>
          <p className="text-xs font-serif font-bold text-white">{fabric?.name || 'Selected Luxury Fabric'}</p>
          <p className="text-[11px] text-luxury-400 font-mono">
            {fabric?.mill} • {fabric?.woolGrade} ({fabric?.weightGsm}g/m)
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Origin</p>
          <p className="text-xs font-semibold text-gray-200">{fabric?.originCountry}</p>
        </div>
      </div>
    </div>
  );
};
