import {
  Bell,
  CalendarClock,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Stethoscope,
  Users,
  UserRoundCog,
  Sparkles,
  ClipboardList,
  Package2,
  Menu,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select } from '@/components/ui/select';
import { BrandLogo } from '@/components/shared/brand-logo';
import { canAccessModule } from '@/lib/access';
import { cn } from '@/lib/utils';
import type { PermissionModule, Role } from '@/types';

const navItems: { label: string; to: string; icon: typeof LayoutDashboard; module: PermissionModule }[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, module: 'dashboard' },
  { label: 'Patients', to: '/patients', icon: Users, module: 'patients' },
  { label: 'Appointments', to: '/appointments', icon: CalendarClock, module: 'appointments' },
  { label: 'Queue', to: '/queue', icon: ClipboardList, module: 'queue' },
  { label: 'Consultation', to: '/consultation', icon: Stethoscope, module: 'consultation' },
  { label: 'Medical Records', to: '/medical-records', icon: FileText, module: 'medical-records' },
  { label: 'Treatments', to: '/treatments', icon: Sparkles, module: 'treatments' },
  { label: 'Products', to: '/products', icon: Package2, module: 'products' },
  { label: 'Cashier', to: '/cashier', icon: CreditCard, module: 'cashier' },
  { label: 'Invoice', to: '/invoice', icon: FileText, module: 'invoice' },
  { label: 'Reports', to: '/reports', icon: FileText, module: 'reports' },
  { label: 'Staff', to: '/staff', icon: UserRoundCog, module: 'staff' },
  { label: 'Settings', to: '/settings', icon: Settings, module: 'settings' },
];

const roleOptions: Role[] = ['Admin / Front Office', 'Dokter / Aesthetic Doctor', 'Beautician / Therapist', 'Kasir', 'Manager / Owner'];

