import { prisma } from '../../database/prisma';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../config/logger';

export interface CreateReturnRequestInput {
  orderId: string;
  orderItemId: string;
  reason: string;
  comments?: string;
  type: 'RETURN' | 'EXCHANGE';
  desiredVariantId?: string;
}

export class ReturnService {
  async submitRequest(userId: string, input: CreateReturnRequestInput) {
    const order = await prisma.order.findFirst({
      where: { id: input.orderId, userId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const orderItem = order.items.find((item) => item.id === input.orderItemId);
    if (!orderItem) {
      throw new NotFoundError('Item not found in this order');
    }

    if (input.type === 'EXCHANGE') {
      if (!input.desiredVariantId) {
        throw new ValidationError('Desired variant is required for size/color exchanges');
      }

      const exchangeReq = await prisma.exchangeRequest.create({
        data: {
          orderId: order.id,
          orderItemId: orderItem.id,
          userId,
          replacementVariantId: input.desiredVariantId,
          reason: input.comments ? `${input.reason}: ${input.comments}` : input.reason,
          status: 'PENDING_REVIEW',
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'EXCHANGED' },
      });

      logger.info(`Exchange requested for order ${order.orderNumber} by user ${userId}`);
      return exchangeReq;
    } else {
      const returnReq = await prisma.returnRequest.create({
        data: {
          orderId: order.id,
          orderItemId: orderItem.id,
          userId,
          reason: input.reason,
          comments: input.comments,
          refundAmount: orderItem.totalPrice,
          status: 'PENDING_REVIEW',
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'RETURNED' },
      });

      logger.info(`Return requested for order ${order.orderNumber} by user ${userId}`);
      return returnReq;
    }
  }

  async getAdminReturnRequests() {
    return prisma.returnRequest.findMany({
      include: {
        order: { select: { orderNumber: true, user: true } },
        orderItem: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAdminExchangeRequests() {
    return prisma.exchangeRequest.findMany({
      include: {
        order: { select: { orderNumber: true, user: true } },
        orderItem: true,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateReturnStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'COMPLETED', notes?: string) {
    const ret = await prisma.returnRequest.findUnique({ where: { id } });
    if (!ret) throw new NotFoundError('Return request not found');

    const updated = await prisma.returnRequest.update({
      where: { id },
      data: {
        status: status as any,
        adminNotes: notes,
      },
    });

    if (status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: ret.orderId },
        data: { status: 'RETURNED' },
      });
    }

    return updated;
  }
}

export const returnService = new ReturnService();
