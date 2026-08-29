import { Request, Response, NextFunction } from 'express';
import { fabricCatalogService } from './bespoke.fabrics.catalog';
import { biometricMeasurementEngine } from './bespoke.measurements.engine';
import { bespokeConfiguratorEngine } from './bespoke.configurator.engine';
import { bespokeAppointmentsService } from './bespoke.appointments.service';
import { sendSuccess } from '../../utils/response';
import { BodyMeasurementProfile, BespokeGarmentConfig } from './bespoke.types';

export class BespokeController {
  // Fabrics
  public getFabrics(req: Request, res: Response, next: NextFunction) {
    try {
      const { mill, season, weavePattern, maxPrice } = req.query;
      const fabrics = fabricCatalogService.filterFabrics({
        mill: mill as string,
        season: season as string,
        weavePattern: weavePattern as string,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
      return sendSuccess(res, fabrics, 'Luxury fabric swatches retrieved');
    } catch (err) {
      next(err);
    }
  }

  public getFabricById(req: Request, res: Response, next: NextFunction) {
    try {
      const fabric = fabricCatalogService.getFabricById(req.params.id);
      return sendSuccess(res, fabric, 'Fabric swatch details retrieved');
    } catch (err) {
      next(err);
    }
  }

  // Price Calculation
  public calculateConfigPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const config: BespokeGarmentConfig = req.body;
      const pricing = bespokeConfiguratorEngine.calculatePrice(config);
      return sendSuccess(res, pricing, 'Bespoke tailoring quote computed');
    } catch (err) {
      next(err);
    }
  }

  // Biometric Measurement Analysis
  public analyzeMeasurements(req: Request, res: Response, next: NextFunction) {
    try {
      const profile: BodyMeasurementProfile = req.body;
      const analysis = biometricMeasurementEngine.analyzeMeasurements(profile);
      const finishedSpecs = biometricMeasurementEngine.calculateGarmentFinishedSpecs(profile);
      return sendSuccess(res, { analysis, finishedSpecs }, 'Biometric measurement analysis and ease tolerances computed');
    } catch (err) {
      next(err);
    }
  }

  // Tailor Appointments
  public async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'anonymous-client';
      const appointments = await bespokeAppointmentsService.getUserAppointments(userId);
      return sendSuccess(res, appointments, 'Tailor appointments retrieved');
    } catch (err) {
      next(err);
    }
  }

  public async bookAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'anonymous-client';
      const appointment = await bespokeAppointmentsService.bookAppointment(userId, req.body);
      return sendSuccess(res, appointment, 'Master tailor appointment successfully scheduled', 201);
    } catch (err) {
      next(err);
    }
  }

  public async cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'anonymous-client';
      const appointment = await bespokeAppointmentsService.cancelAppointment(req.params.id, userId);
      return sendSuccess(res, appointment, 'Appointment cancelled');
    } catch (err) {
      next(err);
    }
  }
}

export const bespokeController = new BespokeController();
