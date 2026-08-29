import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchBespokeAppointments } from '../../store/slices/bespokeSlice';
import { bespokeService } from '../../services/bespoke.service';
import { addToast } from '../../store/slices/uiSlice';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Calendar, Video, MapPin, Clock } from 'lucide-react';

export const TailorFittingBookingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments } = useSelector((state: RootState) => state.bespoke);

  const [serviceType, setServiceType] = useState<'VIRTUAL_3D_MEASUREMENT' | 'IN_PERSON_SUITE_FITTING'>('VIRTUAL_3D_MEASUREMENT');
  const [appointmentDate, setAppointmentDate] = useState('2026-09-15');
  const [timeSlot, setTimeSlot] = useState('14:00 - 15:00 EST');
  const [clientAddress, setClientAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchBespokeAppointments());
  }, [dispatch]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await bespokeService.bookAppointment({
        serviceType,
        appointmentDate,
        timeSlot,
        clientAddress: serviceType === 'IN_PERSON_SUITE_FITTING' ? clientAddress : undefined,
        notes,
      });
      dispatch(addToast({ type: 'success', message: 'Master tailor consultation confirmed!' }));
      dispatch(fetchBespokeAppointments());
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to schedule appointment' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          Master Tailor Concierge
        </span>
        <h1 className="text-3xl font-serif font-bold text-white mt-1">
          Private Fitting & Consultation Booking
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Connect directly with our master cutters in Savile Row, Milan, and New York.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-gentborder space-y-6">
          <h3 className="font-serif font-bold text-white text-base">Select Consultation Type</h3>

          <form onSubmit={handleBooking} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  serviceType === 'VIRTUAL_3D_MEASUREMENT'
                    ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                    : 'border-gentborder bg-[#12151b] hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="serviceType"
                  checked={serviceType === 'VIRTUAL_3D_MEASUREMENT'}
                  onChange={() => setServiceType('VIRTUAL_3D_MEASUREMENT')}
                  className="hidden"
                />
                <Video className="w-6 h-6 text-gold-400" />
                <h4 className="font-serif font-bold text-white text-xs">Virtual 3D Fitting</h4>
                <p className="text-[11px] text-gray-400">Encrypted HD WebRTC session with master cutter.</p>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  serviceType === 'IN_PERSON_SUITE_FITTING'
                    ? 'border-gold-400 bg-gold-400/10 ring-1 ring-gold-400'
                    : 'border-gentborder bg-[#12151b] hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="serviceType"
                  checked={serviceType === 'IN_PERSON_SUITE_FITTING'}
                  onChange={() => setServiceType('IN_PERSON_SUITE_FITTING')}
                  className="hidden"
                />
                <MapPin className="w-6 h-6 text-gold-400" />
                <h4 className="font-serif font-bold text-white text-xs">Flagship Private Lounge</h4>
                <p className="text-[11px] text-gray-400">In-person baste fitting at our Manhattan atelier.</p>
              </label>
            </div>

            {serviceType === 'IN_PERSON_SUITE_FITTING' && (
              <Input
                label="Preferred Fitting Address / Hotel Suite"
                placeholder="e.g. The Carlyle Hotel, Suite 1204, New York"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-300">Appointment Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full bg-[#12151b] border border-gentborder rounded-xl p-3 text-xs text-white mt-1 focus:outline-none focus:border-gold-400"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-300">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-[#12151b] border border-gentborder rounded-xl p-3 text-xs text-white mt-1 focus:outline-none focus:border-gold-400"
                >
                  <option value="10:00 - 11:00 EST">10:00 - 11:00 EST</option>
                  <option value="11:30 - 12:30 EST">11:30 - 12:30 EST</option>
                  <option value="14:00 - 15:00 EST">14:00 - 15:00 EST</option>
                  <option value="16:00 - 17:00 EST">16:00 - 17:00 EST</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">Special Fitting Notes / Garment Spec</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Preparing for charity gala tuxedo or double-breasted lounge suit..."
                className="w-full bg-[#12151b] border border-gentborder rounded-xl p-3 text-xs text-white mt-1 focus:outline-none focus:border-gold-400"
              />
            </div>

            <Button variant="gold" size="md" className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Confirming with Atelier...' : 'Reserve Fitting Consultation'}
            </Button>
          </form>
        </div>

        {/* Right: Scheduled Appointments */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-serif font-bold text-white text-base">Your Atelier Sessions</h3>
          {appointments.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 border border-gentborder text-center space-y-2">
              <Clock className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-xs text-gray-400">No appointments scheduled.</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="glass-panel rounded-2xl p-5 border border-gentborder space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-mono font-bold text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded">
                    {apt.serviceType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">{apt.status}</span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-white text-sm">{apt.tailorName}</h4>
                  <p className="text-xs text-gray-300 font-mono mt-1">
                    {apt.appointmentDate} at {apt.timeSlot}
                  </p>
                </div>

                {apt.meetingRoomUrl && (
                  <a
                    href={apt.meetingRoomUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-200 font-semibold pt-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Encrypted Video Fitting Room</span>
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
