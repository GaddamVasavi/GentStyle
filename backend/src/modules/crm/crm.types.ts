export type RFMSegment = 'CHAMPIONS' | 'LOYAL_PATRONS' | 'POTENTIAL_ENTHUSIASTS' | 'RECENT_CUSTOMERS' | 'NEED_ATTENTION' | 'AT_RISK_HIBERNATING';
export type WardrobeStylePersona = 'BRITISH_GENTLEMAN' | 'MILANESE_SPREZZATURA' | 'MODERN_WALL_STREET' | 'MEDITERRANEAN_RESORT' | 'BLACK_TIE_CONNOISSEUR';

export interface Customer360Profile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  vipTier: string;
  rfmSegment: RFMSegment;
  stylePersona: WardrobeStylePersona;
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
