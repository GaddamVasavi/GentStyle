export type SupplierRating = 'PLATINUM_TIER_1_HERITAGE' | 'GOLD_EXCELLENCE' | 'SILVER_QUALIFIED' | 'PROBATIONARY';
export type PaymentTerms = 'NET_30' | 'NET_60' | 'NET_90' | 'LETTER_OF_CREDIT_IRREVOCABLE' | 'CASH_IN_ADVANCE';
export type PurchaseOrderStatus = 'DRAFT' | 'SUBMITTED_TO_MILL' | 'ACKNOWLEDGED' | 'PRODUCTION_IN_PROGRESS' | 'PARTIALLY_RECEIVED' | 'FULFILLED' | 'CANCELLED';

export interface LuxurySupplier {
  id: string;
  vendorCode: string;
  name: string;
  originCountry: string;
  millRegion: string;
  contactPerson: string;
  contactEmail: string;
  ratingTier: SupplierRating;
  onTimeDeliveryRatePercent: number;
  qualityPassRatePercent: number;
  defectPpm: number;
  currencyAccepted: string;
  paymentTerms: PaymentTerms;
  certifications: string[];
  totalSpendYTD: number;
}

export interface PurchaseOrderItem {
  skuOrFabricCode: string;
  description: string;
  metersOrUnits: number;
  unitPrice: number;
  lineTotal: number;
  receivedMetersOrUnits: number;
  defectMetersOrUnits: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  warehouseDestinationId: string;
  status: PurchaseOrderStatus;
  paymentTerms: PaymentTerms;
  currency: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  customsTaxEstimate: number;
  grandTotal: number;
  orderedDate: string;
  expectedDeliveryDate: string;
  receivedDate?: string;
  qualityInspectionReportId?: string;
  notes?: string;
}

export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  warehouseId: string;
  inspectorName: string;
  inspectionPassed: boolean;
  totalMetersInspected: number;
  pointsDeducted4PointSystem: number;
  qualityGrade: 'GRADE_A_FLAWLESS' | 'GRADE_B_MINOR_SLUB' | 'GRADE_C_REJECTED';
  notes?: string;
  receivedAt: string;
}
