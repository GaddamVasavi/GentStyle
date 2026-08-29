import { BespokeGarmentConfig } from './bespoke.types';
import { fabricCatalogService } from './bespoke.fabrics.catalog';
import { ValidationError } from '../../utils/errors';

export class BespokeConfiguratorEngine {
  /**
   * Calculates dynamic pricing for luxury custom bespoke garments
   */
  public calculatePrice(config: BespokeGarmentConfig): {
    baseLaborPrice: number;
    fabricPrice: number;
    constructionSurcharge: number;
    embellishmentsPrice: number;
    totalPrice: number;
    currency: string;
    fabricMetersRequired: number;
  } {
    const fabric = fabricCatalogService.getFabricById(config.fabricId);
    if (!fabric) {
      throw new ValidationError(`Selected luxury fabric '${config.fabricId}' was not found in mill catalog`);
    }

    // 1. Base artisanal bench-tailoring labor fee
    let baseLaborPrice = 1450.0; // Two-piece full bespoke bench fee
    let fabricMetersRequired = 3.4; // 3.4 meters standard for 2pc suit

    if (config.garmentType === 'THREE_PIECE_SUIT') {
      baseLaborPrice = 1850.0;
      fabricMetersRequired = 4.2;
    } else if (config.garmentType === 'TUXEDO') {
      baseLaborPrice = 1950.0;
      fabricMetersRequired = 3.6;
    } else if (config.garmentType === 'SPORT_JACKET') {
      baseLaborPrice = 1050.0;
      fabricMetersRequired = 2.2;
    } else if (config.garmentType === 'BESPOKE_TROUSER') {
      baseLaborPrice = 450.0;
      fabricMetersRequired = 1.6;
    } else if (config.garmentType === 'OVERCOAT') {
      baseLaborPrice = 1650.0;
      fabricMetersRequired = 3.8;
    }

    // 2. Fabric Cost
    const fabricPrice = fabric.pricePerMeter * fabricMetersRequired;

    // 3. Canvas Construction Surcharge
    let constructionSurcharge = 0.0;
    if (config.canvasConstruction === 'FULL_FLOATING_CANVAS') {
      constructionSurcharge += 350.0; // Full floating horsehair canvas crafted by hand
    } else if (config.canvasConstruction === 'HALF_CANVAS') {
      constructionSurcharge += 150.0;
    }

    // 4. Buttons and Finishes
    let embellishmentsPrice = 0.0;
    if (config.buttonMaterial === 'MOTHER_OF_PEARL_AUSTRALIAN') {
      embellishmentsPrice += 85.0;
    } else if (config.buttonMaterial === 'ENAMELED_GOLD_CREST') {
      embellishmentsPrice += 140.0;
    } else if (config.buttonMaterial === 'GENUINE_HORN_BUFFALO') {
      embellishmentsPrice += 45.0;
    }

    // Monogram fee
    if (config.monogram && config.monogram.text.trim().length > 0) {
      embellishmentsPrice += 40.0; // Hand-embroidered bullion wire monogram
    }

    // Satin lapel facings for tuxedos
    if (config.lapel === 'SHAWL_SATIN' || config.lapel === 'SHAWL_VELVET') {
      embellishmentsPrice += 120.0;
    }

    const totalPrice = baseLaborPrice + fabricPrice + constructionSurcharge + embellishmentsPrice;

    return {
      baseLaborPrice,
      fabricPrice,
      constructionSurcharge,
      embellishmentsPrice,
      totalPrice: Math.round(totalPrice * 100) / 100,
      currency: 'USD',
      fabricMetersRequired,
    };
  }
}

export const bespokeConfiguratorEngine = new BespokeConfiguratorEngine();
