import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supplyChainService } from '../../services/supplyChain.service';
import {
  WarehouseLocation,
  DetailedStockItem,
  StockTransferOrder,
  LuxurySupplier,
  PurchaseOrder,
} from '../../types/supplyChain.types';

interface SupplyChainState {
  warehouses: WarehouseLocation[];
  inventory: DetailedStockItem[];
  transfers: StockTransferOrder[];
  suppliers: LuxurySupplier[];
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SupplyChainState = {
  warehouses: [],
  inventory: [],
  transfers: [],
  suppliers: [],
  purchaseOrders: [],
  isLoading: false,
  error: null,
};

export const fetchWarehouses = createAsyncThunk('supplyChain/fetchWarehouses', async () => {
  const res = await supplyChainService.getWarehouses();
  return res.data;
});

export const fetchInventory = createAsyncThunk(
  'supplyChain/fetchInventory',
  async (params: { warehouseId?: string; sku?: string } | void) => {
    const res = await supplyChainService.getInventory(params || {});
    return res.data;
  }
);

export const fetchSuppliers = createAsyncThunk('supplyChain/fetchSuppliers', async () => {
  const res = await supplyChainService.getSuppliers();
  return res.data;
});

export const fetchPurchaseOrders = createAsyncThunk('supplyChain/fetchPurchaseOrders', async () => {
  const res = await supplyChainService.getPurchaseOrders();
  return res.data;
});

export const supplyChainSlice = createSlice({
  name: 'supplyChain',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.warehouses = action.payload;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.inventory = action.payload;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.suppliers = action.payload;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.purchaseOrders = action.payload;
      });
  },
});

export default supplyChainSlice.reducer;
