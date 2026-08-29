import { CarrierRateQuote, LogisticsCarrierCode, CustomsDeclaration } from './logistics.types';

export class LogisticsService {
  public calculateRates(originCountry: string, destinationCountry: string, packageWeightKg: number): CarrierRateQuote[] {
    const isInternational = originCountry !== destinationCountry;
    const baseWeight = Math.max(1, packageWeightKg);

    return [
      {
        carrierCode: 'DHL_EXPRESS',
        carrierName: 'DHL Express On Demand White-Glove',
        serviceLevel: 'WHITE_GLOVE_EXPEDITE',
        estimatedTransitDays: isInternational ? 2 : 1,
        rateUsd: isInternational ? 45.0 + baseWeight * 12.0 : 25.0 + baseWeight * 6.0,
        insuranceCoveredUsd: 15000.0,
        carbonNeutralOffset: true,
        signatureRequired: true,
      },
      {
        carrierCode: 'FEDEX_PRIORITY',
        carrierName: 'FedEx International Priority Sartorial',
        serviceLevel: 'NEXT_DAY_SARTORIAL_AIR',
        estimatedTransitDays: isInternational ? 3 : 1,
        rateUsd: isInternational ? 40.0 + baseWeight * 10.0 : 20.0 + baseWeight * 5.0,
        insuranceCoveredUsd: 10000.0,
        carbonNeutralOffset: true,
        signatureRequired: true,
      },
      {
        carrierCode: 'UPS_WORLDWIDE_SAVER',
        carrierName: 'UPS Worldwide Saver Direct-to-Wardrobe',
        serviceLevel: 'STANDARD_SECURE_COURIER',
        estimatedTransitDays: isInternational ? 4 : 2,
        rateUsd: isInternational ? 35.0 + baseWeight * 9.0 : 18.0 + baseWeight * 4.0,
        insuranceCoveredUsd: 8000.0,
        carbonNeutralOffset: false,
        signatureRequired: true,
      }
    ];
  }

  public generateCustomsDeclaration(orderNumber: string, value: number, origin = 'Italy'): CustomsDeclaration {
    return {
      hsTariffCode: '6203.11.0000', // Men's suits of wool or fine animal hair
      goodsDescription: `Bespoke Tailored Garment Order #${orderNumber}`,
      countryOfOrigin: origin,
      commercialValueUsd: value,
      incoterms: 'DDP_DELIVERED_DUTY_PAID',
      exportLicenceNumber: 'EU-EXP-2026-SART-9921',
    };
  }
}

export const logisticsService = new LogisticsService();
