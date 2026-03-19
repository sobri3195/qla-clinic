import { Activity, CalendarDays, CreditCard, Users, Sparkles, BellRing } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/shared/page-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import { RevenueChart, FunnelChartCard, StaffPerformanceChart } from '@/components/charts/revenue-chart';
import { useAppStore } from '@/store/app-store';
import { formatCurrency, calculateTransactionTotal } from '@/lib/utils';

export function DashboardPage() {
  const { patients, appointments, queue, transactions, staff, followUps, treatments, reminders, auditLogs, treatmentPackages } = useAppStore();
  const todayRevenue = transactions
    .filter((transaction) => transaction.date === new Date().toISOString().slice(0, 10))
    .reduce((sum, transaction) => {
      const subtotal = transaction.items.reduce((acc, item) => acc + item.qty * item.price, 0);
      return sum + calculateTransactionTotal(subtotal, transaction.discount, transaction.tax);
    }, 0);

  const topTreatment = [...treatments].sort((a, b) => b.popularity - a.popularity)[0];
  const waitlistCount = appointments.filter((item) => item.waitingList).length;

  return (
    <PageShell title="Dashboard" description="Ringkasan operasional QLA Clinic hari ini: booking cerdas, queue workflow, loyalty, reminder, inventory, analytics, dan audit trail.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Patients today" value={`${patients.length}`} hint="Active profiles with loyalty & referral" icon={Users} />
        <StatCard title="Appointments today" value={`${appointments.filter((item) => item.date === new Date().toISOString().slice(0, 10)).length}`} hint={`${waitlistCount} waiting list monitored`} icon={CalendarDays} />
        <StatCard title="Active queue" value={`${queue.length}`} hint="Status auto-progression enabled" icon={Activity} />
        <StatCard title="Daily revenue" value={formatCurrency(todayRevenue)} hint="Stock + loyalty synced to cashier" icon={CreditCard} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue trend</CardTitle>
              <CardDescription>Statistik dummy pendapatan klinik sepanjang minggu ini.</CardDescription>
            </div>
            <Badge variant="gold">Premium insights</Badge>
          </CardHeader>
          <RevenueChart />
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Patient flow funnel</CardTitle>
              <CardDescription>Alur pasien dari check-in sampai pembayaran.</CardDescription>
            </div>
          </CardHeader>
          <FunnelChartCard />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top treatment & package</CardTitle>
              <CardDescription>Treatment terlaris, bundle program, dan performa staf yang bertugas.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-[24px] bg-secondary p-5">
              <p className="text-sm text-muted">Most booked</p>
              <h3 className="mt-2 text-2xl font-semibold">{topTreatment.name}</h3>
              <p className="mt-2 text-sm text-muted">{topTreatment.category} • {formatCurrency(topTreatment.price)} • popularity {topTreatment.popularity}%</p>
              <p className="mt-2 text-sm text-muted">Package highlight: {treatmentPackages[0]?.name}</p>
            </div>
            <div className="space-y-3">
              {staff.slice(0, 4).map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted">{member.specialty}</p>
                  </div>
                  <Badge variant="green">{member.rating} / 5</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Staff performance</CardTitle>
              <CardDescription>Skor kepuasan dan handling dummy per tenaga medis.</CardDescription>
            </div>
          </CardHeader>
          <StaffPerformanceChart />
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Notifications & audit</CardTitle>
              <CardDescription>Reminder omnichannel dan jejak perubahan data.</CardDescription>
            </div>
            <BellRing className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="space-y-4">
            {reminders.slice(0, 2).map((item) => (
              <div key={item.id} className="rounded-2xl bg-secondary p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{item.type}</p>
                  <Badge variant={item.status === 'Sent' ? 'green' : 'pink'}>{item.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{item.channel} • {item.scheduledFor}</p>
              </div>
            ))}
            {auditLogs.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-2xl border border-border p-4">
                <p className="font-medium">{item.action}</p>
                <p className="mt-2 text-sm text-muted">{item.actor} • {item.module}</p>
              </div>
            ))}
            {followUps.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border p-4">
                <p className="font-medium">Follow-up {item.dueDate}</p>
                <p className="mt-2 text-sm text-muted">{item.progress}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
