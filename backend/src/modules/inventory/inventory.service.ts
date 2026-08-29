import { prisma } from '../../database/prisma';
import { NotFoundError, AppError } from '../../utils/errors';
import { logger } from '../../config/logger';

export interface UpdateStockInput {
  quantity: number;
  lowStockThreshold?: number;
  warehouseLocation?: string;
}

export class InventoryService {
  /**
   * Get all inventory items with variant & product info for admin warehouse management
   */
  async getInventoryList(page: number = 1, limit: number = 50, lowStockOnly: boolean = false) {
    const skip = (page - 1) * limit;
    const where: any = {};

    const [total, items] = await Promise.all([
      prisma.inventory.count({ where }),
      prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        include: {
          variant: {
            include: {
              product: {
                select: { id: true, name: true, sku: true, basePrice: true, brand: true },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const filteredItems = lowStockOnly
      ? items.filter((item) => item.quantity <= item.lowStockThreshold)
      : items;

    return {
      items: filteredItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update stock quantity for a variant
   */
  async updateStock(variantId: string, input: UpdateStockInput) {
    const existing = await prisma.inventory.findUnique({
      where: { variantId },
    });

    if (!existing) {
      throw new NotFoundError('Inventory record for variant not found');
    }

    const updated = await prisma.inventory.update({
      where: { variantId },
      data: {
        quantity: input.quantity,
        ...(input.lowStockThreshold !== undefined ? { lowStockThreshold: input.lowStockThreshold } : {}),
        ...(input.warehouseLocation !== undefined ? { warehouseLocation: input.warehouseLocation } : {}),
      },
    });

    logger.info(`Inventory updated for variant ${variantId}: quantity is now ${input.quantity}`);
    return updated;
  }

  /**
   * Reserve stock during checkout
   */
  async reserveStock(variantId: string, quantityToReserve: number, txClient?: any) {
    const db = txClient || prisma;
    const inventory = await db.inventory.findUnique({
      where: { variantId },
    });

    if (!inventory) {
      throw new NotFoundError('Inventory record not found');
    }

    const available = inventory.quantity - inventory.reservedQuantity;
    if (available < quantityToReserve) {
      throw new AppError(
        `Insufficient inventory for selected item. Requested: ${quantityToReserve}, Available: ${available}`,
        400,
        'INSUFFICIENT_STOCK'
      );
    }

    return db.inventory.update({
      where: { variantId },
      data: {
        reservedQuantity: { increment: quantityToReserve },
      },
    });
  }

  /**
   * Deduct stock on completed order
   */
  async commitStockDeduction(variantId: string, quantityToDeduct: number, txClient?: any) {
    const db = txClient || prisma;
    return db.inventory.update({
      where: { variantId },
      data: {
        quantity: { decrement: quantityToDeduct },
        reservedQuantity: { decrement: quantityToDeduct },
      },
    });
  }
}

export const inventoryService = new InventoryService();
