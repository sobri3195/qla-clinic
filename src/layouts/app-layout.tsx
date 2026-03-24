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

const navItems: { label: string; to: string; icon: typeof LayoutDashboard; module: PermissionModule; group: 'Core' | 'Operations' | 'Management' }[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, module: 'dashboard', group: 'Core' },
  { label: 'Patients', to: '/patients', icon: Users, module: 'patients', group: 'Core' },
  { label: 'Appointments', to: '/appointments', icon: CalendarClock, module: 'appointments', group: 'Core' },
  { label: 'Queue', to: '/queue', icon: ClipboardList, module: 'queue', group: 'Operations' },
  { label: 'Consultation', to: '/consultation', icon: Stethoscope, module: 'consultation', group: 'Operations' },
  { label: 'Medical Records', to: '/medical-records', icon: FileText, module: 'medical-records', group: 'Operations' },
  { label: 'Treatments', to: '/treatments', icon: Sparkles, module: 'treatments', group: 'Operations' },
  { label: 'Products', to: '/products', icon: Package2, module: 'products', group: 'Operations' },
  { label: 'Cashier', to: '/cashier', icon: CreditCard, module: 'cashier', group: 'Operations' },
  { label: 'Invoice', to: '/invoice', icon: FileText, module: 'invoice', group: 'Management' },
  { label: 'Reports', to: '/reports', icon: FileText, module: 'reports', group: 'Management' },
  { label: 'Staff', to: '/staff', icon: UserRoundCog, module: 'staff', group: 'Management' },
  { label: 'Settings', to: '/settings', icon: Settings, module: 'settings', group: 'Management' },
];

const roleOptions: Role[] = ['Admin / Front Office', 'Dokter / Aesthetic Doctor', 'Beautician / Therapist', 'Kasir', 'Manager / Owner'];

export function AppLayout() {
  const { currentUser, settings, followUps, appointments, queue, reminders, logout, switchRole } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const allowedItems = useMemo(() => navItems.filter((item) => canAccessModule(currentUser?.role, item.module)), [currentUser?.role]);
  const groupedItems = useMemo(
    () =>
      ['Core', 'Operations', 'Management'].map((group) => ({
        group,
        items: allowedItems.filter((item) => item.group === group),
      })),
    [allowedItems]
  );

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
        <div className="absolute left-[-8rem] top-[-7rem] h-56 w-56 rounded-full bg-primary/10 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute right-[-6rem] top-24 h-48 w-48 rounded-full bg-[#f2d6b9]/25 blur-3xl sm:h-72 sm:w-72" />
      </div>

      {sidebarOpen && <button aria-label="Close sidebar overlay" className="fixed inset-0 z-20 bg-[#352a2f]/25 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <motion.aside
        animate={{ x: 0 }}
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-[88vw] max-w-80 flex-col border-r border-[#eee4e8] bg-[#fffdfd]/97 p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:p-5',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <BrandLogo />
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-6 rounded-[24px] border border-[#f0e6ea] bg-hero-gradient p-4 shadow-[0_10px_28px_rgba(85,57,67,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Clinic workspace</p>
              <p className="mt-1 text-xs text-muted">{settings.openingHours}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ead8de] bg-white text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {quickStats.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/75 bg-white/80 px-2.5 py-2">
                <p className="text-muted">{item.label}</p>
                <p className="mt-1 font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto pr-1">
          {groupedItems.map((group) =>
            group.items.length > 0 ? (
              <div key={group.group}>
                <p className="mb-2 px-2 text-[11px] uppercase tracking-[0.2em] text-muted">{group.group}</p>
                <div className="space-y-1.5">
                  {group.items.map(({ label, to, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition duration-200',
                          isActive
                            ? 'border-[#e8d9df] bg-[#fff4f7] text-foreground shadow-[0_8px_20px_rgba(150,97,113,0.1)]'
                            : 'border-transparent text-muted hover:border-[#eee2e7] hover:bg-white hover:text-foreground'
                        )
                      }
                    >
                      <span className={cn('flex h-8 w-8 items-center justify-center rounded-xl border transition', location.pathname === to ? 'border-[#ebd8de] bg-white text-primary' : 'border-transparent bg-secondary/70 group-hover:bg-secondary')}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1 truncate">{label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </nav>
      </motion.aside>

      <div className="relative z-10 flex-1 px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:p-6 lg:pb-6">
        <header className="mb-6 rounded-[26px] border border-[#eee3e8] bg-white/92 p-4 shadow-[0_12px_36px_rgba(67,42,50,0.07)] backdrop-blur-xl sm:p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" size="icon" className="shrink-0 lg:hidden" onClick={() => setSidebarOpen((prev) => !prev)}>
                  <Menu className="h-4 w-4" />
                </Button>
                <div className="relative min-w-0 flex-1 xl:max-w-[540px]">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <Input className="h-11 border-[#ebe2e6] bg-white pl-10" placeholder="Cari pasien, jadwal, invoice, atau treatment..." />
                </div>
                <Button variant="secondary" size="icon" className="relative shrink-0">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                </Button>
              </div>

              <div className="rounded-[22px] border border-[#efe4e8] bg-[linear-gradient(130deg,rgba(255,255,255,0.98),rgba(252,243,247,0.92),rgba(248,238,232,0.88))] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="pink">{activeItem?.label ?? 'Clinic overview'}</Badge>
                  <Badge variant="slate">{allowedItems.length} modul aktif</Badge>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Control center yang rapi untuk operasional klinik harian.</h2>
                <p className="mt-2 text-sm text-muted">Prioritas data ditata agar tiap bagian mudah dipindai dan cepat ditindaklanjuti.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-[22px] border border-[#eee2e7] bg-[#fffdfd]/88 p-4">
              <div className="rounded-2xl border border-border/80 bg-white/90 p-2">
                <p className="px-2 pb-2 text-xs uppercase tracking-[0.18em] text-muted">Role</p>
                {currentUser && <Select value={currentUser.role} onChange={(value) => switchRole(value as Role)} options={roleOptions.map((item) => ({ value: item, label: item }))} />}
              </div>

              {currentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 rounded-2xl border border-border/80 bg-white px-3 py-3 text-left transition hover:-translate-y-0.5">
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

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[#eee2e7] bg-white px-3 py-2.5 text-sm text-foreground">
                  <p className="font-medium">{settings.systemName}</p>
                  <p className="text-xs text-muted">{settings.openingHours}</p>
                </div>
                <div className="rounded-xl border border-[#eee2e7] bg-white px-3 py-2.5 text-sm">
                  <p className="font-medium">{appointments.filter((item) => item.status !== 'cancelled').length} kunjungan</p>
                  <p className="text-xs text-muted">Queue {queue.length} • Follow-up {followUps.length}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Outlet />
      </div>

      {mobileNavItems.length > 0 && (
        <nav className="fixed inset-x-3 bottom-3 z-20 rounded-[22px] border border-white/80 bg-white/95 p-2 shadow-soft backdrop-blur lg:hidden">
          <div className="grid grid-cols-5 gap-2">
            {mobileNavItems.map(({ label, to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn('flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center text-[11px] font-medium transition', isActive ? 'bg-[#3d2f35] text-white shadow-sm' : 'text-muted hover:bg-secondary/70')
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
