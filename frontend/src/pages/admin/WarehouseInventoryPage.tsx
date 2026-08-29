import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchWarehouses, fetchInventory } from '../../store/slices/supplyChainSlice';
import { Button } from '../../components/common/Button';
import { Warehouse, ArrowRightLeft, Search } from 'lucide-react';

export const WarehouseInventoryPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { warehouses, inventory } = useSelector((state: RootState) => state.supplyChain);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchWarehouses());
    dispatch(fetchInventory());
  }, [dispatch]);

  const filteredItems = inventory.filter((item) => {
    if (selectedWarehouseId && item.warehouseId !== selectedWarehouseId) return false;
    if (searchQuery && !item.sku.toLowerCase().includes(searchQuery.toLowerCase()) && !item.productName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gentborder pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
            <Warehouse className="w-4 h-4" />
            Global Supply Chain Network
          </span>
          <h1 className="text-3xl font-serif font-bold text-white mt-1">
            Warehouse & Inventory Matrix
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Multi-node climate-controlled vault inventory, bin positioning, and replenishment thresholds.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="gold" size="sm" leftIcon={<ArrowRightLeft className="w-4 h-4" />}>
            Initiate Stock Transfer
          </Button>
        </div>
      </div>

      {/* Warehouses Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            onClick={() => setSelectedWarehouseId(selectedWarehouseId === wh.id ? '' : wh.id)}
            className={`glass-panel rounded-2xl p-5 border cursor-pointer transition-all space-y-3 ${
              selectedWarehouseId === wh.id
                ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                : 'border-gentborder bg-[#12151b] hover:border-gray-500'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-bold text-gold-300">{wh.code}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                {wh.tier.replace(/_/g, ' ')}
              </span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-white text-sm">{wh.name}</h3>
              <p className="text-xs text-gray-400">{wh.city}, {wh.country}</p>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 border-t border-gentborder/60 pt-2">
              <span>Capacity: {wh.utilizedCapacityUnits} / {wh.totalCapacityUnits}</span>
              <span className="text-white font-mono">{Math.round((wh.utilizedCapacityUnits / wh.totalCapacityUnits) * 100)}% Utilized</span>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory Table & Filters */}
      <div className="glass-panel rounded-2xl p-6 border border-gentborder space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, fabric or garment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12151b] border border-gentborder rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-gold-400"
            />
          </div>

          <p className="text-xs text-gray-400 font-mono">
            Showing <strong className="text-white">{filteredItems.length}</strong> active inventory SKU records
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gentborder text-gray-400 font-mono uppercase tracking-wider text-[10px]">
                <th className="pb-3">SKU / Item</th>
                <th className="pb-3">Warehouse / Bin</th>
                <th className="pb-3">ABC Tier</th>
                <th className="pb-3">Available</th>
                <th className="pb-3">Reserved</th>
                <th className="pb-3">Unit Valuation</th>
                <th className="pb-3 text-right">Total Asset Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gentborder/50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <p className="font-serif font-bold text-white text-sm">{item.productName}</p>
                    <p className="font-mono text-[11px] text-luxury-400">{item.sku} • {item.variantDetails.size}</p>
                  </td>
                  <td className="py-4">
                    <span className="font-mono text-gray-300 bg-[#12151b] px-2 py-1 rounded border border-gentborder">
                      {item.binId}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      item.abcClass.includes('CLASS_A') ? 'bg-gold-950 text-gold-300 border border-gold-800' : 'bg-gray-800 text-gray-300'
                    }`}>
                      {item.abcClass.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-4 font-mono font-bold text-emerald-400 text-sm">
                    {item.quantityAvailable}
                  </td>
                  <td className="py-4 font-mono text-amber-400">
                    {item.quantityReserved}
                  </td>
                  <td className="py-4 font-mono text-gray-300">
                    ${item.unitCost.toFixed(2)}
                  </td>
                  <td className="py-4 font-serif font-bold text-white text-right text-sm">
                    ${item.totalValuation.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
