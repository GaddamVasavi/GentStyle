import { Request, Response, NextFunction } from 'express';
import { warehouseService } from './warehouse.service';
import { sendSuccess } from '../../utils/response';
import { InventoryABCClass } from './warehouse.types';

export class WarehouseController {
  public getWarehouses(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouses = warehouseService.getAllWarehouses();
      return sendSuccess(res, warehouses, 'Warehouse network locations retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getWarehouseById(req: Request, res: Response, next: NextFunction) {
    try {
      const wh = warehouseService.getWarehouseById(req.params.id);
      return sendSuccess(res, wh, 'Warehouse details retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const { warehouseId, sku, abcClass } = req.query;
      const items = warehouseService.getInventory(
        warehouseId as string,
        sku as string,
        abcClass as InventoryABCClass
      );
      return sendSuccess(res, items, 'Inventory stock ledger retrieved');
    } catch (err) {
      next(err);
    }
  }

  public createTransfer(req: Request, res: Response, next: NextFunction) {
    try {
      const sto = warehouseService.createStockTransfer(req.body);
      return sendSuccess(res, sto, 'Stock transfer order initiated', 201);
    } catch (err) {
      next(err);
    }
  }

  public getTransfers(req: Request, res: Response, next: NextFunction) {
    try {
      const stos = warehouseService.getTransferOrders();
      return sendSuccess(res, stos, 'Stock transfer orders retrieved');
    } catch (err) {
      next(err);
    }
  }
}

export const warehouseController = new WarehouseController();
