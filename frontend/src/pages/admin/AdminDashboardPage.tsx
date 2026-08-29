import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  AlertTriangle,
  RotateCcw,
  ArrowUpRight,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const stats = [
    { title: 'Total Revenue', value: '$128,450.00', change: '+18.4%', isPositive: true, icon: DollarSign },
    { title: 'Active Orders', value: '42 Orders', change: '+8.2%', isPositive: true, icon: ShoppingBag },
    { title: 'Registered Clientele', value: '1,280 Clients', change: '+24.1%', isPositive: true, icon: Users },
    { title: 'Catalog Items', value: '315 SKUs', change: '+12 new', isPositive: true, icon: Package },
  ];

  const recentOrders = [
    { id: 'ORD-8921', client: 'Lord Harrison', items: 'Italian Double-Breasted Suit', total: '$890.00', status: 'PROCESSING', date: '10 mins ago' },
    { id: 'ORD-8920', client: 'James Bond', items: 'Oxford Egyptian Cotton Shirt (White/L)', total: '$145.00', status: 'CONFIRMED', date: '35 mins ago' },
    { id: 'ORD-8919', client: 'Marcus Vance', items: 'Goodyear Welt Oxford Shoes', total: '$420.00', status: 'SHIPPED', date: '2 hours ago' },
    { id: 'ORD-8918', client: 'Sir Arthur Pendelton', items: 'Super 180s Bespoke Tuxedo Set', total: '$1,450.00', status: 'DELIVERED', date: '5 hours ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-white">Executive Control Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time performance metrics across orders, catalog, revenue, and customer activity.</p>
      </div>

      {/* High-level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="glass-panel p-6 rounded-xl border border-gentborder flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-serif font-bold text-white">{stat.value}</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium pt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stat.change} vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-luxury-950 border border-luxury-500/30 rounded-xl text-gold-400">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 border border-gentborder space-y-4">
          <div className="flex items-center justify-between border-b border-gentborder pb-4">
            <h3 className="font-serif text-base font-bold text-white">Live Orders Dispatch</h3>
            <span className="text-xs text-luxury-400 hover:underline cursor-pointer flex items-center gap-1">
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 uppercase text-[10px] tracking-wider border-b border-gentborder">
                <tr>
                  <th className="pb-3">Order No</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gentborder text-gray-300">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5">
                    <td className="py-3.5 font-mono text-gold-400 font-semibold">{ord.id}</td>
                    <td className="py-3.5 font-medium text-white">{ord.client}</td>
                    <td className="py-3.5 text-gray-400 truncate max-w-[180px]">{ord.items}</td>
                    <td className="py-3.5 font-medium text-white">{ord.total}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-luxury-900 border border-luxury-600 text-luxury-300">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Alerts & Low Stock Notice */}
        <div className="glass-panel rounded-xl p-6 border border-gentborder space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-white">Priority Actions</h3>
            
            <div className="space-y-3">
              <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-amber-200">3 Low Stock Alerts</p>
                  <p className="text-gray-400">Milano Wool Blazer (Size 42R) has dropped below threshold.</p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-lg flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-blue-200">1 Exchange Request Pending</p>
                  <p className="text-gray-400">Client requested size swap (M to L) on Oxford Dress Shirt.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gentborder text-xs text-gray-400">
            System status: All services operational. Redis cache active.
          </div>
        </div>
      </div>
    </div>
  );
};
