import { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { AlertTriangle, CalendarPlus2, Clock3 } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useAppStore } from '@/store/app-store';
import { addMinutesToTime, appointmentsOverlap, isWithinOperatingHours } from '@/lib/utils';
import { toast } from 'sonner';

export function AppointmentsPage() {
  const { appointments, patients, staff, treatments, settings, addAppointment } = useAppStore();
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patientId, setPatientId] = useState(patients[0]?.id ?? '');
  const [doctorId, setDoctorId] = useState(staff.find((item) => item.role === 'Dokter / Aesthetic Doctor')?.id ?? '');
  const [therapistId, setTherapistId] = useState(staff.find((item) => item.role === 'Beautician / Therapist')?.id ?? '');
  const [treatmentId, setTreatmentId] = useState(treatments[0]?.id ?? '');
  const [servicePointId, setServicePointId] = useState(settings.servicePoints[0]?.id ?? '');
  const [date, setDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [time, setTime] = useState('11:00');

  const filtered = useMemo(
    () => appointments.filter((item) => (doctorFilter === 'all' || item.doctorId === doctorFilter) && (statusFilter === 'all' || item.status === statusFilter)),
    [appointments, doctorFilter, statusFilter]
  );

  const selectedTreatment = treatments.find((item) => item.id === treatmentId);
  const selectedServicePoint = settings.servicePoints.find((item) => item.id === servicePointId);
  const draftDuration = selectedTreatment?.duration ?? 0;

  const overlappingAppointments = useMemo(() => {
    if (!selectedTreatment) return [];
    return appointments.filter((appointment) => {
      const sharesProvider = appointment.doctorId === doctorId || appointment.therapistId === therapistId;
      const sharesRoom = appointment.roomId === servicePointId;
      return (sharesProvider || sharesRoom) && appointmentsOverlap(appointment, { date, time, duration: selectedTreatment.duration });
    });
  }, [appointments, date, doctorId, therapistId, selectedTreatment, servicePointId, time]);

  const roomLoad = overlappingAppointments.filter((item) => item.roomId === servicePointId).length;
  const capacityExceeded = roomLoad >= (selectedServicePoint?.capacity ?? 1);
  const providerConflict = overlappingAppointments.some((item) => item.doctorId === doctorId || item.therapistId === therapistId);
  const outsideHours = !isWithinOperatingHours(time, draftDuration, settings.openingHours);
  const shouldWaitlist = outsideHours || capacityExceeded || providerConflict;

  const validationItems = [
    { label: 'Jam operasional klinik', ok: !outsideHours, detail: `${time} - ${addMinutesToTime(time, draftDuration)} vs ${settings.openingHours}` },
    { label: 'Bentrok dokter / therapist', ok: !providerConflict, detail: providerConflict ? `${overlappingAppointments.length} slot bentrok terdeteksi` : 'Tidak ada bentrok provider' },
    { label: 'Kapasitas ruangan / service point', ok: !capacityExceeded, detail: `${roomLoad}/${selectedServicePoint?.capacity ?? 0} slot terpakai` },
    { label: 'Auto-block durasi treatment', ok: Boolean(selectedTreatment), detail: `${draftDuration} menit akan memblok slot sampai ${addMinutesToTime(time, draftDuration)}` },
  ];

  const createBooking = () => {
    if (!selectedTreatment || !selectedServicePoint) return;
    addAppointment({
      id: `apt-${crypto.randomUUID().slice(0, 8)}`,
      patientId,
      doctorId,
      therapistId,
      treatmentId,
      date,
      time,
      duration: selectedTreatment.duration,
      roomId: selectedServicePoint.id,
      servicePoint: selectedServicePoint.name,
      status: shouldWaitlist ? 'waiting-list' : 'booked',
      overbookingRisk: outsideHours || capacityExceeded ? 'overbooked' : providerConflict ? 'warning' : 'safe',
      waitingList: shouldWaitlist,
      notes: shouldWaitlist ? 'Masuk waiting list / overbooking monitor.' : 'Booking tervalidasi otomatis oleh scheduling engine.',
    });
    toast.success(shouldWaitlist ? 'Slot bentrok: pasien masuk waiting list.' : 'Booking baru berhasil dibuat tanpa konflik.');
  };

  return (
    <PageShell title="Appointment & Booking" description="Smart scheduling dengan validasi bentrok dokter/therapist, jam operasional, durasi treatment, kapasitas ruangan, dan waiting list.">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Pasien</label>
              <Select value={patientId} onChange={setPatientId} options={patients.map((item) => ({ value: item.id, label: item.name }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Dokter</label>
              <Select value={doctorId} onChange={setDoctorId} options={staff.filter((item) => item.role === 'Dokter / Aesthetic Doctor').map((item) => ({ value: item.id, label: item.name }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Therapist</label>
              <Select value={therapistId} onChange={setTherapistId} options={staff.filter((item) => item.role === 'Beautician / Therapist').map((item) => ({ value: item.id, label: item.name }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Treatment</label>
              <Select value={treatmentId} onChange={setTreatmentId} options={treatments.map((item) => ({ value: item.id, label: `${item.name} • ${item.duration}m` }))} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tanggal</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Jam mulai</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Service point</label>
              <Select value={servicePointId} onChange={setServicePointId} options={settings.servicePoints.map((item) => ({ value: item.id, label: `${item.name} • cap ${item.capacity}` }))} />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={createBooking}><CalendarPlus2 className="h-4 w-4" /> {shouldWaitlist ? 'Add to waiting list' : 'Create validated booking'}</Button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {validationItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{item.label}</p>
                  <Badge variant={item.ok ? 'green' : 'red'}>{item.ok ? 'OK' : 'Issue'}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Tanggal</TH>
                  <TH>Pasien</TH>
                  <TH>Dokter</TH>
                  <TH>Treatment</TH>
                  <TH>Status</TH>
                  <TH>Overbooking</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((item) => {
                  const patient = patients.find((patient) => patient.id === item.patientId);
                  const doctor = staff.find((member) => member.id === item.doctorId);
                  const treatment = treatments.find((catalog) => catalog.id === item.treatmentId);
                  return (
                    <TR key={item.id}>
                      <TD>{item.date}<p className="mt-1 text-xs text-muted">{item.time} - {addMinutesToTime(item.time, item.duration)}</p></TD>
                      <TD>{patient?.name}</TD>
                      <TD>{doctor?.name}</TD>
                      <TD>{treatment?.name}<p className="mt-1 text-xs text-muted">{item.servicePoint}</p></TD>
                      <TD><Badge variant={item.status === 'completed' ? 'green' : item.status === 'cancelled' ? 'red' : item.status === 'waiting-list' ? 'gold' : 'pink'}>{item.status}</Badge></TD>
                      <TD><Badge variant={item.overbookingRisk === 'safe' ? 'green' : item.overbookingRisk === 'warning' ? 'gold' : 'red'}>{item.overbookingRisk}</Badge></TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">Conflict radar</h3>
                <p className="mt-1 text-sm text-muted">Deteksi dini untuk FO sebelum double booking terjadi.</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 space-y-3">
              {overlappingAppointments.length > 0 ? (
                overlappingAppointments.map((item) => {
                  const patient = patients.find((entry) => entry.id === item.patientId);
                  return (
                    <div key={item.id} className="rounded-2xl bg-secondary p-4">
                      <p className="font-medium">{patient?.name}</p>
                      <p className="mt-1 text-sm text-muted">{item.date} • {item.time} • {item.servicePoint}</p>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted">Tidak ada bentrok pada draft slot ini.</div>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Weekly capacity preview</h3>
            <div className="mt-5 space-y-3">
              {Array.from({ length: 7 }).map((_, index) => {
                const day = format(addDays(new Date(), index), 'yyyy-MM-dd');
                const dayBookings = appointments.filter((item) => item.date === day && !item.waitingList);
                const dayWaitlist = appointments.filter((item) => item.date === day && item.waitingList);
                return (
                  <div key={day} className="rounded-2xl border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{day}</p>
                      <div className="flex gap-2">
                        <Badge variant="green">{dayBookings.length} active</Badge>
                        <Badge variant={dayWaitlist.length > 0 ? 'gold' : 'slate'}>{dayWaitlist.length} waitlist</Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted">Utilisasi service point dan overbooking dimonitor otomatis untuk tiap hari.</p>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Slot blocked by treatment duration</h3>
                <p className="mt-1 text-sm text-muted">Treatment terpilih akan memblok slot hingga selesai agar tidak terjadi idle overlap.</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-secondary p-4 text-sm text-muted">
              {selectedTreatment?.name} memblok {draftDuration} menit, dari {time} sampai {addMinutesToTime(time, draftDuration)} di {selectedServicePoint?.name}.
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
