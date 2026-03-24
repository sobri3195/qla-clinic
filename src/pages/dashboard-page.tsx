import { Activity, CalendarDays, CreditCard, Users, Sparkles, BellRing, ArrowUpRight, ShieldCheck, WalletCards } from 'lucide-react';
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
    <PageShell title="Executive Dashboard" description="Ringkasan operasional klinik estetika dengan fokus performa, pengalaman pasien, dan kualitas layanan.">
      <Card className="overflow-hidden border-[#ecdee3] bg-[linear-gradient(120deg,#ffffff_0%,#fff7fa_58%,#fef8f0_100%)]">
        <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ebdde2] bg-white/80 px-3 py-1 text-xs font-medium text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Workspace Info
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Clinic operation summary for today</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Semua modul utama tetap aktif dengan data real-time untuk tim front office, dokter, hingga kasir.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Open reminders</p>
                <p className="mt-2 text-2xl font-semibold">{reminders.length}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Audit records</p>
                <p className="mt-2 text-2xl font-semibold">{auditLogs.length}</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/85 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Follow-up due</p>
                <p className="mt-2 text-2xl font-semibold">{followUps.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-[#ecdee4] bg-white/90 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Quick pulse</p>
            <div className="mt-4 space-y-2.5">
              {[
                ['Reminder', `${reminders.length} aktif`],
                ['Audit trail', `${auditLogs.length} log`],
                ['Treatment favorit', topTreatment.name],
                ['Package highlight', treatmentPackages[0]?.name ?? '-'],
              ].map(([title, text]) => (
                <div key={title} className="flex items-center justify-between rounded-2xl border border-[#efe4e8] bg-[#fffafb] px-4 py-3">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Patients today" value={`${patients.length}`} hint="Pasien aktif" icon={Users} />
        <StatCard title="Appointments today" value={`${appointments.filter((item) => item.date === new Date().toISOString().slice(0, 10)).length}`} hint={`${waitlistCount} waiting list`} icon={CalendarDays} />
        <StatCard title="Active queue" value={`${queue.length}`} hint="Antrean berjalan" icon={Activity} />
        <StatCard title="Daily revenue" value={formatCurrency(todayRevenue)} hint="Pendapatan hari ini" icon={CreditCard} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <PatientJourney />
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Care adherence</CardTitle>
              <CardDescription>Routine & content approval.</CardDescription>
            </div>
            <WalletCards className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="space-y-3">
            <div className="rounded-3xl border border-[#efdee5] bg-[#fff7fa] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Average routine compliance</p>
              <h3 className="mt-2 text-3xl font-semibold">{averageRoutineCompliance}%</h3>
              <p className="mt-2 text-sm text-muted">Kepatuhan penggunaan regimen homecare pasien.</p>
            </div>
            <div className="rounded-3xl border border-[#efe5e9] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Before-after approved</p>
              <h3 className="mt-2 text-3xl font-semibold">{consentedGalleryCount} assets</h3>
              <p className="mt-2 text-sm text-muted">Konten dengan izin penggunaan marketing sudah tervalidasi.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue trend</CardTitle>
              <CardDescription>Pendapatan mingguan.</CardDescription>
            </div>
            <Badge variant="gold">Weekly</Badge>
          </CardHeader>
          <RevenueChart />
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Patient flow funnel</CardTitle>
              <CardDescription>Alur pasien.</CardDescription>
            </div>
            <ArrowUpRight className="h-5 w-5 text-primary" />
          </CardHeader>
          <FunnelChartCard />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Beauty goals tracker</CardTitle>
              <CardDescription>Target utama pasien.</CardDescription>
            </div>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-3">
            {topBeautyGoals.map(([goal, count]) => (
              <div key={goal} className="rounded-[24px] border border-[#efe4e8] bg-[#fffafb] p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Beauty goal</p>
                <h3 className="mt-2 text-lg font-semibold">{goal}</h3>
                <p className="mt-2 text-sm text-muted">{count} pasien</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Quick pulse</CardTitle>
              <CardDescription>Kondisi modul inti.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-2.5">
            {[
              ['Patient active', `${patients.length} pasien`],
              ['Antrian berjalan', `${queue.length} sesi`],
              ['Reminder automation', `${reminders.filter((item) => item.status === 'Scheduled').length} scheduled`],
              ['Revenue status', formatCurrency(todayRevenue)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-[#efe4e8] px-4 py-3">
                <p className="text-sm text-muted">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top treatment & package</CardTitle>
              <CardDescription>Treatment terlaris.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#efdee5] bg-[#fff6f9] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Most booked</p>
              <h3 className="mt-2 text-2xl font-semibold">{topTreatment.name}</h3>
              <p className="mt-2 text-sm text-muted">{topTreatment.category} • {formatCurrency(topTreatment.price)} • {topTreatment.popularity}%</p>
              <p className="mt-2 text-sm text-muted">Package: {treatmentPackages[0]?.name}</p>
            </div>
            <div className="space-y-3">
              {staff.slice(0, 4).map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#efe5e9] p-4">
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
              <CardDescription>Skor staf.</CardDescription>
            </div>
          </CardHeader>
          <StaffPerformanceChart />
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Notifications & audit</CardTitle>
              <CardDescription>Reminder & log.</CardDescription>
            </div>
            <BellRing className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="space-y-4">
            {reminders.slice(0, 2).map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#efdee5] bg-[#fff7fa] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{item.type}</p>
                  <Badge variant={item.status === 'Sent' ? 'green' : 'pink'}>{item.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{item.channel} • {item.scheduledFor}</p>
              </div>
            ))}
            {auditLogs.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#efe5e9] p-4">
                <p className="font-medium">{item.action}</p>
                <p className="mt-2 text-sm text-muted">{item.actor} • {item.module}</p>
              </div>
            ))}
            {followUps.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#efe5e9] p-4">
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
