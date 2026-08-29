export type LogisticsCarrierCode = 'DHL_EXPRESS' | 'FEDEX_PRIORITY' | 'UPS_WORLDWIDE_SAVER' | 'ROYAL_MAIL_SPECIAL' | 'BLUEDART_LUXURY';
export type ShipmentClass = 'WHITE_GLOVE_EXPEDITE' | 'NEXT_DAY_SARTORIAL_AIR' | 'STANDARD_SECURE_COURIER';

export interface CarrierRateQuote {
  carrierCode: LogisticsCarrierCode;
  carrierName: string;
  serviceLevel: ShipmentClass;
  estimatedTransitDays: number;
  rateUsd: number;
  insuranceCoveredUsd: number;
  carbonNeutralOffset: boolean;
  signatureRequired: boolean;
}

export interface CustomsDeclaration {
  hsTariffCode: string;
  goodsDescription: string;
  countryOfOrigin: string;
  commercialValueUsd: number;
  incoterms: 'DDP_DELIVERED_DUTY_PAID' | 'DAP_DELIVERED_AT_PLACE';
  exportLicenceNumber?: string;
}
