export type WarehouseTier = 'CENTRAL_HUB' | 'REGIONAL_ATELIER' | 'FLAGSHIP_BOUTIQUE' | 'TRANSIT_VAULT';
export type BinType = 'PALLET_RACK' | 'HANGING_GARMENT_RAIL' | 'FABRIC_BOLT_SHELF' | 'SECURE_VAULT_ACCESSORIES' | 'STAGING_AREA';
export type StockMovementType = 'PURCHASE_RECEIPT' | 'SALES_FULFILLMENT' | 'ATELIER_CONSUMPTION' | 'INTER_WAREHOUSE_TRANSFER' | 'RETURN_RESTOCK' | 'CYCLE_COUNT_ADJUSTMENT' | 'DAMAGE_WRITE_OFF';
export type InventoryABCClass = 'CLASS_A_ULTRA_LUXURY' | 'CLASS_B_CORE_SARTORIAL' | 'CLASS_C_ESSENTIAL_TRIMS';

export interface WarehouseLocation {
  id: string;
  code: string;
  name: string;
  tier: WarehouseTier;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  totalCapacityUnits: number;
  utilizedCapacityUnits: number;
  climateControlled: boolean;
  isActive: boolean;
  zones: WarehouseZone[];
}

export interface WarehouseZone {
  id: string;
  warehouseId: string;
  code: string;
  name: string;
  temperatureCelsius?: number;
  humidityPercent?: number;
  aisles: WarehouseAisle[];
}

export interface WarehouseAisle {
  id: string;
  zoneId: string;
  aisleNumber: number;
  racks: WarehouseRack[];
}

export interface WarehouseRack {
  id: string;
  aisleId: string;
  rackNumber: number;
  levels: WarehouseLevel[];
}

export interface WarehouseLevel {
  id: string;
  rackId: string;
  levelNumber: number;
  bins: WarehouseBin[];
}

export interface WarehouseBin {
  id: string;
  levelId: string;
  binBarcode: string;
  binType: BinType;
  maxWeightKg: number;
  currentWeightKg: number;
  maxUnits: number;
  currentUnits: number;
  isOccupied: boolean;
  skuOccupied?: string;
  lotNumber?: string;
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
  economicOrderQty: number;
  abcClass: InventoryABCClass;
  unitCost: number;
  totalValuation: number;
  lotNumber: string;
  expiryOrMothproofDate?: string;
  lastAuditedAt: string;
}

export interface StockTransferOrder {
  id: string;
  stoNumber: string;
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  status: 'DRAFT' | 'APPROVED' | 'IN_PICKING' | 'DISPATCHED' | 'RECEIVED' | 'CANCELLED';
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
  dispatchedAt?: string;
  estimatedArrival?: string;
  receivedAt?: string;
  notes?: string;
  createdAt: string;
}
