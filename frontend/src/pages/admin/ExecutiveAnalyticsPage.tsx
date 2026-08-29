import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchExecutiveKPIs, fetchRevenueForecasts } from '../../store/slices/crmAnalyticsSlice';
import { TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';

export const ExecutiveAnalyticsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { kpis, forecasts } = useSelector((state: RootState) => state.crmAnalytics);

  useEffect(() => {
    dispatch(fetchExecutiveKPIs());
    dispatch(fetchRevenueForecasts());
  }, [dispatch]);

  return (
    <div className="space-y-8 p-6">
      <div className="border-b border-gentborder pb-6">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" />
          Executive Sartorial Intelligence
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          Revenue Forecasting & Atelier Utilization
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Predictive sales analytics across Bespoke Atelier commissions, European Ready-to-Wear, and master cutter capacity.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs uppercase font-mono">Gross Merchandise Value</span>
            <DollarSign className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-white">
            ${kpis ? (kpis.grossMerchandiseVolumeYTD / 1000000).toFixed(2) : '14.25'}M
          </p>
          <p className="text-[11px] text-emerald-400 font-mono">+38.4% YoY Expansion</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs uppercase font-mono">Average Order Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-white">
            ${kpis ? kpis.averageOrderValue.toFixed(0) : '2,840'}
          </p>
          <p className="text-[11px] text-gray-400 font-mono">Driven by 3-Piece Bespoke Suiting</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs uppercase font-mono">Gross Profit Margin</span>
            <PieChart className="w-4 h-4 text-luxury-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-400">
            {kpis ? kpis.grossMarginPercent : 64.5}%
          </p>
          <p className="text-[11px] text-gray-400 font-mono">Direct Mill Partnerships (Zero Middlemen)</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-2">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs uppercase font-mono">Atelier Bench Utilization</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-serif font-bold text-white">
            {kpis ? kpis.tailorBenchUtilizationPercent : 92.3}%
          </p>
          <p className="text-[11px] text-amber-400 font-mono">Optimal Capacity (Savile Row & Milan)</p>
        </div>
      </div>

      {/* 12-Month Forecast Table */}
      <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-4">
        <h3 className="font-serif font-bold text-lg text-white">Fiscal 2026 Monthly Sartorial Revenue Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gentborder text-gray-400 font-mono text-[10px] uppercase pb-2">
                <th className="pb-3">Month</th>
                <th className="pb-3">Bespoke Commissions</th>
                <th className="pb-3">Ready-to-Wear</th>
                <th className="pb-3">Accessories & Trims</th>
                <th className="pb-3">Total Target</th>
                <th className="pb-3 text-right">YoY Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gentborder/40">
              {forecasts.map((f, i) => (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-medium text-white">{f.month}</td>
                  <td className="py-3 font-mono text-gold-300">${(f.bespokeRevenueUsd / 1000).toFixed(0)}k</td>
                  <td className="py-3 font-mono text-gray-300">${(f.readyToWearRevenueUsd / 1000).toFixed(0)}k</td>
                  <td className="py-3 font-mono text-gray-400">${(f.accessoriesRevenueUsd / 1000).toFixed(0)}k</td>
                  <td className="py-3 font-serif font-bold text-white">${(f.forecastedRevenueUsd / 1000).toFixed(0)}k</td>
                  <td className="py-3 font-mono text-emerald-400 text-right">+{f.growthRateYoYPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
