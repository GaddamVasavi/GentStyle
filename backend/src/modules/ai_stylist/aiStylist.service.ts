import { DressCodeOccasion, ColorHarmonyRule, OutfitRecommendation } from './aiStylist.types';

export class AIStylistService {
  private recommendations: OutfitRecommendation[] = [
    {
      id: 'rec-001',
      occasion: 'BOARDROOM_EXECUTIVE',
      harmonyRule: 'ANALOGOUS',
      ensembleTitle: 'The Savile Row Power Silhouette',
      curatedDescription: 'A classic Oxford Navy Super 150s chalkstripe suit anchored by a pale sky blue twill spread collar shirt and an ancient madder burgundy silk tie.',
      formalityScoreOutOf100: 92,
      components: {
        suit: { name: 'Royal Midnight Navy Chalkstripe Super 150s', fabric: 'Loro Piana Extra-Fine Merino', colorHex: '#0f172a', lapel: '3.75" Peak Lapel' },
        shirt: { name: 'Savile Sky Blue Sea Island Cotton Twill', collar: 'Full Cutaway Spread', fabric: '100% Giza 45 Egyptian Cotton', colorHex: '#e0f2fe' },
        tieOrBowtie: { name: 'Ancient Madder Burgundy Paisley 7-Fold Silk Tie', silkWeave: 'Hand-Rolled 36oz Madder Silk', colorHex: '#881337', pattern: 'Foulard Paisley' },
        pocketSquare: { name: 'Crisp White Irish Linen Hand-Rolled Hem', material: 'Pure Irish Linen', foldType: 'Presidential TV Fold', colorHex: '#ffffff' },
        footwear: { name: 'Black Cap-Toe Oxford Hand-Polished Calfskin', leather: 'Full-Grain French Calf', style: 'Closed-Lace Oxford', colorHex: '#09090b' },
        accessories: ['Sterling Silver Double-Bar Cufflinks', 'Black Alligator Dress Belt with Palladium Buckle', 'Subtle Navy Over-the-Calf Silk Socks'],
      },
      etiquetteNotes: [
        'Always ensure exactly 0.5 inches of shirt cuff extends past the jacket sleeve.',
        'Never button the bottom button of a two-button or 3-roll-2 jacket.',
        'Ties should always terminate precisely at the waistband belt buckle center.',
      ],
    },
    {
      id: 'rec-002',
      occasion: 'BLACK_TIE_GALA',
      harmonyRule: 'MONOCHROMATIC',
      ensembleTitle: 'The Midnight Obsidian Gala Tuxedo',
      curatedDescription: 'An exquisite midnight black Barathea wool dinner jacket with grosgrain silk lapels, marcella bib evening shirt, and hand-tied grosgrain butterfly bowtie.',
      formalityScoreOutOf100: 99,
      components: {
        suit: { name: 'Obsidian Barathea Wool Single-Button Dinner Jacket', fabric: 'Scabal Super 180s Pure Wool', colorHex: '#020617', lapel: 'Silk Satin Shawl Lapel' },
        shirt: { name: 'Marcella Pique Bib Fly-Front Evening Shirt', collar: 'Semi-Spread Collar', fabric: 'Swiss Cotton Voile', colorHex: '#ffffff' },
        tieOrBowtie: { name: 'Midnight Silk Grosgrain Butterfly Self-Tie Bowtie', silkWeave: 'Pure Mulberry Grosgrain', colorHex: '#000000', pattern: 'Solid Grosgrain' },
        pocketSquare: { name: 'Snow White Mulberry Silk Puff Fold', material: '100% Mulberry Silk', foldType: 'Classic Puff Fold', colorHex: '#ffffff' },
        footwear: { name: 'Wholecut Patent Leather Oxford Pumps', leather: 'Mirror-Polished Patent Leather', style: 'Wholecut Oxford', colorHex: '#000000' },
        accessories: ['Mother-of-Pearl & Onyx Stud Set', 'Black Silk Moire Cummerbund or Low-Cut Waistcoat', 'Black Silk Hose Socks'],
      },
      etiquetteNotes: [
        'A tuxedo must always be worn with black patent leather or velvet Albert slippers.',
        'Belts are strictly prohibited with tuxedo trousers; use silk grosgrain suspenders or side tabs.',
      ],
    },
    {
      id: 'rec-003',
      occasion: 'SUMMER_RIVIERA',
      harmonyRule: 'TONAL_EARTH',
      ensembleTitle: 'The Amalfi Coast Solaro & Linen Ensemble',
      curatedDescription: 'An unstructured Neapolitan Solaro bronze-green jacket paired with off-white Irish linen trousers, denim chambray spread collar shirt, and suede loafers.',
      formalityScoreOutOf100: 74,
      components: {
        suit: { name: 'Bronze & Brick Red Herringbone Solaro Jacket', fabric: 'Ariston Napoli High-Twist Wool', colorHex: '#78350f', lapel: 'Generous 4.0" Notch Lapel' },
        shirt: { name: 'Washed Indigo Chambray Dress Shirt', collar: 'One-Piece Cooper Collar', fabric: 'Italian Selvedge Chambray', colorHex: '#93c5fd' },
        tieOrBowtie: { name: 'Knit Silk Forest Green Square-End Tie', silkWeave: 'Italian Grenadine Knit', colorHex: '#14532d', pattern: 'Textured Knit' },
        pocketSquare: { name: 'Terracotta & Olive Paisley Silk-Modal', material: 'Silk & Modal Blend', foldType: 'Casual Crown Puff', colorHex: '#b45309' },
        footwear: { name: 'Unlined Snuff Suede Penny Loafers', leather: 'Snuff Calf Suede', style: 'Goodyear Welted Loafer', colorHex: '#92400e' },
        accessories: ['Woven Leather Braided Belt', 'Tortoiseshell Sunglasses with Green Mineral Lenses'],
      },
      etiquetteNotes: [
        'Solaro fabric reflects UV rays with its red warp threads, making it optimal for daytime warm climates.',
        'Suede footwear should be brushed with a brass crepe brush after coastal seaside wear.',
      ],
    }
  ];

  public generateRecommendations(occasion?: DressCodeOccasion): OutfitRecommendation[] {
    if (!occasion) return this.recommendations;
    return this.recommendations.filter((r) => r.occasion === occasion);
  }
}

export const aiStylistService = new AIStylistService();
