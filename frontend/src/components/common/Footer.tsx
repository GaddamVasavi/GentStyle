import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090c] text-gray-400 border-t border-gentborder mt-20">
      {/* Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gentborder">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="p-3 rounded-xl bg-luxury-950/60 border border-luxury-500/30 text-luxury-400">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-white font-serif tracking-wider text-sm font-semibold">Artisanal Mastercraft</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Hand-finished garments utilizing Super 150s+ merino wools, Egyptian cotton, and Italian full-grain leathers.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="p-3 rounded-xl bg-luxury-950/60 border border-luxury-500/30 text-luxury-400">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-serif tracking-wider text-sm font-semibold">Worldwide White-Glove Shipping</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Express bonded logistics with tamper-evident garment bags and guaranteed on-time delivery tracking.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="p-3 rounded-xl bg-luxury-950/60 border border-luxury-500/30 text-luxury-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-white font-serif tracking-wider text-sm font-semibold">Seamless 30-Day Exchanges</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Complimentary doorstep pickup for size swaps and bespoke alterations with hassle-free returns.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="p-3 rounded-xl bg-luxury-950/60 border border-luxury-500/30 text-luxury-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-serif tracking-wider text-sm font-semibold">Encrypted Sentry Payments</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              PCI-DSS Level 1 compliant infrastructure with Stripe and multi-layered tokenized payment shields.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl tracking-[0.2em] font-bold gold-gradient-text uppercase">
                GENTSTYLE
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              The international destination for the discerning modern gentleman. Curating bespoke sartorial excellence, luxury formalwear, and elevated casual attire.
            </p>
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-widest text-luxury-300 font-semibold mb-2">Subscribe to The Sartorial Journal</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-[#12151b] border border-gentborder text-xs px-3 py-2 rounded text-white focus:outline-none focus:border-luxury-500 w-full"
                />
                <button className="bg-luxury-600 hover:bg-luxury-500 text-white text-xs uppercase tracking-wider px-4 py-2 rounded font-medium transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Wardrobe</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/categories/suits-blazers" className="hover:text-luxury-300">Suits & Tuxedos</Link></li>
              <li><Link to="/categories/shirts" className="hover:text-luxury-300">Bespoke Dress Shirts</Link></li>
              <li><Link to="/categories/jackets-coats" className="hover:text-luxury-300">Overcoats & Leather</Link></li>
              <li><Link to="/categories/trousers-jeans" className="hover:text-luxury-300">Pleated Trousers</Link></li>
              <li><Link to="/categories/shoes" className="hover:text-luxury-300">Goodyear Welt Shoes</Link></li>
              <li><Link to="/categories/watches-accessories" className="hover:text-luxury-300">Timepieces & Silk</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Collections</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/collections/office-wear" className="hover:text-luxury-300">Boardroom & Office</Link></li>
              <li><Link to="/collections/wedding-collection" className="hover:text-luxury-300">Wedding & Black Tie</Link></li>
              <li><Link to="/collections/weekend-casual" className="hover:text-luxury-300">Weekend Casual</Link></li>
              <li><Link to="/collections/summer-collection" className="hover:text-luxury-300">Riviera Summer</Link></li>
              <li><Link to="/collections/winter-collection" className="hover:text-luxury-300">Alpine Winter</Link></li>
              <li><Link to="/collections/premium-collection" className="hover:text-luxury-300">Royal Sovereign</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">Client Concierge</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/customer/orders" className="hover:text-luxury-300">Order Tracking</Link></li>
              <li><Link to="/customer/returns" className="hover:text-luxury-300">Return & Exchange</Link></li>
              <li><Link to="/size-guide" className="hover:text-luxury-300">Sartorial Size Guide</Link></li>
              <li><Link to="/contact" className="hover:text-luxury-300">VIP Concierge Service</Link></li>
              <li><Link to="/about" className="hover:text-luxury-300">Heritage & Craft</Link></li>
              <li><Link to="/terms" className="hover:text-luxury-300">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gentborder/60 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} GentStyle Luxury Sartoria Ltd. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Security: 256-Bit SSL Encrypted</span>
            <span>Worldwide Curated Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
