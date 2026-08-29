import { prisma } from '../../database/prisma';
import { NotFoundError, AppError, ValidationError } from '../../utils/errors';
import { CreateOrderInput, UpdateOrderStatusInput, OrderQueryFilter } from './order.types';
import { logger } from '../../config/logger';
import { Prisma, OrderStatus } from '@prisma/client';
import crypto from 'crypto';

export class OrderService {
  /**
   * Helper to generate unique order number
   */
  private generateOrderNumber(): string {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `GS-${new Date().getFullYear()}-${randomHex}${timestamp}`;
  }

  /**
   * Helper to generate invoice number
   */
  private generateInvoiceNumber(): string {
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `INV-${new Date().getFullYear()}-${randomHex}`;
  }

  /**
   * Create order from user's active cart
   */
  async createOrder(userId: string, input: CreateOrderInput) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: {
              include: { inventory: true },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new ValidationError('Your wardrobe cart is empty. Please select sartorial pieces to acquire.');
    }

    const shippingAddress = await prisma.address.findFirst({
      where: { id: input.shippingAddressId, userId },
    });

    if (!shippingAddress) {
      throw new NotFoundError('Selected shipping address not found');
    }

    const billingAddress = input.billingAddressId
      ? await prisma.address.findFirst({ where: { id: input.billingAddressId, userId } })
      : shippingAddress;

    // Validate coupon if provided
    let discountAmount = 0;
    let couponId: string | null = null;

