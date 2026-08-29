export type VIPTierLevel = 'BRONZE_GENTLEMAN' | 'SILVER_HERITAGE' | 'GOLD_SARTORIALIST' | 'PLATINUM_BESPOKE_AMBASSADOR' | 'SARTORIAL_BLACK_CONCIERGE';
export type RewardPerkType = 'COMPLIMENTARY_ALTERATIONS' | 'PRIVATE_CHAUFFEUR_FITTING' | 'MILAN_TRUNK_SHOW_PASS' | 'CUSTOM_MONOGRAMMING_WAIVED' | 'PERSONAL_STYLE_DIRECTOR' | 'ANNUAL_BESPOKE_GIFT';
export type PointTransactionType = 'ACQUISITION_PURCHASE' | 'BESPOKE_COMMISSION' | 'VIP_TIER_BONUS' | 'REPAIR_RECONDITION_CREDIT' | 'PERK_REDEMPTION' | 'CONCIERGE_COURTESY_GRANT';

export interface VIPTierDefinition {
  tier: VIPTierLevel;
  tierName: string;
  minSpendUsd: number;
  pointsMultiplier: number;
  colorHex: string;
  badgeIcon: string;
  perks: RewardPerkType[];
  description: string;
}

export interface LoyaltyAccount {
  id: string;
  userId: string;
  tier: VIPTierLevel;
  currentPoints: number;
  lifetimePoints: number;
  spendYTD: number;
  lifetimeSpend: number;
  assignedConciergeName?: string;
  assignedConciergeEmail?: string;
  availablePerks: RewardPerkType[];
  nextTierProgressPercent: number;
  nextTierSpendNeeded: number;
  joinedAt: string;
}

export interface LoyaltyPointRecord {
  id: string;
  accountId: string;
  type: PointTransactionType;
  points: number;
  description: string;
  referenceId?: string;
  createdAt: string;
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
