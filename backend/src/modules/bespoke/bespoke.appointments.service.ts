import { TailorAppointment, BodyMeasurementProfile } from './bespoke.types';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { logger } from '../../config/logger';

export class BespokeAppointmentsService {
  private appointments: TailorAppointment[] = [
    {
      id: 'apt-001',
      userId: 'user-001',
      tailorId: 'master-tailor-lorenzo',
      tailorName: 'Maestro Lorenzo Moretti (Master Sartorialist, Savile Row & Milan)',
      serviceType: 'VIRTUAL_3D_MEASUREMENT',
      appointmentDate: '2026-09-05',
      timeSlot: '14:00 - 15:00 EST',
      status: 'SCHEDULED',
      meetingRoomUrl: 'https://video.gentstyle.luxury/rooms/sartorial-room-8821',
      notes: 'Initial fitting for Royal Navy Glen Plaid Double-Breasted 3-Piece Suit.',
    },
    {
      id: 'apt-002',
      userId: 'user-001',
      tailorId: 'master-tailor-arthur',
      tailorName: 'Arthur Pendelton (Head Cutter, Savile Row London)',
      serviceType: 'IN_PERSON_SUITE_FITTING',
      appointmentDate: '2026-09-12',
      timeSlot: '11:00 - 12:30 EST',
      status: 'SCHEDULED',
      clientAddress: 'GentStyle VIP Lounge, 5th Avenue Flagship, New York, NY',
      notes: 'Baste fitting & shoulder slope chalking session.',
    }
  ];

  public async getUserAppointments(userId: string): Promise<TailorAppointment[]> {
    return this.appointments.filter((a) => a.userId === userId);
  }

  public async bookAppointment(userId: string, data: {
    tailorName?: string;
    serviceType: TailorAppointment['serviceType'];
    appointmentDate: string;
    timeSlot: string;
    clientAddress?: string;
    notes?: string;
  }): Promise<TailorAppointment> {
    if (!data.appointmentDate || !data.timeSlot) {
      throw new ValidationError('Appointment date and time slot are required');
    }

    const appointment: TailorAppointment = {
      id: `apt-${Date.now()}`,
      userId,
      tailorId: 'master-tailor-lorenzo',
      tailorName: data.tailorName || 'Maestro Lorenzo Moretti (Master Sartorialist)',
      serviceType: data.serviceType,
      appointmentDate: data.appointmentDate,
      timeSlot: data.timeSlot,
      status: 'SCHEDULED',
      meetingRoomUrl: data.serviceType === 'VIRTUAL_3D_MEASUREMENT'
        ? `https://video.gentstyle.luxury/rooms/bespoke-${Math.random().toString(36).substring(2, 9)}`
        : undefined,
      clientAddress: data.clientAddress,
      notes: data.notes,
    };

    this.appointments.push(appointment);
    logger.info(`Booked bespoke fitting appointment ${appointment.id} for user ${userId}`);
    return appointment;
  }

  public async cancelAppointment(id: string, userId: string): Promise<TailorAppointment> {
    const apt = this.appointments.find((a) => a.id === id && a.userId === userId);
    if (!apt) throw new NotFoundError('Appointment not found');
    apt.status = 'CANCELLED';
    return apt;
  }
}

export const bespokeAppointmentsService = new BespokeAppointmentsService();
