import React from 'react';
import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { User, MapPin, ShoppingBag, Heart, Bell } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { to: '/customer/profile', label: 'My Profile & Security', icon: User },
    { to: '/customer/addresses', label: 'Address Book', icon: MapPin },
    { to: '/customer/orders', label: 'Orders & Deliveries', icon: ShoppingBag },
    { to: '/customer/wishlist', label: 'Saved Collection', icon: Heart },
    { to: '/customer/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-panel rounded-xl p-5 border border-gentborder space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gentborder">
              <div className="w-12 h-12 rounded-full bg-luxury-700 text-white flex items-center justify-center font-serif text-lg font-bold">
                {user?.firstName ? user.firstName[0] : 'G'}
              </div>
              <div className="truncate">
                <h3 className="font-medium text-white text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                        isActive
                          ? 'bg-luxury-600/20 text-luxury-300 border border-luxury-500/40'
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
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <div className="glass-panel rounded-xl p-6 md:p-8 border border-gentborder">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
