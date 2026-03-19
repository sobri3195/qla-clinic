import { PlusCircle } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function TreatmentsPage() {
  const { treatments, treatmentPackages, patients, products } = useAppStore();

  return (
    <PageShell title="Treatment Management" description="Master treatment, package/program builder multi-session, bundling treatment + produk, expiry, dan progress program pasien." actions={<Button onClick={() => toast.success('Prototype package builder siap dilanjutkan ke backend / form dinamis.') }><PlusCircle className="h-4 w-4" /> New package</Button>}>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="text-lg font-semibold">Treatment catalog</h3>
          <div className="mt-4 overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Treatment</TH>
                  <TH>Category</TH>
                  <TH>Duration</TH>
                  <TH>Price</TH>
                  <TH>Handled by</TH>
                  <TH>Consumables</TH>
                </TR>
              </THead>
              <TBody>
                {treatments.map((treatment) => (
                  <TR key={treatment.id}>
                    <TD><p className="font-medium">{treatment.name}</p></TD>
                    <TD>{treatment.category}</TD>
                    <TD>{treatment.duration} mins</TD>
                    <TD>{formatCurrency(treatment.price)}</TD>
                    <TD><Badge variant={treatment.type === 'Doctor' ? 'gold' : treatment.type === 'Hybrid' ? 'pink' : 'green'}>{treatment.type}</Badge></TD>
                    <TD>{treatment.consumables.map((consumable) => `${products.find((item) => item.id === consumable.productId)?.name} x${consumable.qty}`).join(', ')}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </Card>

        <div className="space-y-4">
          {treatmentPackages.map((item) => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">{item.targetConcern}</p>
                </div>
                <Badge variant="gold">{item.sessionsIncluded} sessions</Badge>
              </div>
              <div className="mt-4 rounded-2xl bg-secondary p-4 text-sm text-muted">
                <p>Bundled treatment: {item.bundledTreatmentIds.map((id) => treatments.find((entry) => entry.id === id)?.name).join(', ')}</p>
                <p className="mt-2">Bundled produk: {item.bundledProductIds.map((id) => products.find((entry) => entry.id === id)?.name).join(', ')}</p>
                <p className="mt-2">Expiry paket: {item.expiryDays} hari • Harga {formatCurrency(item.price)}</p>
              </div>
              <div className="mt-4 space-y-3">
                {item.activePatients.map((program) => {
                  const patient = patients.find((entry) => entry.id === program.patientId);
                  return (
                    <div key={program.patientId} className="rounded-2xl border border-border p-4 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{patient?.name}</p>
                        <Badge variant={program.sessionsUsed >= program.totalSessions ? 'green' : 'pink'}>{program.sessionsUsed}/{program.totalSessions} sesi</Badge>
                      </div>
                      <p className="mt-2 text-muted">Next session {program.nextSessionDate} • Expiry {program.expiresAt}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