export function AppLayout() {
  const { currentUser, settings, followUps, appointments, queue, reminders, logout, switchRole } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const allowedItems = useMemo(() => navItems.filter((item) => canAccessModule(currentUser?.role, item.module)), [currentUser?.role]);
  const mobileNavItems = useMemo(() => allowedItems.slice(0, 4), [allowedItems]);
  const activeItem = useMemo(() => allowedItems.find((item) => item.to === location.pathname) ?? allowedItems[0], [allowedItems, location.pathname]);
  const todayAppointments = appointments.filter((item) => item.date === new Date().toISOString().slice(0, 10) && item.status !== 'cancelled').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent lg:flex">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-7rem] h-56 w-56 rounded-full bg-primary/12 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute right-[-6rem] top-24 h-48 w-48 rounded-full bg-[#f2d6b9]/35 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-[#dfeeea] blur-3xl sm:h-64 sm:w-64" />
      </div>

      {sidebarOpen && <button aria-label="Close sidebar overlay" className="fixed inset-0 z-20 bg-[#352a2f]/25 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <motion.aside
        animate={{ x: 0 }}
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-[88vw] max-w-80 flex-col border-r border-white/60 bg-white/85 p-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:bg-white/72',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="mb-8">
          <BrandLogo />
          <div className="mt-5 overflow-hidden rounded-[28px] border border-white/80 bg-hero-gradient p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Premium Care Workflow</p>
                <p className="mt-1 text-xs leading-5 text-muted">Arrival → consultation → treatment → cashier → follow-up.</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-2xl bg-white/70 px-3 py-2">
                <p className="text-muted">Active visits</p>
                <p className="mt-1 font-semibold text-foreground">{todayAppointments}</p>
              </div>
              <div className="rounded-2xl bg-white/70 px-3 py-2">
                <p className="text-muted">Reminders</p>
                <p className="mt-1 font-semibold text-foreground">{reminders.length}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {allowedItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition duration-200',
                  isActive ? 'bg-[#352a2f] text-white shadow-soft' : 'text-muted hover:bg-white/80 hover:text-foreground'
                )
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary/80 transition group-hover:bg-secondary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">{label}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 rounded-[28px] bg-[#352a2f] p-5 text-white shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <div>
              <Badge variant="gold">Patient Flow</Badge>
              <p className="mt-3 text-sm font-semibold">Satu dashboard untuk seluruh operasional klinik.</p>
            </div>
            <Sparkles className="h-5 w-5 text-white/80" />
          </div>
          <ol className="mt-4 space-y-2 text-sm text-white/80">
            <li>1. Registrasi & validasi booking</li>
            <li>2. Check-in dan antrean realtime</li>
            <li>3. Konsultasi & SOAP note</li>
            <li>4. Treatment, produk, dan billing</li>
            <li>5. Reminder, loyalty, dan audit</li>
          </ol>
        </div>
      </motion.aside>

      <div className="relative z-10 flex-1 px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:p-6 lg:pb-6">
        <header className="mb-6 overflow-hidden rounded-[32px] border border-white/60 bg-white/75 p-4 shadow-soft backdrop-blur-xl">
          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
            <div className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="icon" className="lg:hidden" onClick={() => setSidebarOpen((prev) => !prev)}>
                    <Menu className="h-4 w-4" />
                  </Button>
                  <div className="relative flex-1 lg:min-w-[320px] xl:w-[420px]">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input className="border-white/70 bg-white/85 pl-10" placeholder="Cari pasien, treatment, invoice, staff..." />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
                  <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm text-foreground">
                    <p className="font-medium">{settings.systemName}</p>
                    <p className="text-xs text-muted">{settings.openingHours} • Reminder {reminders.length}</p>
                  </div>
                  <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm">
                    <p className="font-medium">{appointments.filter((item) => item.status !== 'cancelled').length} active visits</p>
                    <p className="text-xs text-muted">Queue {queue.length} • Follow-up {followUps.length}</p>
                  </div>
                  <Button variant="secondary" size="icon" className="relative hidden xl:inline-flex">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(248,237,240,0.88),rgba(247,235,231,0.9))] p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="gold">Live workspace</Badge>
                    <Badge variant="pink">Responsive dashboard</Badge>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
                    {activeItem?.label ?? 'Clinic overview'} dengan tampilan yang lebih modern, ringan, dan nyaman di semua ukuran layar.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                    Gunakan pencarian, role switch, dan akses modul cepat untuk berpindah antar proses tanpa kehilangan konteks operasional harian.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    ['Role aktif', currentUser?.role ?? '-'],
                    ['Service point', `${settings.servicePoints.length} area aktif`],
                    ['Akses modul', `${allowedItems.length} modul tersedia`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
                      <p className="mt-2 font-medium text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/65 p-4 backdrop-blur">
              {currentUser && (
                <div className="rounded-2xl border border-border/80 bg-white/80 p-2">
                  <p className="px-2 pb-2 text-xs uppercase tracking-[0.18em] text-muted">Role quick switch</p>
                  <Select value={currentUser.role} onChange={(value) => switchRole(value as Role)} options={roleOptions.map((item) => ({ value: item, label: item }))} />
                </div>
              )}
              {currentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 rounded-2xl border border-border/80 bg-white/90 px-3 py-3 text-left transition hover:-translate-y-0.5">
                      <Avatar>
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{currentUser.name}</p>
                        <p className="truncate text-xs text-muted">{currentUser.role}</p>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canAccessModule(currentUser.role, 'settings') && <DropdownMenuItem onClick={() => navigate('/settings')}>System settings</DropdownMenuItem>}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl bg-secondary/90 p-4 text-sm">
                  <p className="font-medium text-foreground">Today focus</p>
                  <p className="mt-2 text-muted">Pantau antrean aktif, follow-up jatuh tempo, dan reminder agar transisi antar tim tetap mulus.</p>
                </div>
                <div className="rounded-2xl border border-dashed border-border bg-white/70 p-4 text-sm text-muted">
                  Aktivitas paling efektif saat ini: validasi booking pagi, review queue, dan follow-up pasca treatment.
                </div>
              </div>
            </div>
          </div>
        </header>
        <Outlet />
      </div>

      {mobileNavItems.length > 0 && (
        <nav className="fixed inset-x-3 bottom-3 z-20 rounded-[28px] border border-white/70 bg-white/95 p-2 shadow-soft backdrop-blur lg:hidden">
          <div className="grid grid-cols-5 gap-2">
            {mobileNavItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center text-[11px] font-medium transition',
                    isActive ? 'bg-[#352a2f] text-white shadow-sm' : 'text-muted hover:bg-secondary/70'
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1 w-full">{label}</span>
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center text-[11px] font-medium text-muted transition hover:bg-secondary/70"
            >
              <Menu className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1 w-full">Menu</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
