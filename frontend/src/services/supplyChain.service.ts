import { apiClient } from './api';
import {
  WarehouseLocation,
  DetailedStockItem,
  StockTransferOrder,
  LuxurySupplier,
  PurchaseOrder,
} from '../types/supplyChain.types';

export const supplyChainService = {
  // Warehouses
  async getWarehouses() {
    const res = await apiClient.get<{ data: WarehouseLocation[] }>('/warehouse/locations');
    return res.data;
  },

  async getInventory(params?: { warehouseId?: string; sku?: string }) {
    const res = await apiClient.get<{ data: DetailedStockItem[] }>('/warehouse/inventory', { params });
    return res.data;
  },

  async getTransfers() {
    const res = await apiClient.get<{ data: StockTransferOrder[] }>('/warehouse/transfers');
    return res.data;
  },

  async createTransfer(data: {
    sourceWarehouseId: string;
    destinationWarehouseId: string;
    items: Array<{ sku: string; quantity: number }>;
    notes?: string;
  }) {
    const res = await apiClient.post<{ data: StockTransferOrder }>('/warehouse/transfers', data);
    return res.data;
  },

  // Procurement
  async getSuppliers() {
    const res = await apiClient.get<{ data: LuxurySupplier[] }>('/procurement/suppliers');
    return res.data;
  },

  async getPurchaseOrders() {
    const res = await apiClient.get<{ data: PurchaseOrder[] }>('/procurement/purchase-orders');
    return res.data;
  },

  async createPurchaseOrder(data: {
    supplierId: string;
    warehouseDestinationId: string;
    items: Array<{ skuOrFabricCode: string; description: string; metersOrUnits: number; unitPrice: number }>;
    expectedDeliveryDate: string;
    notes?: string;
  }) {
    const res = await apiClient.post<{ data: PurchaseOrder }>('/procurement/purchase-orders', data);
    return res.data;
  },

  // Logistics
  async getCarrierQuotes(originCountry: string, destinationCountry: string, weightKg: number) {
    const res = await apiClient.post('/logistics/calculate-rates', {
      originCountry,
      destinationCountry,
      weightKg,
    });
    return res.data;
  }
};
