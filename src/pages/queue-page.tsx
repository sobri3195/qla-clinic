import { PhoneCall } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/store/app-store';
import { toast } from 'sonner';

const nextStatusMap = {
  waiting: 'screening',
  screening: 'consultation',
  consultation: 'treatment',
  treatment: 'billing',
  billing: 'done',
  done: 'done',
} as const;

export function QueuePage() {
  const { queue, patients, updateQueueStatus } = useAppStore();

  return (
    <PageShell title="Check-In & Queue Management" description="Monitor pasien datang, screening, konsultasi, tindakan, pembayaran, hingga selesai.">
      <div className="grid gap-4 xl:grid-cols-3">
        {queue.map((item) => {
          const patient = patients.find((patient) => patient.id === item.patientId);
          const nextStatus = nextStatusMap[item.status];
          return (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted">Queue number</p>
                  <h3 className="mt-2 text-3xl font-semibold">{item.queueNumber}</h3>
                </div>
                <Badge variant={item.status === 'done' ? 'green' : 'pink'}>{item.status}</Badge>
              </div>
              <div className="mt-5 rounded-[24px] bg-secondary p-4">
                <p className="font-medium">{patient?.name}</p>
                <p className="mt-1 text-sm text-muted">Service point: {item.servicePoint}</p>
                <p className="mt-1 text-sm text-muted">ETA {item.etaMinutes} mins</p>
              </div>
              <div className="mt-5 flex gap-3">
                <Button className="flex-1" onClick={() => { updateQueueStatus(item.id, nextStatus); toast.success(`Status antrian ${item.queueNumber} diperbarui ke ${nextStatus}`); }}>
                  <PhoneCall className="h-4 w-4" /> Panggil pasien
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
