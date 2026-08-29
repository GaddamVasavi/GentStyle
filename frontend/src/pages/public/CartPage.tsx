import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchCart, updateCartQuantity, removeCartItem } from '../../store/slices/cartSlice';
import { Button } from '../../components/common/Button';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items, summary, isLoading } = useSelector((state: RootState) => state.cart);

  const [promoInput, setPromoInput] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-luxury-400 mx-auto" />
        <h2 className="text-2xl font-serif text-white font-bold">Please Sign In to Access Your Wardrobe</h2>
        <p className="text-xs text-gray-400">Save items, view current selections, and access bespoke member privileges.</p>
        <Link to="/login">
          <Button variant="gold" size="md">Sign In to Continue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-luxury-400 font-semibold">Your Selections</span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">Wardrobe Cart</h1>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">Calculating wardrobe items...</div>
      ) : items.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center border border-gentborder space-y-4">
          <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="font-serif text-xl text-white">Your Wardrobe Cart is Empty</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Discover tailored suits, jackets, oxfords, and accessories from our luxury collection.
          </p>
          <Link to="/shop">
            <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Sartorial Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="glass-panel rounded-2xl p-6 border border-gentborder divide-y divide-gentborder">
              {items.map((item) => {
                const primaryImage =
                  item.product?.images?.find((img) => img.isPrimary)?.imageUrl ||
                  item.product?.images?.[0]?.imageUrl ||
                  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80';

                return (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6">
                    <img
                      src={primaryImage}
                      alt={item.product?.name || 'Item'}
                      className="w-24 sm:w-28 aspect-[3/4] object-cover rounded-xl bg-[#12151b] shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          {item.product?.brand && (
                            <p className="text-[10px] uppercase tracking-widest text-luxury-400 font-semibold">
                              {item.product.brand.name}
                            </p>
                          )}
                          <Link to={`/products/${item.product?.slug}`}>
                            <h3 className="font-serif font-semibold text-white text-base hover:text-gold-300 transition-colors">
                              {item.product?.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 font-mono">
                            <span>Size: {item.variant?.size}</span>
                            <span>•</span>
                            <span>Color: {item.variant?.colorName}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => dispatch(removeCartItem(item.id))}
                          className="text-gray-500 hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-gentborder rounded-lg bg-[#12151b]">
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              dispatch(
                                updateCartQuantity({ itemId: item.id, quantity: item.quantity - 1 })
                              )
                            }
                            className="p-2 text-gray-400 hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-mono text-white font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              dispatch(
                                updateCartQuantity({ itemId: item.id, quantity: item.quantity + 1 })
                              )
                            }
                            className="p-2 text-gray-400 hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-serif font-bold text-white">
                            ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-[11px] text-gray-500 font-mono">
                            ${Number(item.unitPrice).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-6">
              <h3 className="font-serif font-bold text-lg text-white">Order Summary</h3>

              {/* Promo Code Input */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-luxury-400" />
                  <span>Promotional Voucher</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. GENTVIP15"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#12151b] border border-gentborder rounded-lg text-xs px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-luxury-500"
                  />
                  <Button variant="secondary" size="sm">
                    Apply
                  </Button>
                </div>
              </div>

              <div className="space-y-3 text-xs border-t border-gentborder pt-4">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({summary.itemCount} items)</span>
                  <span className="text-white font-mono">${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax</span>
                  <span className="text-white font-mono">${summary.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>White-Glove Courier Delivery</span>
                  <span className="text-emerald-400 font-mono">
                    {summary.shippingFee === 0 ? 'Complimentary' : `$${summary.shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-gentborder">
                  <span>Grand Total</span>
                  <span className="font-serif text-lg text-gold-300">
                    ${summary.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={() => navigate('/checkout')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Checkout
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-luxury-400" />
                <span>Complimentary returns & size alterations</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
