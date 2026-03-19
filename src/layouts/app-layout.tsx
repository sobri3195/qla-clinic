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
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const allowedItems = useMemo(() => navItems.filter((item) => canAccessModule(currentUser?.role, item.module)), [currentUser?.role]);
  const mobileNavItems = useMemo(() => allowedItems.slice(0, 4), [allowedItems]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent lg:flex">
      {sidebarOpen && <button aria-label="Close sidebar overlay" className="fixed inset-0 z-20 bg-[#352a2f]/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <motion.aside
        animate={{ x: 0 }}
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-[88vw] max-w-80 flex-col border-r border-white/60 bg-white/90 p-5 backdrop-blur lg:sticky lg:w-72',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="mb-8">
          <BrandLogo />
          <div className="mt-5 rounded-[24px] border border-white/70 bg-hero-gradient p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Premium Care Workflow</p>
                <p className="mt-1 text-xs text-muted">Arrival → consultation → treatment → cashier → follow-up.</p>
              </div>
              <ShieldCheck className="h-5 w-5 text-primary" />
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
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                  isActive ? 'bg-secondary text-foreground shadow' : 'text-muted hover:bg-secondary/80'
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 rounded-[24px] bg-[#352a2f] p-5 text-white">
          <Badge variant="gold">Patient Flow</Badge>
          <ol className="mt-4 space-y-2 text-sm text-white/80">
            <li>1. Registrasi & validasi booking</li>
            <li>2. Check-in dan antrean realtime</li>
            <li>3. Konsultasi & SOAP note</li>
            <li>4. Treatment, produk, dan billing</li>
            <li>5. Reminder, loyalty, dan audit</li>
          </ol>
        </div>
      </motion.aside>

      <div className="flex-1 px-3 pb-24 pt-3 sm:px-4 sm:pt-4 lg:p-6 lg:pb-6">
        <header className="mb-6 space-y-4 rounded-[28px] border border-white/60 bg-white/80 p-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="icon" className="lg:hidden" onClick={() => setSidebarOpen((prev) => !prev)}>
                <Menu className="h-4 w-4" />
              </Button>
              <div className="relative flex-1 xl:w-[420px]">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <Input className="pl-10" placeholder="Cari pasien, treatment, invoice, staff..." />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
              <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground">
                <p className="font-medium">{settings.systemName}</p>
                <p className="text-xs text-muted">{settings.openingHours} • Reminder {reminders.length}</p>
              </div>
              <div className="rounded-2xl bg-secondary px-4 py-3 text-sm">
                <p className="font-medium">{appointments.filter((item) => item.status !== 'cancelled').length} active visits</p>
                <p className="text-xs text-muted">Queue {queue.length} • Follow-up {followUps.length}</p>
              </div>
              <Button variant="secondary" size="icon" className="relative hidden xl:inline-flex">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[1fr_auto] xl:items-center">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                ['Role aktif', currentUser?.role ?? '-'],
                ['Service point', `${settings.servicePoints.length} area aktif`],
                ['Akses modul', `${allowedItems.length} modul tersedia`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border/70 px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {currentUser && (
                <div className="min-w-[250px] rounded-2xl border border-border bg-white/80 p-2">
                  <p className="px-2 pb-2 text-xs uppercase tracking-[0.18em] text-muted">Role quick switch</p>
                  <Select value={currentUser.role} onChange={(value) => switchRole(value as Role)} options={roleOptions.map((item) => ({ value: item, label: item }))} />
                </div>
              )}
              {currentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 rounded-2xl border border-border bg-white px-3 py-2 text-left">
                      <Avatar>
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-muted">{currentUser.role}</p>
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
                    isActive ? 'bg-secondary text-foreground shadow-sm' : 'text-muted hover:bg-secondary/70'
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
