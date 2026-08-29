import { prisma } from '../../database/prisma';
import { NotFoundError } from '../../utils/errors';

export class InvoiceService {
  async getInvoiceByOrder(orderId: string, userId?: string) {
    const where: any = { orderId };
    if (userId) {
      where.order = { userId };
    }

    const invoice = await prisma.invoice.findFirst({
      where,
      include: {
        order: {
          include: {
            items: true,
            shippingAddress: true,
            billingAddress: true,
            user: { select: { firstName: true, lastName: true, email: true } },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundError('Invoice record not found');
    }

    return invoice;
  }
}

export const invoiceService = new InvoiceService();
