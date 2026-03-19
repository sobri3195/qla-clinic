import { Download } from 'lucide-react';
import { PageShell } from '@/components/shared/page-shell';
import { AccessGuard } from '@/components/shared/access-guard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/table';
import { RevenueChart, StaffPerformanceChart } from '@/components/charts/revenue-chart';
import { useAppStore } from '@/store/app-store';
import { calculateTransactionTotal, downloadCsv, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export function ReportsPage() {
  const { patients, appointments, transactions, treatments, staff } = useAppStore();
  const revenue = transactions.reduce((sum, transaction) => {
    const subtotal = transaction.items.reduce((sub, item) => sub + item.qty * item.price, 0);
    return sum + calculateTransactionTotal(subtotal, transaction.discount, transaction.tax);
  }, 0);
  const completedAppointments = appointments.filter((item) => item.status === 'completed').length;
  const noShowRate = appointments.length === 0 ? 0 : Math.round((appointments.filter((item) => item.status === 'cancelled' || item.status === 'waiting-list').length / appointments.length) * 100);
  const conversionRate = appointments.length === 0 ? 0 : Math.round((transactions.filter((item) => item.items.some((entry) => entry.type === 'treatment')).length / appointments.length) * 100);
  const staffUtilization = Math.round(staff.reduce((sum, item) => sum + item.patientsHandled, 0) / staff.length);
  const repeatVisitRate = Math.round((patients.filter((item) => item.treatmentHistory.length >= 2).length / patients.length) * 100);
  const profitability = treatments
    .map((treatment) => ({
      name: treatment.name,
      profitIndex: treatment.price - treatment.consumables.length * 85000,
    }))
    .sort((a, b) => b.profitIndex - a.profitIndex)[0];
  const bestSellingProduct = transactions
    .flatMap((transaction) => transaction.items.filter((item) => item.type === 'product'))
    .reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.label]: (acc[item.label] ?? 0) + item.qty }), {});
  const bestProductName = Object.entries(bestSellingProduct).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '-';

  const exportCsv = () => {
    downloadCsv('qla-clinic-analytics.csv', [
      ['Metric', 'Value'],
      ['Revenue', String(revenue)],
      ['No-show rate', `${noShowRate}%`],
      ['Consultation to treatment conversion', `${conversionRate}%`],
      ['Staff utilization', `${staffUtilization}`],
      ['Repeat visit', `${repeatVisitRate}%`],
      ['Top profitability treatment', profitability?.name ?? '-'],
      ['Best selling product', bestProductName],
    ]);
    toast.success('Export CSV analytics berhasil diunduh.');
  };

  return (
    <AccessGuard module="reports">
      <PageShell title="Reports & Analytics" description="Analytics operasional yang lebih tajam: no-show, conversion, profitability, utilization, retention, best-selling product, dan export CSV nyata." actions={<Button variant="secondary" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button>}>
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
              <TR><TD>Revenue</TD><TD>{formatCurrency(revenue)}</TD><TD><Badge variant="green">Clinic revenue tracked</Badge></TD></TR>
              <TR><TD>No-show / waitlist rate</TD><TD>{noShowRate}%</TD><TD><Badge variant={noShowRate > 20 ? 'gold' : 'green'}>Attendance control</Badge></TD></TR>
              <TR><TD>Consultation → treatment conversion</TD><TD>{conversionRate}%</TD><TD><Badge variant="pink">Upsell & plan adherence</Badge></TD></TR>
              <TR><TD>Treatment profitability</TD><TD>{profitability?.name}</TD><TD><Badge variant="gold">Highest margin</Badge></TD></TR>
              <TR><TD>Staff utilization</TD><TD>{staffUtilization} visits/staff</TD><TD><Badge variant="green">Workload visibility</Badge></TD></TR>
              <TR><TD>Retention / repeat visit</TD><TD>{repeatVisitRate}%</TD><TD><Badge variant="pink">Repeat booking strength</Badge></TD></TR>
              <TR><TD>Best-selling product by segment</TD><TD>{bestProductName}</TD><TD><Badge variant="green">Retail winner</Badge></TD></TR>
              <TR><TD>Completed appointments</TD><TD>{completedAppointments}</TD><TD><Badge variant="slate">Journey completion</Badge></TD></TR>
            </TBody>
          </Table>
        </div>
      </Card>
    </PageShell>
    </AccessGuard>
  );
}
