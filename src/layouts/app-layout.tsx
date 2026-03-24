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
  X,
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
  const quickStats = [
    { label: 'Kunjungan aktif', value: `${todayAppointments}` },
    { label: 'Antrean', value: `${queue.length}` },
    { label: 'Follow-up', value: `${followUps.length}` },
    { label: 'Reminder', value: `${reminders.length}` },
  ];

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
          'fixed inset-y-0 left-0 z-30 flex w-[88vw] max-w-80 flex-col border-r border-[#eee4e8] bg-[#fffdfd]/96 p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:bg-[#fffdfd]/88 lg:p-5',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <BrandLogo />
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6 rounded-[28px] border border-[#f0e6ea] bg-hero-gradient p-4 shadow-[0_14px_30px_rgba(85,57,67,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Hari ini</p>
              <p className="mt-1 text-xs text-muted">{settings.openingHours}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {quickStats.slice(0, 4).map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/70 bg-white/75 px-3 py-2">
                <p className="text-muted">{item.label}</p>
                <p className="mt-1 font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
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
                  'group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition duration-200',
                  isActive ? 'border-[#e7d7dd] bg-[#fff5f8] text-foreground shadow-[0_8px_24px_rgba(150,97,113,0.12)]' : 'border-transparent text-muted hover:border-[#eee2e7] hover:bg-white/85 hover:text-foreground'
                )
              }
            >
              <span className={cn('flex h-9 w-9 items-center justify-center rounded-2xl border transition', location.pathname === to ? 'border-[#ebd8de] bg-white text-primary' : 'border-transparent bg-secondary/80 group-hover:bg-secondary')}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">{label}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>
      </motion.aside>

      <div className="relative z-10 flex-1 px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:p-6 lg:pb-6">
        <header className="mb-6 overflow-hidden rounded-[30px] border border-[#eee3e8] bg-white/90 p-4 shadow-[0_15px_40px_rgba(67,42,50,0.08)] backdrop-blur-xl sm:p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] xl:items-start">
            <div className="space-y-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="secondary" size="icon" className="shrink-0 lg:hidden" onClick={() => setSidebarOpen((prev) => !prev)}>
                    <Menu className="h-4 w-4" />
                  </Button>
                  <div className="relative min-w-0 flex-1 xl:w-[420px]">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input className="h-11 border-[#eee4e8] bg-[#fffdfd] pl-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" placeholder="Cari pasien, jadwal, invoice..." />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-start xl:hidden">
                  <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm">
                    <p className="font-medium">{settings.systemName}</p>
                    <p className="text-xs text-muted">{currentUser?.role ?? '-'}</p>
                  </div>
                  <Button variant="secondary" size="icon" className="relative shrink-0">
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                  </Button>
                </div>
              </div>

              <div className="rounded-[24px] border border-[#efe4e8] bg-[linear-gradient(130deg,rgba(255,255,255,0.98),rgba(250,240,245,0.92),rgba(248,238,232,0.9))] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="gold">{activeItem?.label ?? 'Clinic overview'}</Badge>
                  <Badge variant="slate">{allowedItems.length} modul</Badge>
                </div>
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-[2rem]">Workspace klinik yang rapi, cepat, dan premium.</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {quickStats.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-[#efe4e8] bg-white/85 px-4 py-3 text-sm">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.label}</p>
                      <p className="mt-2 font-medium text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[24px] border border-[#eee2e7] bg-[#fffdfd]/75 p-4 backdrop-blur">
              {currentUser && (
                <div className="rounded-2xl border border-border/80 bg-white/80 p-2">
                  <p className="px-2 pb-2 text-xs uppercase tracking-[0.18em] text-muted">Role</p>
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
                    {canAccessModule(currentUser.role, 'settings') && <DropdownMenuItem onClick={() => navigate('/settings')}>Pengaturan</DropdownMenuItem>}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <div className="hidden xl:grid xl:grid-cols-2 xl:gap-3">
                <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm text-foreground">
                  <p className="font-medium">{settings.systemName}</p>
                  <p className="text-xs text-muted">{settings.openingHours}</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 text-sm">
                  <p className="font-medium">{appointments.filter((item) => item.status !== 'cancelled').length} kunjungan aktif</p>
                  <p className="text-xs text-muted">Queue {queue.length} • Follow-up {followUps.length}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <Outlet />
      </div>

      {mobileNavItems.length > 0 && (
        <nav className="fixed inset-x-3 bottom-3 z-20 rounded-[24px] border border-white/70 bg-white/95 p-2 shadow-soft backdrop-blur lg:hidden">
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
