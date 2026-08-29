export type DressCodeOccasion = 'WHITE_TIE_CORONATION' | 'BLACK_TIE_GALA' | 'BOARDROOM_EXECUTIVE' | 'COCKTAIL_EVENING' | 'SUMMER_RIVIERA' | 'WEEKEND_ESTATE_TWEED';
export type ColorHarmonyRule = 'MONOCHROMATIC' | 'ANALOGOUS' | 'COMPLEMENTARY' | 'TRIADIC' | 'TONAL_EARTH';

export interface OutfitRecommendation {
  id: string;
  occasion: DressCodeOccasion;
  harmonyRule: ColorHarmonyRule;
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
