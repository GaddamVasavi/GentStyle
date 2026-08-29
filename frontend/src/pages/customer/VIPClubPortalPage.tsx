import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchMyLoyalty, fetchProvenanceCertificates } from '../../store/slices/crmAnalyticsSlice';
import { Crown, Gem, UserCheck, ExternalLink } from 'lucide-react';

export const VIPClubPortalPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loyaltyAccount, certificates } = useSelector((state: RootState) => state.crmAnalytics);

  useEffect(() => {
    dispatch(fetchMyLoyalty());
    dispatch(fetchProvenanceCertificates());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gentborder pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
            <Crown className="w-4 h-4" />
            GentStyle Sartorial Society
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            VIP Concierge & Privilege Club
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Private sartorial privileges, Milan trunk show credentials, and blockchain-verified garment provenance.
          </p>
        </div>

        <div className="bg-gradient-to-r from-gold-500/20 to-gold-400/5 px-4 py-2 rounded-2xl border border-gold-400/40 flex items-center gap-3">
          <Gem className="w-6 h-6 text-gold-400" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Active Status</p>
            <p className="font-serif font-bold text-white text-sm">
              {loyaltyAccount?.tier.replace(/_/g, ' ') || 'Sartorial Member'}
            </p>
          </div>
        </div>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Sartorial Points Balance</p>
          <p className="text-3xl font-serif font-bold text-gold-300">
            {loyaltyAccount?.currentPoints.toLocaleString() || '24,500'}
          </p>
          <p className="text-[11px] text-gray-500 font-mono">1.5x Points Accrual on Bespoke Commissions</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Spend YTD (Fiscal 2026)</p>
          <p className="text-3xl font-serif font-bold text-white">
            ${loyaltyAccount?.spendYTD.toLocaleString() || '18,450'}
          </p>
          <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-gold-400 h-full rounded-full" style={{ width: '55%' }} />
          </div>
          <p className="text-[10px] text-luxury-400 font-mono pt-1">$16,550 to Platinum Bespoke Ambassador</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Private Client Concierge</p>
          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-full bg-luxury-900 border border-gold-400/50 flex items-center justify-center text-gold-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-white text-xs">{loyaltyAccount?.assignedConciergeName || 'Dott. Alessandro Visconti'}</p>
              <p className="text-[11px] text-gray-400 font-mono">Senior Private Client Director</p>
            </div>
          </div>
        </div>
      </div>

      {/* Provenance Certificates */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder space-y-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">Garment Provenance Ledger</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Cryptographically signed archival records verifying your bespoke pieces' European mill origins and master cutter signatures.
          </p>
        </div>

        <div className="space-y-4">
          {certificates.map((c) => (
            <div key={c.id} className="bg-[#12151b] rounded-2xl p-5 border border-gentborder flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-gold-300">{c.certificateNumber}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                    Verified Authentic
                  </span>
                </div>
                <h4 className="font-serif font-bold text-white text-sm">{c.garmentName}</h4>
                <p className="text-xs text-gray-400 font-mono">
                  {c.fabricMill} • {c.woolSuperGrade} • Cut by {c.masterTailor}
                </p>
              </div>

              <a
                href={c.blockchainVerificationUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-200 font-semibold"
              >
                <span>Inspect Provenance Certificate</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
