import { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { CalendarPlus2 } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useAppStore } from '@/store/app-store';
import { toast } from 'sonner';

export function AppointmentsPage() {
  const { appointments, patients, staff, treatments, addAppointment } = useAppStore();
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => appointments.filter((item) => (doctorFilter === 'all' || item.doctorId === doctorFilter) && (statusFilter === 'all' || item.status === statusFilter)), [appointments, doctorFilter, statusFilter]);

  const createBooking = () => {
    const patient = patients[0];
    const doctor = staff.find((item) => item.role === 'Dokter / Aesthetic Doctor');
    const therapist = staff.find((item) => item.role === 'Beautician / Therapist');
    const treatment = treatments[0];
    if (!patient || !doctor || !therapist || !treatment) return;
    addAppointment({
      id: `apt-${crypto.randomUUID().slice(0, 8)}`,
      patientId: patient.id,
      doctorId: doctor.id,
      therapistId: therapist.id,
      treatmentId: treatment.id,
      date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
      time: '11:00',
      status: 'booked',
      notes: 'Auto-generated booking for frontend demo.',
    });
    toast.success('Booking baru berhasil dibuat');
  };

  return (
    <PageShell title="Appointment & Booking" description="Kalender, booking harian/mingguan, filter dokter, therapist, treatment, dan status pasien.">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="min-w-56 flex-1">
              <label className="mb-2 block text-sm font-medium">Filter dokter</label>
              <Select value={doctorFilter} onChange={setDoctorFilter} options={[{ value: 'all', label: 'Semua dokter' }, ...staff.filter((item) => item.role === 'Dokter / Aesthetic Doctor').map((item) => ({ value: item.id, label: item.name }))]} />
            </div>
            <div className="min-w-48 flex-1">
              <label className="mb-2 block text-sm font-medium">Status booking</label>
              <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'all', label: 'Semua status' }, ...['booked','confirmed','arrived','in-treatment','completed','cancelled'].map((item) => ({ value: item, label: item }))]} />
            </div>
            <div className="flex items-end">
              <Button onClick={createBooking}><CalendarPlus2 className="h-4 w-4" /> New booking</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Tanggal</TH>
                  <TH>Pasien</TH>
                  <TH>Dokter</TH>
                  <TH>Treatment</TH>
                  <TH>Status</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((item) => {
                  const patient = patients.find((patient) => patient.id === item.patientId);
                  const doctor = staff.find((member) => member.id === item.doctorId);
                  const treatment = treatments.find((catalog) => catalog.id === item.treatmentId);
                  return (
                    <TR key={item.id}>
                      <TD>{item.date}<p className="mt-1 text-xs text-muted">{item.time}</p></TD>
                      <TD>{patient?.name}</TD>
                      <TD>{doctor?.name}</TD>
                      <TD>{treatment?.name}</TD>
                      <TD><Badge variant={item.status === 'completed' ? 'green' : item.status === 'cancelled' ? 'red' : 'pink'}>{item.status}</Badge></TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Weekly booking preview</h3>
          <div className="mt-5 space-y-3">
            {Array.from({ length: 7 }).map((_, index) => {
              const day = format(addDays(new Date(), index), 'yyyy-MM-dd');
              const count = appointments.filter((item) => item.date === day).length;
              return (
                <div key={day} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{day}</p>
                    <Badge variant={count > 0 ? 'green' : 'slate'}>{count} booking</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">Kalender dummy untuk Vercel-ready frontend demo.</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
