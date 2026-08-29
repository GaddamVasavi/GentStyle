import {
  WarehouseLocation,
  DetailedStockItem,
  StockTransferOrder,
  StockMovementType,
  InventoryABCClass,
} from './warehouse.types';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../config/logger';

export class WarehouseService {
  private warehouses: WarehouseLocation[] = [
    {
      id: 'wh-nyc-flagship',
      code: 'WH-USA-001',
      name: 'Manhattan 5th Avenue Atelier & Vault',
      tier: 'FLAGSHIP_BOUTIQUE',
      country: 'United States',
      city: 'New York',
      address: '742 5th Avenue, New York, NY 10019',
      postalCode: '10019',
      totalCapacityUnits: 15000,
      utilizedCapacityUnits: 9420,
      climateControlled: true,
      isActive: true,
      zones: [
        {
          id: 'zone-suiting',
          warehouseId: 'wh-nyc-flagship',
          code: 'ZN-SUIT-01',
          name: 'Bespoke Suiting & Tuxedo Hanging Rails',
          temperatureCelsius: 19.5,
          humidityPercent: 45,
          aisles: [
            {
              id: 'aisle-1',
              zoneId: 'zone-suiting',
              aisleNumber: 1,
              racks: [
                {
                  id: 'rack-101',
                  aisleId: 'aisle-1',
                  rackNumber: 1,
                  levels: [
                    {
                      id: 'lvl-1',
                      rackId: 'rack-101',
                      levelNumber: 1,
                      bins: [
                        {
                          id: 'bin-001',
                          levelId: 'lvl-1',
                          binBarcode: 'BIN-NYC-S1-01',
                          binType: 'HANGING_GARMENT_RAIL',
                          maxWeightKg: 150,
                          currentWeightKg: 85,
                          maxUnits: 60,
                          currentUnits: 34,
                          isOccupied: true,
                          skuOccupied: 'GS-SUIT-LP-NAVY-40R',
                          lotNumber: 'LOT-2026-B1',
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'wh-milan-hub',
      code: 'WH-ITA-002',
      name: 'Milan Central Sartorial Logistics Hub',
      tier: 'CENTRAL_HUB',
      country: 'Italy',
      city: 'Milan',
      address: 'Via Montenapoleone 18, 20121 Milano MI',
      postalCode: '20121',
      totalCapacityUnits: 80000,
      utilizedCapacityUnits: 58200,
      climateControlled: true,
      isActive: true,
      zones: []
    },
    {
      id: 'wh-london-savile',
      code: 'WH-GBR-003',
      name: 'London Savile Row Reserve Atelier',
      tier: 'REGIONAL_ATELIER',
      country: 'United Kingdom',
      city: 'London',
      address: '14 Savile Row, Mayfair, London W1S 3JN',
      postalCode: 'W1S 3JN',
      totalCapacityUnits: 25000,
      utilizedCapacityUnits: 17300,
      climateControlled: true,
      isActive: true,
      zones: []
    }
  ];

  private stockItems: DetailedStockItem[] = [
    {
      id: 'stk-001',
      warehouseId: 'wh-nyc-flagship',
      binId: 'bin-001',
      sku: 'GS-SUIT-LP-NAVY-40R',
      productName: 'Royal Midnight Navy Birdseye Super 130s Suit',
      category: 'Bespoke Suits',
      variantDetails: { size: '40R', color: 'Midnight Navy', material: 'Loro Piana Super 130s Wool' },
      quantityAvailable: 28,
      quantityReserved: 6,
      quantityInInspection: 2,
      reorderPoint: 10,
      safetyStockLevel: 5,
      economicOrderQty: 25,
      abcClass: 'CLASS_A_ULTRA_LUXURY',
      unitCost: 890.0,
      totalValuation: 24920.0,
      lotNumber: 'LOT-2026-B1',
      expiryOrMothproofDate: '2028-12-31',
      lastAuditedAt: '2026-08-15',
    },
    {
      id: 'stk-002',
      warehouseId: 'wh-milan-hub',
      binId: 'bin-002',
      sku: 'GS-TUX-SCB-BLK-42R',
      productName: 'Savile Obsidian Silk-Lapel Tuxedo Super 180s',
      category: 'Evening Tuxedos',
      variantDetails: { size: '42R', color: 'Obsidian Black', material: 'Scabal Super 180s Silk' },
      quantityAvailable: 45,
      quantityReserved: 12,
      quantityInInspection: 0,
      reorderPoint: 15,
      safetyStockLevel: 8,
      economicOrderQty: 30,
      abcClass: 'CLASS_A_ULTRA_LUXURY',
      unitCost: 1250.0,
      totalValuation: 56250.0,
      lotNumber: 'LOT-2026-TUX-09',
      expiryOrMothproofDate: '2029-06-30',
      lastAuditedAt: '2026-08-20',
    },
    {
      id: 'stk-003',
      warehouseId: 'wh-milan-hub',
      binId: 'bin-003',
      sku: 'GS-BTN-BUFF-HORN-20MM',
      productName: 'Hand-Carved Buffalo Horn Buttons 20mm',
      category: 'Atelier Trims',
      variantDetails: { size: '20mm', color: 'Dark Smoke', material: 'Water Buffalo Horn' },
      quantityAvailable: 3400,
      quantityReserved: 200,
      quantityInInspection: 0,
      reorderPoint: 500,
      safetyStockLevel: 300,
      economicOrderQty: 1000,
      abcClass: 'CLASS_C_ESSENTIAL_TRIMS',
      unitCost: 2.5,
      totalValuation: 8500.0,
      lotNumber: 'LOT-BTN-441',
      lastAuditedAt: '2026-08-01',
    }
  ];

  private transferOrders: StockTransferOrder[] = [
    {
      id: 'sto-8821',
      stoNumber: 'STO-2026-001',
      sourceWarehouseId: 'wh-milan-hub',
      destinationWarehouseId: 'wh-nyc-flagship',
      status: 'DISPATCHED',
      items: [
        {
          sku: 'GS-TUX-SCB-BLK-42R',
          productName: 'Savile Obsidian Silk-Lapel Tuxedo Super 180s',
          quantity: 10,
          lotNumber: 'LOT-2026-TUX-09',
          unitCost: 1250.0,
        }
      ],
      totalUnits: 10,
      totalCost: 12500.0,
      carrierName: 'DHL Express Global Forwarding',
      trackingNumber: 'DHL-STO-992817263',
      dispatchedAt: '2026-08-26T10:00:00Z',
      estimatedArrival: '2026-08-30T16:00:00Z',
      notes: 'Replenishing Manhattan gala tuxedo stock for autumn seasonal gala.',
      createdAt: '2026-08-25T14:30:00Z',
    }
  ];

  public getAllWarehouses(): WarehouseLocation[] {
    return this.warehouses;
  }

  public getWarehouseById(id: string): WarehouseLocation | undefined {
    return this.warehouses.find((w) => w.id === id || w.code === id);
  }

  public getInventory(warehouseId?: string, sku?: string, abcClass?: InventoryABCClass): DetailedStockItem[] {
    return this.stockItems.filter((item) => {
      if (warehouseId && item.warehouseId !== warehouseId) return false;
      if (sku && !item.sku.toLowerCase().includes(sku.toLowerCase()) && !item.productName.toLowerCase().includes(sku.toLowerCase())) return false;
      if (abcClass && item.abcClass !== abcClass) return false;
      return true;
    });
  }

  public createStockTransfer(data: {
    sourceWarehouseId: string;
    destinationWarehouseId: string;
    items: Array<{ sku: string; quantity: number; lotNumber?: string }>;
    notes?: string;
  }): StockTransferOrder {
    if (data.sourceWarehouseId === data.destinationWarehouseId) {
      throw new ValidationError('Source and destination warehouses cannot be the same');
    }

    let totalUnits = 0;
    let totalCost = 0;

    const populatedItems = data.items.map((it) => {
      const stock = this.stockItems.find((s) => s.sku === it.sku && s.warehouseId === data.sourceWarehouseId);
      if (!stock || stock.quantityAvailable < it.quantity) {
        throw new ValidationError(`Insufficient stock for SKU ${it.sku} at source warehouse`);
      }
      stock.quantityAvailable -= it.quantity;
      stock.quantityReserved += it.quantity;

      const itemCost = stock.unitCost * it.quantity;
      totalUnits += it.quantity;
      totalCost += itemCost;

      return {
        sku: it.sku,
        productName: stock.productName,
        quantity: it.quantity,
        lotNumber: it.lotNumber || stock.lotNumber,
        unitCost: stock.unitCost,
      };
    });

    const sto: StockTransferOrder = {
      id: `sto-${Date.now()}`,
      stoNumber: `STO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sourceWarehouseId: data.sourceWarehouseId,
      destinationWarehouseId: data.destinationWarehouseId,
      status: 'APPROVED',
      items: populatedItems,
      totalUnits,
      totalCost,
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    this.transferOrders.unshift(sto);
    logger.info(`Created Stock Transfer Order ${sto.stoNumber} for ${totalUnits} units`);
    return sto;
  }

  public getTransferOrders(): StockTransferOrder[] {
    return this.transferOrders;
  }
}

export const warehouseService = new WarehouseService();
