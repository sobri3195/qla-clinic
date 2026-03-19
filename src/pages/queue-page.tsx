import { PhoneCall, Tv2 } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { toast } from 'sonner';

export function QueuePage() {
  const { queue, patients, appointments, checkInAppointment, advanceQueueStatus, currentUser } = useAppStore();
  const actor = currentUser?.name ?? 'System';
  const readyToCheckIn = appointments.filter((item) => ['confirmed', 'booked'].includes(item.status) && item.date === new Date().toISOString().slice(0, 10) && !queue.some((queueItem) => queueItem.appointmentId === item.id));

  return (
    <PageShell title="Check-In & Queue Management" description="Workflow nyata dari appointment ke queue, auto progression waiting → consultation → treatment → billing → done, ETA dinamis, TV queue, dan audit actor.">
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold">Check-in dari appointment</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {readyToCheckIn.length > 0 ? (
                readyToCheckIn.map((appointment) => {
                  const patient = patients.find((item) => item.id === appointment.patientId);
                  return (
                    <div key={appointment.id} className="rounded-2xl border border-border p-4">
                      <p className="font-medium">{patient?.name}</p>
                      <p className="mt-1 text-sm text-muted">{appointment.time} • {appointment.servicePoint}</p>
                      <Button className="mt-4 w-full" onClick={() => { checkInAppointment(appointment.id, actor); toast.success(`Pasien ${patient?.name} berhasil check-in ke queue.`); }}>
                        Check-in to queue
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted">Semua appointment hari ini sudah terhubung ke queue.</div>
              )}
            </div>
          </Card>

          <div className="grid gap-4 xl:grid-cols-2">
            {queue.map((item) => {
              const patient = patients.find((patient) => patient.id === item.patientId);
              const appointment = appointments.find((entry) => entry.id === item.appointmentId);
              return (
                <Card key={item.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted">Queue number</p>
                      <h3 className="mt-2 text-3xl font-semibold">{item.queueNumber}</h3>
                    </div>
                    <Badge variant={item.status === 'done' ? 'green' : item.status === 'billing' ? 'gold' : 'pink'}>{item.status}</Badge>
                  </div>
                  <div className="mt-5 rounded-[24px] bg-secondary p-4">
                    <p className="font-medium">{patient?.name}</p>
                    <p className="mt-1 text-sm text-muted">Service point: {item.servicePoint}</p>
                    <p className="mt-1 text-sm text-muted">ETA {item.etaMinutes} mins • Appointment {appointment?.time}</p>
                    <p className="mt-3 text-xs text-muted">Last moved by {item.updatedBy} • {new Date(item.updatedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <Button className="flex-1" onClick={() => { advanceQueueStatus(item.id, actor); toast.success(`Status antrian ${item.queueNumber} diperbarui.`); }}>
                      <PhoneCall className="h-4 w-4" /> Next stage
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3">
              <Tv2 className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Front desk / TV queue screen</h3>
                <p className="mt-1 text-sm text-muted">Display realtime untuk pasien yang sedang dipanggil dan antrean berikutnya.</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {queue
                .sort((a, b) => a.etaMinutes - b.etaMinutes)
                .map((item) => {
                  const patient = patients.find((entry) => entry.id === item.patientId);
                  return (
                    <div key={item.id} className="rounded-2xl bg-secondary p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{item.queueNumber}</p>
                        <Badge variant={item.status === 'waiting' ? 'gold' : 'green'}>{item.status}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted">{patient?.name} • Est. {item.etaMinutes} menit</p>
                    </div>
                  );
                })}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">Operational bottleneck insight</h3>
            <div className="mt-4 space-y-3">
              {['waiting', 'consultation', 'treatment', 'billing', 'done'].map((status) => {
                const count = queue.filter((item) => item.status === status).length;
                return (
                  <div key={status} className="flex items-center justify-between rounded-2xl border border-border p-4 text-sm">
                    <span className="capitalize">{status}</span>
                    <Badge variant={count > 1 ? 'gold' : count > 0 ? 'green' : 'slate'}>{count} patient</Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
