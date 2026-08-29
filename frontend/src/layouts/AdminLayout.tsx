import React from 'react';
import { Outlet, NavLink, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Tag,
  Warehouse,
  ShoppingBag,
  CreditCard,
  Percent,
  RotateCcw,
  BarChart3,
  Settings,
  ArrowLeft,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const adminNav = [
    { to: '/admin/dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { to: '/admin/analytics', label: 'Revenue & Analytics', icon: BarChart3 },
    { to: '/admin/orders', label: 'Orders & Shipments', icon: ShoppingBag },
    { to: '/admin/products', label: 'Product Catalog', icon: Package },
    { to: '/admin/categories', label: 'Categories & Brands', icon: Layers },
    { to: '/admin/inventory', label: 'Inventory & Warehousing', icon: Warehouse },
    { to: '/admin/customers', label: 'Clientele Management', icon: Users },
    { to: '/admin/payments', label: 'Payments & Transactions', icon: CreditCard },
    { to: '/admin/coupons', label: 'Coupons & VIP Codes', icon: Percent },
    { to: '/admin/promotions', label: 'Promotions & Flash Sales', icon: Tag },
    { to: '/admin/returns', label: 'Returns & Exchanges', icon: RotateCcw },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07090c] text-gray-200 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0d0f14] border-r border-gentborder flex flex-col shrink-0">
        <div className="p-6 border-b border-gentborder">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-luxury-300 text-xs mb-3 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl tracking-widest font-bold gold-gradient-text uppercase">
              GENTSTYLE
            </span>
            <span className="text-[10px] bg-gold-500/20 text-gold-400 border border-gold-500/30 px-1.5 py-0.5 rounded font-mono font-semibold">
              ADMIN
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'bg-luxury-600/30 text-gold-300 border border-luxury-500/40 font-semibold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gentborder text-xs text-gray-500">
          <p className="font-semibold text-gray-300">Executive Console</p>
          <p className="truncate text-[11px]">{user.email}</p>
        </div>
      </aside>

      {/* Admin Main Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-[#0d0f14]/80 backdrop-blur border-b border-gentborder px-8 flex items-center justify-between sticky top-0 z-30">
          <h2 className="font-serif text-lg text-white font-semibold tracking-wide">
            Administrative Control Center
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs px-3 py-1 bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 rounded-full font-mono">
              ● API Online & Healthy
            </span>
          </div>
        </header>

        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
