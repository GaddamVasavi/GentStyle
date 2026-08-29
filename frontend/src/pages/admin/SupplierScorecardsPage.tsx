import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchSuppliers } from '../../store/slices/supplyChainSlice';
import { Award } from 'lucide-react';

export const SupplierScorecardsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { suppliers } = useSelector((state: RootState) => state.supplyChain);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  return (
    <div className="space-y-8 p-6">
      <div className="border-b border-gentborder pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
          <Award className="w-4 h-4" />
          Mill Quality Scorecards
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          European Heritage Mills & Supplier Ratings
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Live performance audits: On-Time Delivery (OTD), 4-Point fabric defect rates, and ethical wool certifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((s) => (
          <div key={s.id} className="glass-panel rounded-2xl p-6 border border-gentborder space-y-5">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-gold-300 font-bold">{s.vendorCode}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold-950 text-gold-300 border border-gold-800">
                {s.ratingTier.replace(/_/g, ' ')}
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-white text-base">{s.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{s.millRegion}, {s.originCountry}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#12151b] p-4 rounded-xl border border-gentborder text-xs">
              <div>
                <p className="text-gray-400 text-[10px] uppercase">On-Time Delivery</p>
                <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{s.onTimeDeliveryRatePercent}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase">Quality Pass Rate</p>
                <p className="font-mono font-bold text-emerald-400 text-sm mt-0.5">{s.qualityPassRatePercent}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase">Defect Rate (PPM)</p>
                <p className="font-mono font-bold text-white text-sm mt-0.5">{s.defectPpm} ppm</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase">Spend YTD</p>
                <p className="font-serif font-bold text-gold-300 text-sm mt-0.5">${(s.totalSpendYTD / 1000).toFixed(0)}k</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Mill Certifications</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {s.certifications.map((c, i) => (
                  <span key={i} className="text-[10px] bg-black/40 text-gray-300 px-2 py-0.5 rounded border border-white/10">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
