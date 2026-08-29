export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  tier: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  totalCapacityUnits: number;
  utilizedCapacityUnits: number;
  climateControlled: boolean;
  isActive: boolean;
}

export interface DetailedStockItem {
  id: string;
  warehouseId: string;
  binId: string;
  sku: string;
  productName: string;
  category: string;
  variantDetails: {
    size: string;
    color: string;
    material?: string;
  };
  quantityAvailable: number;
  quantityReserved: number;
  quantityInInspection: number;
  reorderPoint: number;
  safetyStockLevel: number;
  abcClass: string;
  unitCost: number;
  totalValuation: number;
  lotNumber: string;
  lastAuditedAt: string;
}

export interface StockTransferOrder {
  id: string;
  stoNumber: string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  status: string;
  items: Array<{
    sku: string;
    productName: string;
    quantity: number;
    lotNumber: string;
    unitCost: number;
  }>;
  totalUnits: number;
  totalCost: number;
  carrierName?: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface LuxurySupplier {
  id: string;
  vendorCode: string;
  name: string;
  originCountry: string;
  millRegion: string;
  contactPerson: string;
  contactEmail: string;
  ratingTier: string;
  onTimeDeliveryRatePercent: number;
  qualityPassRatePercent: number;
  defectPpm: number;
  currencyAccepted: string;
  paymentTerms: string;
  certifications: string[];
  totalSpendYTD: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseDestinationId: string;
  status: string;
  paymentTerms: string;
  currency: string;
  items: Array<{
    skuOrFabricCode: string;
    description: string;
    metersOrUnits: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  customsTaxEstimate: number;
  grandTotal: number;
  orderedDate: string;
  expectedDeliveryDate: string;
}
