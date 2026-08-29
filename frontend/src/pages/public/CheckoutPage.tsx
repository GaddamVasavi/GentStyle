import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchCart } from '../../store/slices/cartSlice';
import { placeOrder } from '../../store/slices/orderSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  MapPin,
  Banknote,
  Plus,
} from 'lucide-react';
import { addressService } from '../../services/address.service';
import { Address } from '../../types/auth.types';

export const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items, summary } = useSelector((state: RootState) => state.cart);
  const { isLoading: isPlacingOrder } = useSelector((state: RootState) => state.orders);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'RAZORPAY' | 'CASH_ON_DELIVERY'>('STRIPE');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [couponCode] = useState('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New address form state
  const [fullName, setFullName] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const loadAddresses = async () => {
    try {
      const res = await addressService.getAddresses();
      const addrList: Address[] = res.data || [];
      setAddresses(addrList);
      if (addrList.length > 0 && !selectedAddressId) {
        const defaultAddr = addrList.find((a: Address) => a.isDefaultShipping) || addrList[0];
        setSelectedAddressId(defaultAddr.id);
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchCart());
    loadAddresses();
  }, [isAuthenticated, dispatch, navigate]);

  const handleCreateNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addressService.createAddress({
        fullName: fullName || 'Valued Client',
        streetAddress1: newStreet,
        city: newCity,
        state: newState,
        postalCode: newPostalCode,
        country: 'United States',
        phone: newPhone,
        isDefaultShipping: addresses.length === 0,
      });
      dispatch(addToast({ type: 'success', message: 'Shipping address added' }));
      await loadAddresses();
      setSelectedAddressId(res.data.id);
      setIsAddingNewAddress(false);
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Failed to save address' }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      dispatch(addToast({ type: 'error', message: 'Please select a shipping address' }));
      return;
    }

    try {
      const result = await dispatch(
        placeOrder({
          shippingAddressId: selectedAddressId,
          paymentMethod,
          couponCode: couponCode || undefined,
          specialInstructions: specialInstructions || undefined,
        })
      ).unwrap();

      dispatch(addToast({ type: 'success', message: 'Acquisition confirmed! Order placed successfully.' }));
      navigate(`/customer/orders/${result.id}`);
    } catch (err: any) {
      dispatch(addToast({ type: 'error', message: err || 'Failed to place order' }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif text-white font-bold">Your Wardrobe is Empty</h2>
        <p className="text-xs text-gray-400">Add garments to your cart before proceeding to checkout.</p>
        <Button variant="gold" size="md" onClick={() => navigate('/shop')}>
          Return to Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-gentborder pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-400 font-semibold">White-Glove Service</span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">Bespoke Checkout</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>256-Bit Encrypted Secure Channel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Steps (Address & Payment) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Shipping Address */}
          <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-gold-400 text-gentblack font-bold font-mono text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-serif font-bold text-lg text-white">Delivery Destination</h3>
              </div>

              {!isAddingNewAddress && (
                <button
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs text-luxury-400 hover:text-luxury-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Address</span>
                </button>
              )}
            </div>

            {isAddingNewAddress ? (
              <form onSubmit={handleCreateNewAddress} className="space-y-4 pt-2">
                <Input
                  label="Full Name"
                  placeholder="Lord / Sir / Mr. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Street Address"
                  placeholder="e.g. 742 Evergreen Terrace, Suite 400"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="New York"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    required
                  />
                  <Input
                    label="State / Province"
                    placeholder="NY"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Postal Code"
                    placeholder="10001"
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    required
                  />
                  <Input
                    label="Recipient Contact Phone"
                    placeholder="+1 (555) 000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingNewAddress(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm">
                    Save and Deliver Here
                  </Button>
                </div>
              </form>
            ) : addresses.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <MapPin className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-xs text-gray-400">No saved delivery addresses found.</p>
                <Button variant="gold" size="sm" onClick={() => setIsAddingNewAddress(true)}>
                  Add Shipping Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr: Address) => (
                  <label
                    key={addr.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedAddressId === addr.id
                        ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                        : 'border-gentborder bg-[#12151b] hover:border-gray-500'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <input
                          type="radio"
                          name="shippingAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="accent-gold-400"
                        />
                        {addr.isDefaultShipping && (
                          <span className="text-[10px] uppercase font-semibold text-gold-400 bg-black/40 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white font-medium mt-2">{addr.streetAddress1}</p>
                      <p className="text-xs text-gray-400">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p className="text-[11px] text-gray-500 font-mono">{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Step 2: Payment Method */}
          <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-gold-400 text-gentblack font-bold font-mono text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-serif font-bold text-lg text-white">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stripe */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center space-y-2 ${
                  paymentMethod === 'STRIPE'
                    ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                    : 'border-gentborder bg-[#12151b] hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="STRIPE"
                  checked={paymentMethod === 'STRIPE'}
                  onChange={() => setPaymentMethod('STRIPE')}
                  className="accent-gold-400"
                />
                <CreditCard className="w-6 h-6 text-luxury-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Credit / Debit Card</p>
                  <p className="text-[10px] text-gray-400">Visa, Mastercard, Amex</p>
                </div>
              </label>

              {/* Razorpay */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center space-y-2 ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                    : 'border-gentborder bg-[#12151b] hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                  className="accent-gold-400"
                />
                <ShieldCheck className="w-6 h-6 text-luxury-400" />
                <div>
                  <p className="text-xs font-semibold text-white">NetBanking / UPI</p>
                  <p className="text-[10px] text-gray-400">Razorpay Gateway</p>
                </div>
              </label>

              {/* COD */}
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center space-y-2 ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                    : 'border-gentborder bg-[#12151b] hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH_ON_DELIVERY"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="accent-gold-400"
                />
                <Banknote className="w-6 h-6 text-luxury-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Doorstep Concierge</p>
                  <p className="text-[10px] text-gray-400">Pay upon delivery</p>
                </div>
              </label>
            </div>

            {/* Special Bespoke Instructions */}
            <div className="pt-4 border-t border-gentborder space-y-2">
              <label className="text-xs font-semibold text-gray-300">
                Special Delivery or Tailoring Notes
              </label>
              <textarea
                placeholder="e.g. Leave with building doorman or tailor trousers with 1.5 inch cuff..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                className="w-full bg-[#12151b] border border-gentborder rounded-xl p-3 text-xs text-white focus:outline-none focus:border-luxury-500"
              />
            </div>
          </section>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder space-y-6">
            <h3 className="font-serif font-bold text-lg text-white">Acquisition Breakdown</h3>

            {/* Mini items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 divide-y divide-gentborder/60">
              {items.map((item) => {
                const primaryImg =
                  item.product?.images?.find((i) => i.isPrimary)?.imageUrl ||
                  item.product?.images?.[0]?.imageUrl;

                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={primaryImg}
                        alt=""
                        className="w-10 h-12 object-cover rounded bg-[#12151b] shrink-0"
                      />
                      <div>
                        <p className="text-white font-medium line-clamp-1">{item.product?.name}</p>
                        <p className="text-[11px] text-gray-400 font-mono">
                          Qty: {item.quantity} • {item.variant?.size}
                        </p>
                      </div>
                    </div>
                    <span className="font-serif font-semibold text-white">
                      ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs border-t border-gentborder pt-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-mono">${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Sales Tax (8.25%)</span>
                <span className="text-white font-mono">${summary.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Expedited Courier Delivery</span>
                <span className="text-emerald-400 font-mono">
                  {summary.shippingFee === 0 ? 'Complimentary' : `$${summary.shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-gentborder">
                <span>Total Due</span>
                <span className="font-serif text-xl text-gold-300">
                  ${summary.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !selectedAddressId}
            >
              {isPlacingOrder ? 'Confirming Acquisition...' : 'Complete Acquisition'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