    if (input.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: input.couponCode.toUpperCase() },
      });

      if (!coupon || !coupon.isActive) {
        throw new ValidationError('Invalid or expired promotional voucher code');
      }

      if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
        throw new ValidationError('Promotional voucher code has expired');
      }

      couponId = coupon.id;
    }

    // Execute multi-entity transactional order placement
    return prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData: any[] = [];

      // Validate and reserve stock for all items
      for (const item of cart.items) {
        const inventory = item.variant.inventory;
        if (!inventory) {
          throw new ValidationError(`Inventory record missing for ${item.product.name}`);
        }

        const available = inventory.quantity - inventory.reservedQuantity;
        if (available < item.quantity) {
          throw new AppError(
            `Insufficient stock for ${item.product.name} (${item.variant.size}). Available: ${available}`,
            400,
            'INSUFFICIENT_STOCK'
          );
        }

        // Reserve stock
        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            reservedQuantity: { increment: item.quantity },
          },
        });

        const effectiveBase = item.product.discountPrice !== null ? Number(item.product.discountPrice) : Number(item.product.basePrice);
        const adjustment = Number(item.variant.priceAdjustment || 0);
        const unitPrice = effectiveBase + adjustment;
        const itemTotal = unitPrice * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.product.name,
          variantSize: item.variant.size,
          variantColor: item.variant.colorName,
          quantity: item.quantity,
          unitPrice: new Prisma.Decimal(unitPrice),
          totalPrice: new Prisma.Decimal(itemTotal),
        });
      }

      // Calculate coupon discount
      if (couponId) {
        const coupon = await tx.coupon.findUnique({ where: { id: couponId } });
        if (coupon) {
          if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
            throw new ValidationError(
              `Promotional voucher requires a minimum order value of $${coupon.minOrderAmount}`
            );
          }

          if (coupon.type === 'PERCENTAGE') {
            discountAmount = (subtotal * Number(coupon.value)) / 100;
            if (coupon.maxDiscount) {
              discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
            }
          } else {
            discountAmount = Number(coupon.value);
          }

          // Record usage
          await tx.couponUsage.create({
            data: {
              couponId: coupon.id,
              userId,
              orderId: 'temp',
              discount: new Prisma.Decimal(discountAmount),
            },
          }).catch(() => null);

          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      const shippingFee = subtotal >= 250 ? 0 : 25;
      const taxAmount = Math.round(subtotal * 0.0825 * 100) / 100;
      const totalAmount = Math.max(0, subtotal + shippingFee + taxAmount - discountAmount);

      const orderNumber = this.generateOrderNumber();
      const invoiceNumber = this.generateInvoiceNumber();

      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          shippingAddressId: shippingAddress.id,
          billingAddressId: billingAddress?.id || shippingAddress.id,
          subTotal: new Prisma.Decimal(subtotal),
          discountAmount: new Prisma.Decimal(discountAmount),
          shippingFee: new Prisma.Decimal(shippingFee),
          taxAmount: new Prisma.Decimal(taxAmount),
          totalAmount: new Prisma.Decimal(totalAmount),
          status: 'PENDING',
          notes: input.specialInstructions,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
          shippingAddress: true,
          billingAddress: true,
        },
      });

      // Create Payment Ledger Entry
      await tx.payment.create({
        data: {
          orderId: order.id,
          paymentMethod: input.paymentMethod,
          paymentProvider: input.paymentMethod === 'STRIPE' ? 'Stripe Gateway' : input.paymentMethod === 'RAZORPAY' ? 'Razorpay' : 'COD Concierge',
          amount: new Prisma.Decimal(totalAmount),
          currency: 'USD',
          status: input.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PENDING',
        },
      });

      // Generate Digital Invoice
      await tx.invoice.create({
        data: {
          orderId: order.id,
          invoiceNumber,
          subTotal: new Prisma.Decimal(subtotal),
          taxAmount: new Prisma.Decimal(taxAmount),
          shippingFee: new Prisma.Decimal(shippingFee),
          discount: new Prisma.Decimal(discountAmount),
          grandTotal: new Prisma.Decimal(totalAmount),
        },
      });

      // Clear Cart Items after successful order creation
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Create customer notification
      await tx.notification.create({
        data: {
          userId,
          title: 'Order Placed Successfully',
          message: `Your acquisition #${order.orderNumber} has been received and is awaiting preparation.`,
          type: 'ORDER',
        },
      });

      logger.info(`Order placed: ${order.orderNumber} (${order.id}) by user ${userId}`);
      return order;
    });
  }

  /**
   * Get customer orders with pagination
   */
  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true } },
                },
              },
            },
          },
          shipment: true,
          invoice: true,
          payment: true,
        },
      }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single order by order number or ID
   */
  async getOrderDetails(identifier: string, userId?: string) {
    const where: any = {
      OR: [{ id: identifier }, { orderNumber: identifier }],
    };

    if (userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                images: { where: { isPrimary: true } },
              },
            },
          },
        },
        shippingAddress: true,
        billingAddress: true,
        shipment: true,
        invoice: true,
        payment: true,
        returnRequests: true,
        exchangeRequests: true,
      },
    });

    if (!order) {
      throw new NotFoundError('Sartorial order not found');
    }

    return order;
  }

  /**
   * Transition order status through the lifecycle
   */
  async updateOrderStatus(orderId: string, input: UpdateOrderStatusInput) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { variant: { include: { inventory: true } } } } },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return prisma.$transaction(async (tx) => {
      const dataToUpdate: any = {
        status: input.status as OrderStatus,
      };

      // When confirmed or packed, commit stock deduction
      if (input.status === 'CONFIRMED' || input.status === 'PACKED') {
        for (const item of order.items) {
          if (item.variant.inventory) {
            await tx.inventory.update({
              where: { id: item.variant.inventory.id },
              data: {
                quantity: { decrement: item.quantity },
                reservedQuantity: { decrement: item.quantity },
              },
            });
          }
        }
      }

      // If cancelled, release reserved stock
      if (input.status === 'CANCELLED' && order.status !== 'CANCELLED') {
        for (const item of order.items) {
          if (item.variant.inventory) {
            await tx.inventory.update({
              where: { id: item.variant.inventory.id },
              data: {
                reservedQuantity: { decrement: item.quantity },
              },
            });
          }
        }
      }

      // If dispatched, create shipment record if tracking provided
      if (input.status === 'SHIPPED' && input.carrierTrackingNumber) {
        await tx.shipment.create({
          data: {
            orderId: order.id,
            carrier: input.carrierName || 'DHL Express Luxury',
            trackingNumber: input.carrierTrackingNumber,
            status: 'SHIPPED',
            shippedAt: new Date(),
          },
        });
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: dataToUpdate,
      });

      // Notify customer of status milestone
      await tx.notification.create({
        data: {
          userId: order.userId,
          title: `Order Status Updated: ${input.status}`,
          message: `Order #${order.orderNumber} status changed to ${input.status}. ${input.notes || ''}`,
          type: 'ORDER',
        },
      });

      logger.info(`Order ${order.orderNumber} transitioned to ${input.status}`);
      return updated;
    });
  }

  /**
   * Admin query orders with filters
   */
  async getAdminOrders(filter: OrderQueryFilter) {
    const page = Math.max(1, Number(filter.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filter.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (filter.status) {
      where.status = filter.status as OrderStatus;
    }

    if (filter.search) {
      where.OR = [
        { orderNumber: { contains: filter.search, mode: 'insensitive' } },
        { user: { email: { contains: filter.search, mode: 'insensitive' } } },
        { user: { lastName: { contains: filter.search, mode: 'insensitive' } } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
          items: true,
          payment: true,
          shipment: true,
        },
      }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const orderService = new OrderService();
