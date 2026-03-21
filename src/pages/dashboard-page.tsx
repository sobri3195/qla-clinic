import { Activity, CalendarDays, CreditCard, Users, Sparkles, BellRing, ShieldCheck, Smartphone, ArrowUpRight, HeartHandshake, CalendarClock } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageShell } from '@/components/shared/page-shell';
import { StatCard } from '@/components/shared/stat-card';
import { Badge } from '@/components/ui/badge';
import { RevenueChart, FunnelChartCard, StaffPerformanceChart } from '@/components/charts/revenue-chart';
import { PatientJourney } from '@/components/shared/patient-journey';
import { useAppStore } from '@/store/app-store';
import { formatCurrency, calculateTransactionTotal } from '@/lib/utils';

export function DashboardPage() {
  const { patients, appointments, queue, transactions, staff, followUps, treatments, reminders, auditLogs, treatmentPackages, currentUser } = useAppStore();
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
    <PageShell title="Dashboard" description="Ringkasan operasional QLA Clinic hari ini: branding premium, patient journey yang jelas, akses per role, CRUD operasional, dan tampilan responsive.">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(248,237,240,0.94),rgba(247,235,231,0.9))]">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold">Executive overview</Badge>
            <Badge variant="green">Live today</Badge>
          </div>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight sm:text-[2rem]">
            Operasional hari ini terlihat lebih rapi, informatif, dan jauh lebih nyaman dibaca pada layar desktop maupun mobile.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Fokus utama hari ini adalah menjaga arus pasien tetap lancar dari appointment, antrean, konsultasi, hingga pembayaran dan follow-up.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ['Queue terpantau', `${queue.length} pasien aktif di antrean`, Activity],
              ['Booking terkendali', `${waitlistCount} pasien menunggu slot`, CalendarClock],
              ['Service premium', `${followUps.length} follow-up siap dijalankan`, HeartHandshake],
            ].map(([title, text, Icon]) => (
              <div key={title} className="rounded-[24px] border border-white/70 bg-white/70 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-medium">{title}</p>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>System highlights</CardTitle>
              <CardDescription>Transformasi utama yang sekarang langsung terlihat pada aplikasi.</CardDescription>
            </div>
            <Badge variant="gold">What changed</Badge>
          </CardHeader>
          <div className="grid gap-3">
            {[
              ['Logo & favicon baru', 'Brand QLA kini konsisten di halaman login, sidebar, dan browser tab.', ShieldCheck],
              ['Multi akses level', `Role aktif sekarang bisa diuji cepat sebagai ${currentUser?.role ?? '-'}.`, Sparkles],
              ['CRUD operasional', 'Pasien, staf, dan produk dapat ditambah, diubah, dan dihapus.', Activity],
              ['Responsive mobile', 'Layout, kartu ringkasan, dan daftar data kini lebih nyaman di layar kecil.', Smartphone],
            ].map(([title, text, Icon]) => (
              <div key={title} className="rounded-[24px] border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm text-muted">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Patients today" value={`${patients.length}`} hint="Active profiles with loyalty & referral" icon={Users} />
        <StatCard title="Appointments today" value={`${appointments.filter((item) => item.date === new Date().toISOString().slice(0, 10)).length}`} hint={`${waitlistCount} waiting list monitored`} icon={CalendarDays} />
        <StatCard title="Active queue" value={`${queue.length}`} hint="Status auto-progression enabled" icon={Activity} />
        <StatCard title="Daily revenue" value={formatCurrency(todayRevenue)} hint="Stock + loyalty synced to cashier" icon={CreditCard} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <PatientJourney />
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Quick pulse</CardTitle>
              <CardDescription>Snapshot singkat untuk membantu owner atau supervisor membaca kondisi hari ini.</CardDescription>
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

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Beauty goals tracker</CardTitle>
              <CardDescription>Snapshot target kecantikan pasien yang paling sering diminta untuk membantu campaign dan bundling treatment.</CardDescription>
            </div>
            <Sparkles className="h-5 w-5 text-primary" />
          </CardHeader>
          <div className="grid gap-4 md:grid-cols-3">
            {topBeautyGoals.map(([goal, count]) => (
              <div key={goal} className="rounded-[24px] border border-border p-5">
                <p className="text-sm text-muted">Beauty goal</p>
                <h3 className="mt-2 text-lg font-semibold">{goal}</h3>
                <p className="mt-2 text-sm text-muted">{count} pasien aktif menargetkan outcome ini.</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Beauty care adherence</CardTitle>
              <CardDescription>Kedisiplinan homecare dan aset konten before-after yang siap dipakai untuk follow-up premium.</CardDescription>
            </div>
          </CardHeader>
          <div className="space-y-4">
            <div className="rounded-[24px] bg-secondary p-5">
              <p className="text-sm text-muted">Average routine compliance</p>
              <h3 className="mt-2 text-3xl font-semibold">{averageRoutineCompliance}%</h3>
              <p className="mt-2 text-sm text-muted">Digabung dari kepatuhan homecare seluruh pasien aktif.</p>
            </div>
            <div className="rounded-[24px] border border-border p-5">
              <p className="text-sm text-muted">Consented before-after gallery</p>
              <h3 className="mt-2 text-3xl font-semibold">{consentedGalleryCount} assets</h3>
              <p className="mt-2 text-sm text-muted">Bisa dipakai untuk edukasi treatment dan social proof internal klinik.</p>
            </div>
          </div>
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
