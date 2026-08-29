import {
  VIPTierLevel,
  VIPTierDefinition,
  LoyaltyAccount,
  LoyaltyPointRecord,
  GarmentProvenanceCertificate,
} from './loyalty.types';
import { NotFoundError } from '../../utils/errors';
import { logger } from '../../config/logger';

export const VIP_TIER_DEFINITIONS: Record<VIPTierLevel, VIPTierDefinition> = {
  BRONZE_GENTLEMAN: {
    tier: 'BRONZE_GENTLEMAN',
    tierName: 'Gentleman Member',
    minSpendUsd: 0,
    pointsMultiplier: 1.0,
    colorHex: '#cd7f32',
    badgeIcon: 'Award',
    perks: ['CUSTOM_MONOGRAMMING_WAIVED'],
    description: 'Welcome to GentStyle. Complimentary initial monogramming and seasonal sartorial newsletters.',
  },
  SILVER_HERITAGE: {
    tier: 'SILVER_HERITAGE',
    tierName: 'Heritage Patron',
    minSpendUsd: 5000,
    pointsMultiplier: 1.25,
    colorHex: '#94a3b8',
    badgeIcon: 'ShieldCheck',
    perks: ['CUSTOM_MONOGRAMMING_WAIVED', 'COMPLIMENTARY_ALTERATIONS'],
    description: 'Complimentary wardrobe alteration adjustments and priority boutique appointments.',
  },
  GOLD_SARTORIALIST: {
    tier: 'GOLD_SARTORIALIST',
    tierName: 'Sartorialist Gold',
    minSpendUsd: 15000,
    pointsMultiplier: 1.5,
    colorHex: '#f59e0b',
    badgeIcon: 'Crown',
    perks: ['CUSTOM_MONOGRAMMING_WAIVED', 'COMPLIMENTARY_ALTERATIONS', 'MILAN_TRUNK_SHOW_PASS'],
    description: 'VIP preview of European mill fabric bolts, Milan and Savile Row trunk shows.',
  },
  PLATINUM_BESPOKE_AMBASSADOR: {
    tier: 'PLATINUM_BESPOKE_AMBASSADOR',
    tierName: 'Platinum Bespoke Ambassador',
    minSpendUsd: 35000,
    pointsMultiplier: 2.0,
    colorHex: '#e2e8f0',
    badgeIcon: 'Sparkles',
    perks: [
      'CUSTOM_MONOGRAMMING_WAIVED',
      'COMPLIMENTARY_ALTERATIONS',
      'MILAN_TRUNK_SHOW_PASS',
      'PRIVATE_CHAUFFEUR_FITTING',
      'PERSONAL_STYLE_DIRECTOR',
    ],
    description: 'Dedicated bespoke style director and private chauffeur fitting consultations at your residence.',
  },
  SARTORIAL_BLACK_CONCIERGE: {
    tier: 'SARTORIAL_BLACK_CONCIERGE',
    tierName: 'Sartorial Black Concierge (Invitation Only)',
    minSpendUsd: 75000,
    pointsMultiplier: 3.0,
    colorHex: '#09090b',
    badgeIcon: 'Gem',
    perks: [
      'CUSTOM_MONOGRAMMING_WAIVED',
      'COMPLIMENTARY_ALTERATIONS',
      'MILAN_TRUNK_SHOW_PASS',
      'PRIVATE_CHAUFFEUR_FITTING',
      'PERSONAL_STYLE_DIRECTOR',
      'ANNUAL_BESPOKE_GIFT',
    ],
    description: 'The pinnacle of luxury menswear. Private access to rare Super 200s & Vicuña allocations and annual custom bespoke gift.',
  },
};

export class LoyaltyService {
  private accounts: Map<string, LoyaltyAccount> = new Map([
    [
      'user-001',
      {
        id: 'acc-001',
        userId: 'user-001',
        tier: 'GOLD_SARTORIALIST',
        currentPoints: 24500,
        lifetimePoints: 48900,
        spendYTD: 18450.0,
        lifetimeSpend: 32800.0,
        assignedConciergeName: 'Dott. Alessandro Visconti (Senior Private Client Director)',
        assignedConciergeEmail: 'visconti.concierge@gentstyle.luxury',
        availablePerks: ['CUSTOM_MONOGRAMMING_WAIVED', 'COMPLIMENTARY_ALTERATIONS', 'MILAN_TRUNK_SHOW_PASS'],
        nextTierProgressPercent: 52.7,
        nextTierSpendNeeded: 16550.0,
        joinedAt: '2025-01-15T10:00:00Z',
      }
    ]
  ]);

  private certificates: GarmentProvenanceCertificate[] = [
    {
      id: 'cert-8812',
      certificateNumber: 'GS-CERT-2026-08812',
      garmentName: 'Bespoke Royal Navy Birdseye Super 130s 3-Piece Suit',
      garmentSku: 'GS-SUIT-LP-NAVY-40R',
      clientName: 'Lord Arthur Pendelton',
      fabricMill: 'Loro Piana S.p.A. (Biella, Italy)',
      woolSuperGrade: 'Super 130s Australian Merino',
      weaverBatchNumber: 'LP-BATCH-9942A',
      masterTailor: 'Maestro Lorenzo Moretti',
      dateOfCompletion: '2026-08-20',
      cryptographicSignature: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      blockchainVerificationUrl: 'https://provenance.gentstyle.luxury/verify/GS-CERT-2026-08812',
    }
  ];

  public getAccount(userId: string): LoyaltyAccount {
    let acc = this.accounts.get(userId);
    if (!acc) {
      acc = {
        id: `acc-${Date.now()}`,
        userId,
        tier: 'BRONZE_GENTLEMAN',
        currentPoints: 500,
        lifetimePoints: 500,
        spendYTD: 0,
        lifetimeSpend: 0,
        assignedConciergeName: 'GentStyle Concierge Desk',
        assignedConciergeEmail: 'concierge@gentstyle.luxury',
        availablePerks: ['CUSTOM_MONOGRAMMING_WAIVED'],
        nextTierProgressPercent: 0,
        nextTierSpendNeeded: 5000.0,
        joinedAt: new Date().toISOString(),
      };
      this.accounts.set(userId, acc);
    }
    return acc;
  }

  public getTierDefinitions(): Record<VIPTierLevel, VIPTierDefinition> {
    return VIP_TIER_DEFINITIONS;
  }

  public getProvenanceCertificates(userId?: string): GarmentProvenanceCertificate[] {
    return this.certificates;
  }
}

export const loyaltyService = new LoyaltyService();
