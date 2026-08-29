import { Response, NextFunction } from 'express';
import { orderService } from './order.service';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/authMiddleware';

export class OrderController {
  async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createOrder(req.user!.userId, req.body);
      return sendSuccess(res, order, 'Order placed successfully', 201);
    } catch (error) {
      return next(error);
    }
  }

  async getUserOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { orders, pagination } = await orderService.getUserOrders(req.user!.userId, page, limit);
      return sendSuccess(res, orders, 'Orders fetched', 200, pagination);
    } catch (error) {
      return next(error);
    }
  }

  async getOrderDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const isCustomer = req.user!.role === 'CUSTOMER';
      const order = await orderService.getOrderDetails(
        req.params.id,
        isCustomer ? req.user!.userId : undefined
      );
      return sendSuccess(res, order, 'Order details retrieved');
    } catch (error) {
      return next(error);
    }
  }

  async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await orderService.updateOrderStatus(req.params.id, req.body);
      return sendSuccess(res, updated, 'Order status updated');
    } catch (error) {
      return next(error);
    }
  }

  async getAdminOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { orders, pagination } = await orderService.getAdminOrders(req.query);
      return sendSuccess(res, orders, 'Admin orders retrieved', 200, pagination);
    } catch (error) {
      return next(error);
    }
  }
}

export const orderController = new OrderController();
