import { Activity, CalendarDays, CreditCard, Users, Sparkles, BellRing, ArrowUpRight } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/shared/page-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import { RevenueChart, FunnelChartCard, StaffPerformanceChart } from '@/components/charts/revenue-chart';
import { PatientJourney } from '@/components/shared/patient-journey';
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
  const averageRoutineCompliance = Math.round(patients.reduce((sum, patient) => sum + patient.routineCompliance, 0) / Math.max(patients.length, 1));
  const concernDistribution = patients.reduce<Record<string, number>>((acc, patient) => {
    patient.beautyGoals.forEach((goal) => {
      acc[goal] = (acc[goal] ?? 0) + 1;
    });
    return acc;
  }, {});
  const topBeautyGoals = Object.entries(concernDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  const consentedGalleryCount = patients.flatMap((patient) => patient.beforeAfter).filter((entry) => entry.consentUsage).length;

  return (
    <PageShell title="Dashboard" description="Ringkasan operasional harian QLA Clinic.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Patients today" value={`${patients.length}`} hint="Profil aktif dengan loyalty & referral" icon={Users} />
        <StatCard title="Appointments today" value={`${appointments.filter((item) => item.date === new Date().toISOString().slice(0, 10)).length}`} hint={`${waitlistCount} waiting list dipantau`} icon={CalendarDays} />
        <StatCard title="Active queue" value={`${queue.length}`} hint="Status antrean berjalan realtime" icon={Activity} />
        <StatCard title="Daily revenue" value={formatCurrency(todayRevenue)} hint="Stok dan loyalty sinkron" icon={CreditCard} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <PatientJourney />
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Quick pulse</CardTitle>
              <CardDescription>Snapshot singkat kondisi hari ini.</CardDescription>
            </div>
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {[
              ['Reminder siap kirim', `${reminders.length} campaign / reminder aktif`],
              ['Audit trail', `${auditLogs.length} perubahan data tercatat`],
              ['Treatment favorit', topTreatment.name],
              ['Package highlight', treatmentPackages[0]?.name ?? '-'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-[24px] border border-border p-4">
                <p className="font-medium">{title}</p>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue trend</CardTitle>
              <CardDescription>Statistik pendapatan mingguan.</CardDescription>
            </div>
            <Badge variant="gold">Weekly</Badge>
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

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Beauty goals tracker</CardTitle>
              <CardDescription>Target pasien yang paling sering muncul.</CardDescription>
            </div>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-3">
            {topBeautyGoals.map(([goal, count]) => (
              <div key={goal} className="rounded-[24px] border border-border p-5">
                <p className="text-sm text-muted">Beauty goal</p>
                <h3 className="mt-2 text-lg font-semibold">{goal}</h3>
                <p className="mt-2 text-sm text-muted">{count} pasien aktif.</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Beauty care adherence</CardTitle>
              <CardDescription>Homecare dan aset before-after.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-[24px] bg-secondary p-5">
              <p className="text-sm text-muted">Average routine compliance</p>
              <h3 className="mt-2 text-3xl font-semibold">{averageRoutineCompliance}%</h3>
              <p className="mt-2 text-sm text-muted">Kepatuhan homecare seluruh pasien aktif.</p>
            </div>
            <div className="rounded-[24px] border border-border p-5">
              <p className="text-sm text-muted">Consented before-after gallery</p>
              <h3 className="mt-2 text-3xl font-semibold">{consentedGalleryCount} assets</h3>
              <p className="mt-2 text-sm text-muted">Siap dipakai untuk edukasi internal.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top treatment & package</CardTitle>
              <CardDescription>Treatment terlaris dan performa staf.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-[24px] bg-secondary p-5">
              <p className="text-sm text-muted">Most booked</p>
              <h3 className="mt-2 text-2xl font-semibold">{topTreatment.name}</h3>
              <p className="mt-2 text-sm text-muted">{topTreatment.category} • {formatCurrency(topTreatment.price)} • popularity {topTreatment.popularity}%</p>
              <p className="mt-2 text-sm text-muted">Package: {treatmentPackages[0]?.name}</p>
            </div>
            <div className="space-y-3">
              {staff.slice(0, 4).map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{member.name}</p>
                    <p className="truncate text-sm text-muted">{member.specialty}</p>
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
              <CardDescription>Skor kepuasan dan handling.</CardDescription>
            </div>
          </CardHeader>
          <StaffPerformanceChart />
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Notifications & audit</CardTitle>
              <CardDescription>Reminder dan jejak perubahan data.</CardDescription>
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
