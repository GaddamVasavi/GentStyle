import { warehouseService } from '../src/modules/warehouse/warehouse.service';
import { procurementService } from '../src/modules/procurement/procurement.service';
import { logisticsService } from '../src/modules/logistics/logistics.service';

describe('Supply Chain & Warehouse ERP Suite', () => {
  test('should retrieve multi-warehouse network locations', () => {
    const warehouses = warehouseService.getAllWarehouses();
    expect(warehouses.length).toBeGreaterThanOrEqual(3);
    const nyc = warehouses.find((w) => w.id === 'wh-nyc-flagship');
    expect(nyc).toBeDefined();
    expect(nyc?.climateControlled).toBe(true);
  });

  test('should filter inventory by ABC classification and SKU', () => {
    const classAItems = warehouseService.getInventory(undefined, undefined, 'CLASS_A_ULTRA_LUXURY');
    expect(classAItems.length).toBeGreaterThanOrEqual(1);
    expect(classAItems[0].totalValuation).toBeGreaterThan(0);
  });

  test('should retrieve verified European heritage suppliers', () => {
    const suppliers = procurementService.getSuppliers();
    expect(suppliers.length).toBeGreaterThanOrEqual(2);
    const lp = suppliers.find((s) => s.id === 'sup-loro-piana');
    expect(lp).toBeDefined();
    expect(lp?.onTimeDeliveryRatePercent).toBeGreaterThan(95);
  });

  test('should calculate carrier quotes and generate DDP customs declaration', () => {
    const quotes = logisticsService.calculateRates('Italy', 'United States', 4.0);
    expect(quotes.length).toBeGreaterThanOrEqual(2);
    const dhl = quotes.find((q) => q.carrierCode === 'DHL_EXPRESS');
    expect(dhl).toBeDefined();
    expect(dhl?.rateUsd).toBeGreaterThan(0);

    const customs = logisticsService.generateCustomsDeclaration('ORD-12345', 2500, 'Italy');
    expect(customs.hsTariffCode).toBe('6203.11.0000');
    expect(customs.incoterms).toBe('DDP_DELIVERED_DUTY_PAID');
  });
});
