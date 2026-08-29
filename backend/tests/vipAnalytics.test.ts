import { loyaltyService } from '../src/modules/loyalty/loyalty.service';
import { crmService } from '../src/modules/crm/crm.service';
import { analyticsService } from '../src/modules/analytics/analytics.service';
import { aiStylistService } from '../src/modules/ai_stylist/aiStylist.service';

describe('VIP Loyalty, CRM, Analytics & AI Stylist Suite', () => {
  test('should return VIP tier definitions and calculate points', () => {
    const tiers = loyaltyService.getTierDefinitions();
    expect(tiers.SARTORIAL_BLACK_CONCIERGE).toBeDefined();
    expect(tiers.SARTORIAL_BLACK_CONCIERGE.pointsMultiplier).toBe(3.0);

    const account = loyaltyService.getAccount('user-001');
    expect(account.tier).toBe('GOLD_SARTORIALIST');
    expect(account.currentPoints).toBeGreaterThan(0);
  });

  test('should retrieve Customer 360 dossiers and predictive CLV scores', () => {
    const customers = crmService.getAllCustomers();
    expect(customers.length).toBeGreaterThanOrEqual(3);
    const champ = customers.find((c) => c.rfmSegment === 'CHAMPIONS');
    expect(champ).toBeDefined();
    expect(champ?.predictedFutureCLV12Months).toBeGreaterThan(10000);
  });

  test('should compute executive sartorial KPIs and revenue forecasts', () => {
    const kpis = analyticsService.getKPISummary();
    expect(kpis.grossMarginPercent).toBeGreaterThan(60);
    expect(kpis.tailorBenchUtilizationPercent).toBeGreaterThan(80);

    const forecasts = analyticsService.getRevenueForecasts();
    expect(forecasts.length).toBe(12);
  });

  test('should generate AI color coordination outfit recommendations', () => {
    const outfits = aiStylistService.generateRecommendations('BOARDROOM_EXECUTIVE');
    expect(outfits.length).toBeGreaterThan(0);
    expect(outfits[0].formalityScoreOutOf100).toBeGreaterThanOrEqual(90);
    expect(outfits[0].components.suit).toBeDefined();
    expect(outfits[0].components.pocketSquare).toBeDefined();
  });
});
