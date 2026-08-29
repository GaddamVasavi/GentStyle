import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchPurchaseOrders, fetchSuppliers } from '../../store/slices/supplyChainSlice';
import { Button } from '../../components/common/Button';
import { FileText, Plus } from 'lucide-react';

export const PurchaseOrdersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { purchaseOrders } = useSelector((state: RootState) => state.supplyChain);

  useEffect(() => {
    dispatch(fetchPurchaseOrders());
    dispatch(fetchSuppliers());
  }, [dispatch]);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gentborder pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Mill Procurement ERP
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            Purchase Orders & Mill Allocations
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track fabric bolt yardage procurement, supplier contracts, and factory delivery milestones.
          </p>
        </div>

        <Button variant="gold" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Draft New Purchase Order
        </Button>
      </div>

      <div className="space-y-4">
        {purchaseOrders.map((po) => (
          <div key={po.id} className="glass-panel rounded-2xl p-6 border border-gentborder space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gentborder pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-white">{po.poNumber}</span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                    {po.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Supplier: <strong className="text-white">{po.supplierName}</strong></p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">Total Commitment</p>
                <p className="text-xl font-serif font-bold text-gold-300">${po.grandTotal.toLocaleString()}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 font-mono text-[10px] uppercase border-b border-gentborder/50 pb-2">
                    <th className="pb-2">Material / Spec</th>
                    <th className="pb-2">Allocated Meters</th>
                    <th className="pb-2">Unit Price</th>
                    <th className="pb-2 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gentborder/30">
                  {po.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 text-white font-medium">{it.description}</td>
                      <td className="py-2.5 font-mono text-gray-300">{it.metersOrUnits} meters</td>
                      <td className="py-2.5 font-mono text-gray-300">${it.unitPrice.toFixed(2)}/m</td>
                      <td className="py-2.5 font-serif font-bold text-white text-right">${it.lineTotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
