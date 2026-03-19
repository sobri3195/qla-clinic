import { Download } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { RevenueChart, StaffPerformanceChart } from '@/components/charts/revenue-chart';
import { useAppStore } from '@/store/app-store';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function ReportsPage() {
  const { patients, appointments, transactions, treatments, staff } = useAppStore();
  const revenue = transactions.reduce((sum, transaction) => sum + transaction.items.reduce((sub, item) => sub + item.qty * item.price, 0), 0);

  return (
    <PageShell title="Reports & Analytics" description="Laporan pasien harian, appointment, revenue, treatment terlaris, produk terjual, performa staff, serta export UI dummy." actions={<Button variant="secondary" onClick={() => toast.success('Export UI dummy berhasil disimulasikan.') }><Download className="h-4 w-4" /> Export UI dummy</Button>}>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Revenue overview</h3>
          <div className="mt-4"><RevenueChart /></div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Staff performance</h3>
          <div className="mt-4"><StaffPerformanceChart /></div>
        </Card>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TR>
                <TH>Metric</TH>
                <TH>Value</TH>
                <TH>Insight</TH>
              </TR>
            </THead>
            <TBody>
              <TR><TD>Pasien harian</TD><TD>{patients.length}</TD><TD><Badge variant="green">Active</Badge></TD></TR>
              <TR><TD>Appointment</TD><TD>{appointments.length}</TD><TD><Badge variant="pink">Booking flow stable</Badge></TD></TR>
              <TR><TD>Pendapatan</TD><TD>{formatCurrency(revenue)}</TD><TD><Badge variant="gold">High-value aesthetic mix</Badge></TD></TR>
              <TR><TD>Treatment terlaris</TD><TD>{[...treatments].sort((a,b)=>b.popularity-a.popularity)[0]?.name}</TD><TD><Badge variant="pink">Most booked</Badge></TD></TR>
              <TR><TD>Performa staff</TD><TD>{staff[0]?.name}</TD><TD><Badge variant="green">Top rated</Badge></TD></TR>
            </TBody>
          </Table>
        </div>
      </Card>
    </PageShell>
  );
}
