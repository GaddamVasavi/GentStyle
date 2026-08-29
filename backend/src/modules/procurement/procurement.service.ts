import { LuxurySupplier, PurchaseOrder, GoodsReceiptNote } from './procurement.types';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../config/logger';

export class ProcurementService {
  private suppliers: LuxurySupplier[] = [
    {
      id: 'sup-loro-piana',
      vendorCode: 'VND-LP-01',
      name: 'Loro Piana S.p.A. (Textile Division)',
      originCountry: 'Italy',
      millRegion: 'Quarona, Biella (Piedmont)',
      contactPerson: 'Dott. Giancarlo Rossi',
      contactEmail: 'orders@loropiana-textiles.it',
      ratingTier: 'PLATINUM_TIER_1_HERITAGE',
      onTimeDeliveryRatePercent: 99.4,
      qualityPassRatePercent: 99.8,
      defectPpm: 120,
      currencyAccepted: 'EUR',
      paymentTerms: 'NET_60',
      certifications: ['OEKO-TEX Standard 100', 'Zque Merino Certified', 'GOTS Organic Silk'],
      totalSpendYTD: 1450000.0,
    },
    {
      id: 'sup-scabal-england',
      vendorCode: 'VND-SCB-02',
      name: 'Scabal Fabrics & Weaving Mills',
      originCountry: 'England / Belgium',
      millRegion: 'Huddersfield, Yorkshire & Brussels',
      contactPerson: 'Sir Alistair Sterling',
      contactEmail: 'bespoke-mill@scabal.com',
      ratingTier: 'PLATINUM_TIER_1_HERITAGE',
      onTimeDeliveryRatePercent: 98.7,
      qualityPassRatePercent: 99.5,
      defectPpm: 210,
      currencyAccepted: 'GBP',
      paymentTerms: 'NET_30',
      certifications: ['Savile Row Bespoke Alliance', 'British Wool Heritage Mark'],
      totalSpendYTD: 1120000.0,
    },
    {
      id: 'sup-zegna-group',
      vendorCode: 'VND-EZ-03',
      name: 'Lanificio Ermenegildo Zegna',
      originCountry: 'Italy',
      millRegion: 'Trivero, Biella',
      contactPerson: 'Marco Bellini',
      contactEmail: 'lanificio@zegnagroup.com',
      ratingTier: 'GOLD_EXCELLENCE',
      onTimeDeliveryRatePercent: 97.9,
      qualityPassRatePercent: 99.1,
      defectPpm: 340,
      currencyAccepted: 'EUR',
      paymentTerms: 'NET_60',
      certifications: ['Oasi Zegna Sustainability Standard', 'Responsible Wool Standard'],
      totalSpendYTD: 890000.0,
    }
  ];

  private purchaseOrders: PurchaseOrder[] = [
    {
      id: 'po-2026-101',
      poNumber: 'PO-2026-0881',
      supplierId: 'sup-loro-piana',
      supplierName: 'Loro Piana S.p.A. (Textile Division)',
      warehouseDestinationId: 'wh-milan-hub',
      status: 'PRODUCTION_IN_PROGRESS',
      paymentTerms: 'NET_60',
      currency: 'USD',
      items: [
        {
          skuOrFabricCode: 'LP-ZEL-001',
          description: 'Zelander Dream Royal Midnight Navy Birdseye Super 130s',
          metersOrUnits: 500,
          unitPrice: 185.0,
          lineTotal: 92500.0,
          receivedMetersOrUnits: 0,
          defectMetersOrUnits: 0,
        },
        {
          skuOrFabricCode: 'LP-TAS-002',
          description: 'Tasmanian Super 150s Imperial Charcoal Sharkskin',
          metersOrUnits: 300,
          unitPrice: 240.0,
          lineTotal: 72000.0,
          receivedMetersOrUnits: 0,
          defectMetersOrUnits: 0,
        }
      ],
      subtotal: 164500.0,
      customsTaxEstimate: 8225.0,
      grandTotal: 172725.0,
      orderedDate: '2026-08-10T09:00:00Z',
      expectedDeliveryDate: '2026-09-02T18:00:00Z',
      notes: 'Autumn bespoke suiting bolt allocation.',
    }
  ];

  private grnRecords: GoodsReceiptNote[] = [
    {
      id: 'grn-5501',
      grnNumber: 'GRN-2026-0044',
      poId: 'po-2026-101',
      poNumber: 'PO-2026-0881',
      warehouseId: 'wh-milan-hub',
      inspectorName: 'Giuseppe Falcone (Lead Textile Metallurgist)',
      inspectionPassed: true,
      totalMetersInspected: 800,
      pointsDeducted4PointSystem: 3,
      qualityGrade: 'GRADE_A_FLAWLESS',
      notes: 'No slub defects or shade variations across both fabric bolts.',
      receivedAt: '2026-08-28T11:00:00Z',
    }
  ];

  public getSuppliers(): LuxurySupplier[] {
    return this.suppliers;
  }

  public getPurchaseOrders(): PurchaseOrder[] {
    return this.purchaseOrders;
  }

  public createPurchaseOrder(data: {
    supplierId: string;
    warehouseDestinationId: string;
    items: Array<{ skuOrFabricCode: string; description: string; metersOrUnits: number; unitPrice: number }>;
    expectedDeliveryDate: string;
    notes?: string;
  }): PurchaseOrder {
    const supplier = this.suppliers.find((s) => s.id === data.supplierId);
    if (!supplier) throw new NotFoundError('Supplier not found');

    let subtotal = 0;
    const items = data.items.map((i) => {
      const lineTotal = i.metersOrUnits * i.unitPrice;
      subtotal += lineTotal;
      return {
        ...i,
        lineTotal,
        receivedMetersOrUnits: 0,
        defectMetersOrUnits: 0,
      };
    });

    const customsTaxEstimate = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = subtotal + customsTaxEstimate;

    const po: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      warehouseDestinationId: data.warehouseDestinationId,
      status: 'SUBMITTED_TO_MILL',
      paymentTerms: supplier.paymentTerms,
      currency: supplier.currencyAccepted === 'EUR' ? 'USD' : supplier.currencyAccepted,
      items,
      subtotal,
      customsTaxEstimate,
      grandTotal,
      orderedDate: new Date().toISOString(),
      expectedDeliveryDate: data.expectedDeliveryDate,
      notes: data.notes,
    };

    this.purchaseOrders.unshift(po);
    logger.info(`Generated Purchase Order ${po.poNumber} with ${supplier.name} for $${grandTotal}`);
    return po;
  }

  public getGoodsReceiptNotes(): GoodsReceiptNote[] {
    return this.grnRecords;
  }
}

export const procurementService = new ProcurementService();
