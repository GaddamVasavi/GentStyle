import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchCart,
  closeCartDrawer,
  updateCartQuantity,
  removeCartItem,
} from '../../store/slices/cartSlice';
import { Button } from '../common/Button';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items, summary, isDrawerOpen } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    dispatch(closeCartDrawer());
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(closeCartDrawer())}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b0d10] border-l border-gentborder flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gentborder flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h2 className="font-serif font-bold text-lg text-white">Your Wardrobe Cart</h2>
              <span className="text-xs text-gray-500 font-mono">({summary.itemCount})</span>
            </div>
            <button
              onClick={() => dispatch(closeCartDrawer())}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
                <p className="font-serif text-white text-base">Your wardrobe is empty</p>
                <p className="text-xs text-gray-400">Discover hand-tailored luxury garments in our catalog.</p>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    dispatch(closeCartDrawer());
                    navigate('/shop');
                  }}
                >
                  Explore Catalog
                </Button>
              </div>
            ) : (
              items.map((item) => {
                const primaryImage =
                  item.product?.images?.find((img) => img.isPrimary)?.imageUrl ||
                  item.product?.images?.[0]?.imageUrl ||
                  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80';

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 glass-panel rounded-xl border border-gentborder/70 relative group"
                  >
                    <img
                      src={primaryImage}
                      alt={item.product?.name || 'Garment'}
                      className="w-20 h-24 object-cover rounded-lg bg-[#12151b] shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-serif font-semibold text-white line-clamp-1">
                            {item.product?.name}
                          </h4>
                          <button
                            onClick={() => dispatch(removeCartItem(item.id))}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                          {item.variant?.size} / {item.variant?.colorName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-gentborder rounded-md bg-[#12151b]">
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              dispatch(
                                updateCartQuantity({ itemId: item.id, quantity: item.quantity - 1 })
                              )
                            }
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono text-white">{item.quantity}</span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateCartQuantity({ itemId: item.id, quantity: item.quantity + 1 })
                              )
                            }
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-serif font-bold text-white">
                          ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gentborder bg-[#0e1116] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax</span>
                  <span className="text-white font-mono">${summary.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>White-Glove Shipping</span>
                  <span className="text-emerald-400 font-mono">
                    {summary.shippingFee === 0 ? 'Complimentary' : `$${summary.shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gentborder">
                  <span>Total</span>
                  <span className="font-serif text-base text-gold-300">
                    ${summary.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Bespoke Checkout
                </Button>
                <Link
                  to="/cart"
                  onClick={() => dispatch(closeCartDrawer())}
                  className="block text-center text-xs text-luxury-400 hover:text-luxury-300 py-1 font-semibold uppercase tracking-wider"
                >
                  View Full Wardrobe Cart
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-luxury-400" />
                <span>Encrypted 256-Bit SSL Checkout Protection</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
