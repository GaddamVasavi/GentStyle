import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchCustomers } from '../../store/slices/crmAnalyticsSlice';
import { Users, Search, Mail, Phone } from 'lucide-react';

export const Customer360Page: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers } = useSelector((state: RootState) => state.crmAnalytics);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <div className="border-b border-gentborder pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          Client Relationship Management
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          Customer 360 & Wardrobe Profiles
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Comprehensive private client dossiers: Lifetime value, predicted 12-month CLV, anatomical sizes, and sartorial preferences.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search VIP patron by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12151b] border border-gentborder rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((c) => (
            <div key={c.id} className="glass-panel rounded-2xl p-6 border border-gentborder space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gold-950 text-gold-300 border border-gold-800">
                  {c.vipTier.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">{c.rfmSegment}</span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-white text-base">{c.fullName}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Mail className="w-3 h-3 text-luxury-400" />
                  <span>{c.email}</span>
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-luxury-400" />
                  <span>{c.phone}</span>
                </p>
              </div>

              <div className="bg-[#12151b] p-3 rounded-xl border border-gentborder grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Lifetime Value</p>
                  <p className="font-serif font-bold text-gold-300 text-sm">${c.lifetimeValueUsd.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Predicted 12M CLV</p>
                  <p className="font-serif font-bold text-emerald-400 text-sm">${c.predictedFutureCLV12Months.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Jacket Size</p>
                  <p className="font-mono text-white text-xs">{c.suitChestSize}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Waist Size</p>
                  <p className="font-mono text-white text-xs">{c.trouserWaistSize}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-mono text-gray-400">Atelier Notes</p>
                <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                  {c.notes.map((n, i) => (
                    <li key={i} className="line-clamp-1">{n}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
