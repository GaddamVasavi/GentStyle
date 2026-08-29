export type SuitSilhouette = 'CLASSIC_BRITISH' | 'NEAPOLITAN_SOFT' | 'CONTEMPORARY_SLIM' | 'PARISIAN_STRUCTURED' | 'TUXEDO_BLACK_TIE';
export type LapelType = 'NOTCH_NARROW' | 'NOTCH_STANDARD' | 'PEAK_WIDE' | 'PEAK_TOM_FORD' | 'SHAWL_SATIN' | 'SHAWL_VELVET';
export type ButtonConfiguration = 'SINGLE_1_BUTTON' | 'SINGLE_2_BUTTON' | 'SINGLE_3_ROLL_2' | 'DOUBLE_BREASTED_4X2' | 'DOUBLE_BREASTED_6X2' | 'DOUBLE_BREASTED_6X1';
export type PocketStyle = 'FLAP_STANDARD' | 'FLAP_SLANTED_TICKET' | 'JETTED_LUXURY' | 'PATCH_CASUAL' | 'CRESCENT_BESPOKE';
export type VentStyle = 'SIDE_DOUBLE_VENTS' | 'CENTER_SINGLE_VENT' | 'VENTLESS_FORMAL';
export type LiningConstruction = 'FULL_BEMBERG_SILK' | 'HALF_LINED_SUMMER' | 'UNLINED_DECONSTRUCTED' | 'CUSTOM_PRINT_JACQUARD';
export type TrouserPleats = 'FLAT_FRONT' | 'SINGLE_FORWARD_PLEAT' | 'DOUBLE_REVERSE_PLEAT' | 'HOLLYWOOD_WAISTBAND';
export type TrouserCuff = 'NO_CUFF_PLAIN' | '1.5_INCH_CUFF' | '1.75_INCH_CUFF' | '2.0_INCH_SARTORIAL_CUFF';
export type WaistbandClosure = 'BELT_LOOPS' | 'SIDE_ADJUSTERS_BRASS' | 'EXTENDED_TAB_GURKHA' | 'DRAWCORD_LUXURY_CASUAL';
export type ButtonMaterial = 'GENUINE_HORN_BUFFALO' | 'MOTHER_OF_PEARL_AUSTRALIAN' | 'COROZO_NUT_ECO' | 'ENAMELED_GOLD_CREST' | 'MATTE_SMOKED_BONE';

export interface LuxuryFabricSwatch {
  id: string;
  code: string;
  mill: string;
  collection: string;
  name: string;
  composition: string;
  woolGrade: string;
  weightGsm: number;
  season: string;
  weavePattern: string;
  color: string;
  hexCode: string;
  priceTier: string;
  pricePerMeter: number;
  inStockMeters: number;
  originCountry: string;
  imageUrl: string;
  textureMapUrl: string;
}

export interface BespokeGarmentConfig {
  id?: string;
  userId?: string;
  garmentType: 'TWO_PIECE_SUIT' | 'THREE_PIECE_SUIT' | 'TUXEDO' | 'SPORT_JACKET' | 'BESPOKE_TROUSER' | 'OVERCOAT';
  silhouette: SuitSilhouette;
  fabricId: string;
  lapel: LapelType;
  buttons: ButtonConfiguration;
  pockets: PocketStyle;
  vents: VentStyle;
  lining: LiningConstruction;
  liningPatternId: string;
  buttonMaterial: ButtonMaterial;
  canvasConstruction: 'FULL_FLOATING_CANVAS' | 'HALF_CANVAS' | 'SOFT_FUSED_TRAVEL';
  shoulderPad: 'ROPPED_ENGLISH' | 'NATURAL_SPALLA_CAMICIA' | 'LIGHT_PADDED';
  trouserConfig?: {
    pleats: TrouserPleats;
    cuff: TrouserCuff;
    waistband: WaistbandClosure;
    suspenderButtons: boolean;
  };
  monogram?: {
    text: string;
    font: 'SCRIPT_TRADITIONAL' | 'BLOCK_MODERN' | 'ROMAN_SERIF' | 'GOTHIC_CREST';
    threadColor: 'BURGUNDY' | 'GOLDEN_ROD' | 'NAVY' | 'CHAMPAGNE' | 'ICE_BLUE' | 'PLATINUM';
    placement: 'INSIDE_RIGHT_BREAST' | 'UNDER_COLLAR_MELTON' | 'SHIRT_LEFT_CUFF' | 'TROUSER_WAISTBAND_INTERIOR';
  };
  specialInstructions?: string;
}

export interface BespokeQuote {
  baseLaborPrice: number;
  fabricPrice: number;
  constructionSurcharge: number;
  embellishmentsPrice: number;
  totalPrice: number;
  currency: string;
  fabricMetersRequired: number;
}

export interface TailorAppointment {
  id: string;
  userId: string;
  tailorId: string;
  tailorName: string;
  serviceType: 'VIRTUAL_3D_MEASUREMENT' | 'IN_PERSON_SUITE_FITTING' | 'PRIVATE_HOME_OR_OFFICE_VISIT' | 'FABRIC_CONSULTATION';
  appointmentDate: string;
  timeSlot: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  meetingRoomUrl?: string;
  clientAddress?: string;
  notes?: string;
}
