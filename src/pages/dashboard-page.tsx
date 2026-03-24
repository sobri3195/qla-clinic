import {
  Activity,
  CalendarDays,
  CreditCard,
  Users,
  Sparkles,
  BellRing,
  ArrowUpRight,
  ShieldCheck,
  WalletCards,
  Target,
  TrendingUp,
  Timer,
} from 'lucide-react';
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

  const today = new Date().toISOString().slice(0, 10);
  const todayRevenue = transactions
    .filter((transaction) => transaction.date === today)
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
    <PageShell
      title="Executive Dashboard"
      description="Ringkasan operasional klinik estetika yang terstruktur untuk memantau performa, kualitas layanan, dan pengalaman pasien harian."
    >
      <Card className="overflow-hidden border-[#ebdfe4] bg-[linear-gradient(135deg,#ffffff_0%,#fff8fb_58%,#fef8f0_100%)]">
        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eddde3] bg-white px-3 py-1 text-xs font-medium text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Workspace / Clinic Summary
            </div>
            <h2 className="mt-4 text-[1.8rem] font-semibold tracking-tight text-foreground">Daily operation overview that is calm, premium, and instantly scannable.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Semua modul utama aktif untuk alur front office, dokter, beautician, dan kasir dengan struktur dashboard yang konsisten.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Open reminders', value: reminders.length, note: 'Automation aktif' },
                { label: 'Audit records', value: auditLogs.length, note: 'Compliance log' },
                { label: 'Follow-up due', value: followUps.length, note: 'Need confirmation' },
              ].map((item) => (
                <div key={item.label} className="rounded-[20px] border border-[#f0e3e8] bg-white/90 px-4 py-3.5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs text-muted">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-[#ecdde3] bg-white/92 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Quick Pulse</p>
            <div className="mt-4 space-y-2.5">
              {[
                ['Current queue', `${queue.length} sesi`],
                ['Today appointments', `${appointments.filter((item) => item.date === today).length} kunjungan`],
                ['Top treatment', topTreatment.name],
                ['Best package', treatmentPackages[0]?.name ?? '-'],
              ].map(([title, text]) => (
                <div key={title} className="flex items-center justify-between rounded-2xl border border-[#efe2e7] bg-[#fffafb] px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Patients today" value={`${patients.length}`} hint="Pasien aktif harian" icon={Users} />
        <StatCard title="Appointments" value={`${appointments.filter((item) => item.date === today).length}`} hint={`${waitlistCount} waiting list`} icon={CalendarDays} />
        <StatCard title="Active queue" value={`${queue.length}`} hint="Antrean berjalan" icon={Activity} />
        <StatCard title="Daily revenue" value={formatCurrency(todayRevenue)} hint="Pendapatan hari ini" icon={CreditCard} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <PatientJourney />
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Beauty care adherence</CardTitle>
              <CardDescription>Routine execution & content consent monitoring.</CardDescription>
            </div>
            <WalletCards className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="space-y-3">
            <div className="rounded-[22px] border border-[#efdee5] bg-[#fff7fa] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Average routine compliance</p>
              <h3 className="mt-2 text-3xl font-semibold">{averageRoutineCompliance}%</h3>
              <p className="mt-2 text-sm text-muted">Kepatuhan homecare harian dari total pasien aktif.</p>
            </div>
            <div className="rounded-[22px] border border-[#efe5e9] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Before-after approved</p>
              <h3 className="mt-2 text-3xl font-semibold">{consentedGalleryCount} assets</h3>
              <p className="mt-2 text-sm text-muted">Konten dengan consent marketing yang siap digunakan.</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Revenue trend chart</CardTitle>
              <CardDescription>Pendapatan mingguan untuk evaluasi growth dan stabilitas kas.</CardDescription>
            </div>
            <Badge variant="gold">Weekly</Badge>
          </CardHeader>
          <RevenueChart />
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Patient flow funnel</CardTitle>
              <CardDescription>Konversi pasien dari check-in sampai pembayaran.</CardDescription>
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
              <CardDescription>Tujuan perawatan utama yang paling banyak dipilih pasien.</CardDescription>
            </div>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="grid gap-3 md:grid-cols-3">
            {topBeautyGoals.map(([goal, count]) => (
              <div key={goal} className="rounded-[22px] border border-[#efe2e7] bg-[#fffafb] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Beauty goal</p>
                <h3 className="mt-2 text-lg font-semibold">{goal}</h3>
                <p className="mt-2 text-sm text-muted">{count} pasien aktif</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Quick pulse summary</CardTitle>
              <CardDescription>Ringkasan operasional dalam satu glance.</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="space-y-2.5">
            {[
              ['Patient active', `${patients.length} pasien`],
              ['Reminder scheduled', `${reminders.filter((item) => item.status === 'Scheduled').length} scheduled`],
              ['Queue execution', `${queue.length} sesi`],
              ['Revenue status', formatCurrency(todayRevenue)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-[#efe4e8] bg-white px-4 py-3">
                <p className="text-sm text-muted">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.95fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top treatment & package</CardTitle>
              <CardDescription>Treatment unggulan beserta kontribusi paket.</CardDescription>
            </div>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-[22px] border border-[#efdee5] bg-[#fff6f9] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted">Most booked</p>
              <h3 className="mt-2 text-2xl font-semibold">{topTreatment.name}</h3>
              <p className="mt-2 text-sm text-muted">
                {topTreatment.category} • {formatCurrency(topTreatment.price)} • Popularity {topTreatment.popularity}%
              </p>
              <p className="mt-2 text-sm text-muted">Package highlight: {treatmentPackages[0]?.name}</p>
            </div>
            <div className="space-y-3">
              {staff.slice(0, 4).map((member, index) => (
                <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#efe5e9] bg-white p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{index + 1}. {member.name}</p>
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
              <CardDescription>Skor performa tim untuk menjaga quality consistency.</CardDescription>
            </div>
          </CardHeader>
          <StaffPerformanceChart />
        </Card>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Notifications & audit</CardTitle>
              <CardDescription>Status reminder, aktivitas kritikal, dan follow-up.</CardDescription>
            </div>
            <BellRing className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="space-y-3">
            {reminders.slice(0, 2).map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#efdee5] bg-[#fff7fa] p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{item.type}</p>
                  <Badge variant={item.status === 'Sent' ? 'green' : 'pink'}>{item.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{item.channel} • {item.scheduledFor}</p>
              </div>
            ))}
            {auditLogs.slice(0, 2).map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#efe5e9] bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{item.action}</p>
                  <Badge variant="slate">Audit</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{item.actor} • {item.module}</p>
              </div>
            ))}
            {followUps.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#efe5e9] bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">Follow-up {item.dueDate}</p>
                  <Timer className="h-4 w-4 text-muted" />
                </div>
                <p className="mt-2 text-sm text-muted">{item.progress}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
