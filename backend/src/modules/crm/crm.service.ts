import { Customer360Profile, RFMSegment, WardrobeStylePersona } from './crm.types';

export class CRMService {
  private profiles: Customer360Profile[] = [
    {
      id: 'crm-001',
      userId: 'user-001',
      fullName: 'Lord Julian Sterling',
      email: 'julian.sterling@mayfair-advisory.co.uk',
      phone: '+44 20 7946 0912',
      vipTier: 'GOLD_SARTORIALIST',
      rfmSegment: 'CHAMPIONS',
      stylePersona: 'BRITISH_GENTLEMAN',
      lifetimeValueUsd: 32800.0,
      predictedFutureCLV12Months: 19400.0,
      churnRiskScorePercent: 4.2,
      averageOrderValue: 4100.0,
      totalOrdersCount: 8,
      totalBespokeCommissions: 4,
      preferredFabricMill: 'Loro Piana & Scabal',
      preferredJacketSilhouette: 'CLASSIC_BRITISH',
      suitChestSize: '40R',
      trouserWaistSize: '33W',
      shoeSize: '10.5 UK / 44.5 EU',
      lastAcquisitionDate: '2026-08-14',
      notes: [
        'Prefers 1.75 inch cuffs on all bespoke flannels.',
        'Invitations to London trunk show should be dispatched 3 weeks prior.',
        'Wears double-breasted 6x2 peak lapels for evening gala events.',
      ],
    },
    {
      id: 'crm-002',
      userId: 'user-002',
      fullName: 'Matteo Moretti',
      email: 'm.moretti@luxholding.it',
      phone: '+39 02 8901 4421',
      vipTier: 'PLATINUM_BESPOKE_AMBASSADOR',
      rfmSegment: 'CHAMPIONS',
      stylePersona: 'MILANESE_SPREZZATURA',
      lifetimeValueUsd: 58900.0,
      predictedFutureCLV12Months: 34200.0,
      churnRiskScorePercent: 2.1,
      averageOrderValue: 5890.0,
      totalOrdersCount: 10,
      totalBespokeCommissions: 7,
      preferredFabricMill: 'Ermenegildo Zegna Trofeo & Solaro',
      preferredJacketSilhouette: 'NEAPOLITAN_SOFT',
      suitChestSize: '42R',
      trouserWaistSize: '34W',
      shoeSize: '11 US / 45 EU',
      lastAcquisitionDate: '2026-08-22',
      notes: [
        'Spalla camicia unpadded shoulders only.',
        'Requires horn buttons carved from brown buffalo.',
      ],
    },
    {
      id: 'crm-003',
      userId: 'user-003',
      fullName: 'Harrison Vanderbilt III',
      email: 'h.vanderbilt@manhattan-cap.com',
      phone: '+1 212 555 0199',
      vipTier: 'SARTORIAL_BLACK_CONCIERGE',
      rfmSegment: 'CHAMPIONS',
      stylePersona: 'MODERN_WALL_STREET',
      lifetimeValueUsd: 112000.0,
      predictedFutureCLV12Months: 65000.0,
      churnRiskScorePercent: 1.5,
      averageOrderValue: 8600.0,
      totalOrdersCount: 13,
      totalBespokeCommissions: 9,
      preferredFabricMill: 'Scabal Super 200s & Loro Piana Cashmere',
      preferredJacketSilhouette: 'PARISIAN_STRUCTURED',
      suitChestSize: '44L',
      trouserWaistSize: '36W',
      shoeSize: '12 US / 46 EU',
      lastAcquisitionDate: '2026-08-27',
      notes: [
        'Requests private fitting sessions in Manhattan penthouse.',
        'Monograms all shirt cuffs with gold bullion wire.',
      ],
    }
  ];

  public getAllCustomers(search?: string, segment?: RFMSegment): Customer360Profile[] {
    return this.profiles.filter((p) => {
      if (segment && p.rfmSegment !== segment) return false;
      if (search && !p.fullName.toLowerCase().includes(search.toLowerCase()) && !p.email.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }

  public getCustomerById(id: string): Customer360Profile | undefined {
    return this.profiles.find((p) => p.id === id || p.userId === id);
  }
}

export const crmService = new CRMService();
