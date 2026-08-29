import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchOrderDetails } from '../../store/slices/orderSlice';
import { Button } from '../../components/common/Button';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  ArrowLeft,
} from 'lucide-react';
import { OrderStatus } from '../../types/order.types';

export const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder: order, isLoading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [id, dispatch]);

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-gray-400">Loading order dispatch details...</div>;
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif text-white">Order Record Not Found</h2>
        <Link to="/customer/orders">
          <Button variant="gold" size="sm">Back to My Orders</Button>
        </Link>
      </div>
    );
  }

  const steps: Array<{ status: OrderStatus; label: string; icon: any }> = [
    { status: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed', icon: CreditCard },
    { status: 'PROCESSING_TAILORING', label: 'Artisanal Tailoring', icon: Clock },
    { status: 'QUALITY_INSPECTION', label: 'Master Quality Check', icon: CheckCircle2 },
    { status: 'DISPATCHED_CARRIER', label: 'Carrier Dispatched', icon: Truck },
    { status: 'DELIVERED', label: 'Doorstep Delivered', icon: Package },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gentborder pb-6">
        <div>
          <Link
            to="/customer/orders"
            className="inline-flex items-center gap-1.5 text-xs text-luxury-400 hover:text-luxury-300 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Order #{order.orderNumber}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'full' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileText className="w-4 h-4" />}
            onClick={() => alert(`Downloading Digital Invoice: INV-${order.orderNumber}`)}
          >
            Download Invoice
          </Button>
        </div>
      </div>

      {/* Visual Lifecycle Stepper */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder">
        <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-400 font-semibold mb-6">
          Dispatch & Tailoring Timeline
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {steps.map((step) => (
            <div key={step.status} className="flex flex-col items-center text-center space-y-2 relative z-10">
              <div className="w-10 h-10 rounded-full bg-luxury-900 border border-luxury-500/50 flex items-center justify-center text-gold-300 shadow-md">
                <step.icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-white">{step.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Items & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-gentborder divide-y divide-gentborder">
          <h3 className="font-serif font-bold text-base text-white pb-4">Acquired Pieces</h3>
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-serif font-semibold text-white text-sm">{item.productName}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                </p>
              </div>
              <p className="font-serif font-bold text-white text-sm">
                ${Number(item.totalPrice).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Shipping & Payment Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-4">
            <h3 className="font-serif font-bold text-base text-white">Delivery Address</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p className="font-medium text-white">{order.shippingAddress?.streetAddress1}</p>
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p className="text-gray-400">{order.shippingAddress?.country}</p>
              <p className="font-mono text-gray-400 pt-1">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-3 text-xs">
            <h3 className="font-serif font-bold text-base text-white pb-1">Payment Breakdown</h3>
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="text-white font-mono">${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax</span>
              <span className="text-white font-mono">${Number(order.taxAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-emerald-400 font-mono">
                {Number(order.shippingAmount) === 0 ? 'Complimentary' : `$${Number(order.shippingAmount).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gentborder">
              <span>Total Paid</span>
              <span className="font-serif text-gold-300">${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
