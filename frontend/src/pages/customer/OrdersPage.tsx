import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchUserOrders } from '../../store/slices/orderSlice';
import { Button } from '../../components/common/Button';
import { ShoppingBag, ChevronRight, Package, ArrowRight } from 'lucide-react';
import { OrderStatus } from '../../types/order.types';

export const OrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">Delivered</span>;
      case 'IN_TRANSIT':
      case 'DISPATCHED_CARRIER':
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">In Transit</span>;
      case 'PROCESSING_TAILORING':
      case 'QUALITY_INSPECTION':
      case 'PACKED':
        return <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">In Preparation</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-red-950 text-red-300 border border-red-800">Cancelled</span>;
      case 'RETURN_REQUESTED':
      case 'RETURNED':
      case 'EXCHANGED':
        return <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-purple-950 text-purple-300 border border-purple-800">Return / Exchange</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-gray-800 text-gray-300 border border-gray-700">Pending</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-bold text-white">Order History & Deliveries</h2>
        <p className="text-xs text-gray-400 mt-1">
          Review your past sartorial acquisitions, track current dispatches, and download digital invoices.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-gray-400">Loading your acquisitions...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center border border-gentborder space-y-4">
          <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="font-serif text-xl text-white">No Sartorial Orders Placed Yet</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Your personal garment archive is awaiting its first luxury tailoring acquisition.
          </p>
          <Link to="/shop">
            <Button variant="gold" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Luxury Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="glass-panel rounded-2xl p-6 border border-gentborder hover:border-luxury-500/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gentborder/60 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white">
                      #{order.orderNumber}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="text-base font-serif font-bold text-gold-300">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <Link to={`/customer/orders/${order.id}`}>
                    <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                      Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items preview */}
              <div className="flex items-center gap-3 overflow-x-auto py-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-[#12151b] px-3 py-1.5 rounded-lg border border-gentborder shrink-0 text-xs">
                    <Package className="w-3.5 h-3.5 text-luxury-400" />
                    <span className="text-white font-medium truncate max-w-[150px]">{item.productName}</span>
                    <span className="text-gray-400 font-mono text-[11px]">(Qty: {item.quantity})</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
