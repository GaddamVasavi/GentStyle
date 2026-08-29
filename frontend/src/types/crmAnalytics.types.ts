export interface LoyaltyAccount {
  id: string;
  userId: string;
  tier: string;
  currentPoints: number;
  lifetimePoints: number;
  spendYTD: number;
  lifetimeSpend: number;
  assignedConciergeName?: string;
  assignedConciergeEmail?: string;
  availablePerks: string[];
  nextTierProgressPercent: number;
  nextTierSpendNeeded: number;
  joinedAt: string;
}

export interface GarmentProvenanceCertificate {
  id: string;
  certificateNumber: string;
  garmentName: string;
  garmentSku: string;
  clientName: string;
  fabricMill: string;
  woolSuperGrade: string;
  weaverBatchNumber: string;
  masterTailor: string;
  dateOfCompletion: string;
  cryptographicSignature: string;
  blockchainVerificationUrl: string;
}

export interface Customer360Profile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  vipTier: string;
  rfmSegment: string;
  stylePersona: string;
  lifetimeValueUsd: number;
  predictedFutureCLV12Months: number;
  churnRiskScorePercent: number;
  averageOrderValue: number;
  totalOrdersCount: number;
  totalBespokeCommissions: number;
  preferredFabricMill: string;
  preferredJacketSilhouette: string;
  suitChestSize: string;
  trouserWaistSize: string;
  shoeSize: string;
  lastAcquisitionDate: string;
  notes: string[];
}

export interface SartorialKPISummary {
  grossMerchandiseVolumeYTD: number;
  averageOrderValue: number;
  bespokeCommissionRatePercent: number;
  repeatPurchaseRatePercent: number;
  returnRatePercent: number;
  grossMarginPercent: number;
  totalActiveVIPMembers: number;
  tailorBenchUtilizationPercent: number;
}

export interface MonthlyRevenueForecast {
  month: string;
  actualRevenueUsd?: number;
  forecastedRevenueUsd: number;
  bespokeRevenueUsd: number;
  readyToWearRevenueUsd: number;
  accessoriesRevenueUsd: number;
  growthRateYoYPercent: number;
}

export interface OutfitRecommendation {
  id: string;
  occasion: string;
  harmonyRule: string;
  ensembleTitle: string;
  curatedDescription: string;
  formalityScoreOutOf100: number;
  components: {
    suit: { name: string; fabric: string; colorHex: string; lapel: string };
    shirt: { name: string; collar: string; fabric: string; colorHex: string };
    tieOrBowtie: { name: string; silkWeave: string; colorHex: string; pattern: string };
    pocketSquare: { name: string; material: string; foldType: string; colorHex: string };
    footwear: { name: string; leather: string; style: string; colorHex: string };
    accessories: string[];
  };
  etiquetteNotes: string[];
}
