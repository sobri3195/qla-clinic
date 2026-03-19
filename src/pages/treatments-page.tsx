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
  const treatments = useAppStore((state) => state.treatments);

  return (
    <PageShell title="Treatment Management" description="Master treatment premium aesthetic clinic, paket tindakan, harga, durasi, PIC dokter/therapist, dan hasil tindakan." actions={<Button onClick={() => toast.success('UI dummy: form treatment baru dapat dikembangkan ke backend nanti.')}><PlusCircle className="h-4 w-4" /> New treatment</Button>}>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Treatment</TH>
                <TH>Category</TH>
                <TH>Duration</TH>
                <TH>Price</TH>
                <TH>Handled by</TH>
                <TH>Popularity</TH>
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
                  <TD>{treatment.popularity}%</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
