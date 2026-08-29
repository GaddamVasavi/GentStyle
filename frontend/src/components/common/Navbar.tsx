import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { openAuthModal, toggleMobileNav } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import {
  ShoppingBag,
  Heart,
  Search,
  User as UserIcon,
  ChevronDown,
  LogOut,
  Shield,
  MapPin,
  Menu,
  Sparkles,
} from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#07080a] text-[11px] text-luxury-200 py-1.5 px-4 border-b border-white/5 flex items-center justify-between tracking-widest uppercase">
        <div className="hidden md:flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span>Complimentary Bespoke Tailoring & Global Express Courier On Orders $250+</span>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto md:gap-6">
          <span className="md:hidden">Bespoke Men's Luxury Fashion</span>
          <div className="flex items-center gap-4 text-gray-400">
            <Link to="/contact" className="hover:text-luxury-300 transition-colors">Concierge</Link>
            <Link to="/about" className="hover:text-luxury-300 transition-colors">Our Heritage</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-panel border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleMobileNav())}
            className="lg:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-2xl tracking-[0.25em] font-bold gold-gradient-text uppercase">
              GENTSTYLE
            </span>
            <span className="text-[9px] tracking-[0.4em] uppercase text-gray-400 -mt-1 group-hover:text-luxury-400 transition-colors">
              Haute Menswear & Sartoria
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-widest uppercase text-gray-300">
          <Link to="/shop" className="hover:text-luxury-400 transition-colors">Shop All</Link>
          <Link to="/categories/suits-blazers" className="hover:text-luxury-400 transition-colors">Suits & Blazers</Link>
          <Link to="/categories/shirts" className="hover:text-luxury-400 transition-colors">Shirts</Link>
          <Link to="/categories/trousers-jeans" className="hover:text-luxury-400 transition-colors">Trousers & Denim</Link>
          <Link to="/categories/shoes" className="hover:text-luxury-400 transition-colors">Footwear</Link>
          <Link to="/categories/watches-accessories" className="hover:text-luxury-400 transition-colors">Accessories</Link>
          <Link to="/collections" className="text-gold-400 hover:text-gold-300 flex items-center gap-1">
            <span>Collections</span>
            <span className="text-[9px] bg-luxury-900 border border-luxury-500/40 text-luxury-300 px-1.5 py-0.5 rounded">NEW</span>
          </Link>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Trigger */}
          <Link
            to="/search"
            className="p-2 text-gray-300 hover:text-luxury-400 rounded-full hover:bg-white/5 transition-colors"
            title="Search Catalog"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* Wishlist */}
          <Link
            to="/customer/wishlist"
            className="p-2 text-gray-300 hover:text-luxury-400 rounded-full hover:bg-white/5 transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="p-2 text-gray-300 hover:text-luxury-400 rounded-full hover:bg-white/5 transition-colors relative"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>

          {/* User Account / Auth */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-white/5 border border-gentborder transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-luxury-700 text-white flex items-center justify-center text-xs font-serif font-bold">
                  {user.firstName[0]}
                </div>
                <span className="hidden md:inline text-xs text-gray-200 font-medium max-w-[90px] truncate">
                  {user.firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 glass-dropdown rounded-xl shadow-2xl py-2 z-50 text-xs text-gray-200"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gentborder">
                    <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] bg-luxury-900/80 text-luxury-300 rounded border border-luxury-600/40 uppercase">
                      {user.role}
                    </span>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 hover:bg-luxury-900/40 text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Executive Console</span>
                    </Link>
                  )}

                  <Link
                    to="/customer/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-luxury-400" />
                    <span>My Profile & Security</span>
                  </Link>

                  <Link
                    to="/customer/addresses"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-luxury-400" />
                    <span>Address Book</span>
                  </Link>

                  <Link
                    to="/customer/orders"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-luxury-400" />
                    <span>Order History & Returns</span>
                  </Link>

                  <div className="border-t border-gentborder mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(openAuthModal('login'))}
              leftIcon={<UserIcon className="w-3.5 h-3.5" />}
            >
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};
