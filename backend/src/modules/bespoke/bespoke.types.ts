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

export interface BespokeGarmentConfig {
  id?: string;
  userId: string;
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
  vestConfig?: {
    included: boolean;
    style?: 'SINGLE_BREASTED_5_BUTTON' | 'DOUBLE_BREASTED_6X3' | 'HORSESHOE_EVENING';
    lapel?: 'NO_LAPEL' | 'SHAWL_LAPEL' | 'NOTCH_LAPEL';
  };
  monogram?: {
    text: string;
    font: 'SCRIPT_TRADITIONAL' | 'BLOCK_MODERN' | 'ROMAN_SERIF' | 'GOTHIC_CREST';
    threadColor: 'BURGUNDY' | 'GOLDEN_ROD' | 'NAVY' | 'CHAMPAGNE' | 'ICE_BLUE' | 'PLATINUM';
    placement: 'INSIDE_RIGHT_BREAST' | 'UNDER_COLLAR_MELTON' | 'SHIRT_LEFT_CUFF' | 'TROUSER_WAISTBAND_INTERIOR';
  };
  specialInstructions?: string;
  estimatedPrice: number;
  currency: string;
  createdAt?: Date;
}

export interface BodyMeasurementProfile {
  id?: string;
  userId: string;
  profileName: string;
  fitPreference: 'SKINNY_FASHION' | 'TAILORED_SLIM' | 'CLASSIC_COMFORT' | 'RELAXED_DRAPE';
  units: 'INCHES' | 'CENTIMETERS';
  height: number;
  weight: number;
  neckCircumference: number;
  chestCircumference: number;
  underChestCircumference: number;
  stomachWaistCircumference: number;
  pantWaistCircumference: number;
  hipSeatCircumference: number;
  shoulderWidthFull: number;
  halfShoulderWidth: number;
  sleeveLengthLeft: number;
  sleeveLengthRight: number;
  bicepCircumference: number;
  forearmCircumference: number;
  wristCircumference: number;
  jacketBackLength: number;
  frontJacketLength: number;
  armholeDepth: number;
  frontChestWidth: number;
  backWidth: number;
  trouserOutseamLeft: number;
  trouserOutseamRight: number;
  trouserInseamLeft: number;
  trouserInseamRight: number;
  thighCircumference: number;
  kneeCircumference: number;
  pantLegOpening: number;
  crotchTotalRise: number;
  frontRise: number;
  backRise: number;
  posture: 'NORMAL_BALANCED' | 'ERECT_MILITARY' | 'STOOPED_FORWARD' | 'LEANING_BACK';
  shoulderSlope: 'REGULAR_SLOPE' | 'SQUARE_HIGH_SHOULDERS' | 'SLOPING_LOW_SHOULDERS' | 'ASYMMETRIC_RIGHT_LOWER';
  chestShape: 'FLAT_ATHLETIC' | 'PROMINENT_BARREL' | 'STANDARD_MUSCULAR';
  stomachShape: 'FLAT' | 'SLIGHT_PROMINENCE' | 'PROMINENT_PORTLY';
  notes?: string;
  isVerifiedByMasterTailor: boolean;
  masterTailorNotes?: string;
  updatedAt?: Date;
}

export interface LuxuryFabricSwatch {
  id: string;
  code: string;
  mill: 'LORO_PIANA' | 'SCABAL' | 'ERMENEGILDO_ZEGNA' | 'HOLLAND_AND_SHERRY' | 'DORMEUIL' | 'ARISTON_NAPOLI' | 'CACCIOPPOLI_NAPOLI';
  collection: string;
  name: string;
  composition: string;
  woolGrade: string;
  weightGsm: number;
  season: 'ALL_SEASON' | 'SPRING_SUMMER' | 'AUTUMN_WINTER' | 'TROPICAL_HIGH_TWIST';
  weavePattern: 'TWILL' | 'HERRINGBONE' | 'GLEN_PLAID' | 'PINSTRIPE' | 'CHALKSTRIPE' | 'BIRDSEYE' | 'SHARKSKIN' | 'HOPSACK' | 'SOLARO' | 'DONEGAL_TWEED';
  color: string;
  hexCode: string;
  priceTier: 'PREMIUM' | 'LUXURY_SIGNATURE' | 'ROYAL_BESPOKE' | 'BESPOKE_ULTRA_RARE';
  pricePerMeter: number;
  inStockMeters: number;
  originCountry: string;
  imageUrl: string;
  textureMapUrl: string;
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
