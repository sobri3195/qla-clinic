import { Bell, CalendarClock, CreditCard, FileText, LayoutDashboard, LogOut, Search, Settings, Stethoscope, Users, UserSquare2, UserRoundCog, Sparkles, ClipboardList, Package2, Menu } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Patients', to: '/patients', icon: Users },
  { label: 'Appointments', to: '/appointments', icon: CalendarClock },
  { label: 'Queue', to: '/queue', icon: ClipboardList },
  { label: 'Consultation', to: '/consultation', icon: Stethoscope },
  { label: 'Medical Records', to: '/medical-records', icon: FileText },
  { label: 'Treatments', to: '/treatments', icon: Sparkles },
  { label: 'Products', to: '/products', icon: Package2 },
  { label: 'Cashier', to: '/cashier', icon: CreditCard },
  { label: 'Invoice', to: '/invoice', icon: FileText },
  { label: 'Reports', to: '/reports', icon: FileText },
  { label: 'Staff', to: '/staff', icon: UserRoundCog },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export function AppLayout() {
  const { currentUser, settings, followUps, appointments, logout } = useAppStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      <motion.aside animate={{ x: sidebarOpen ? 0 : 0 }} className={cn('fixed inset-y-0 left-0 z-30 w-72 border-r border-white/60 bg-white/80 p-6 backdrop-blur lg:sticky lg:block', sidebarOpen ? 'block' : 'hidden lg:block')}>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">QLA Clinic</p>
          <h2 className="mt-2 text-2xl font-semibold">Management System</h2>
          <p className="mt-2 text-sm text-muted">Premium workflow from arrival to discharge.</p>
        </div>
        <nav className="space-y-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition', isActive ? 'bg-secondary text-foreground shadow' : 'text-muted hover:bg-secondary/80')}>
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 rounded-[24px] bg-hero-gradient p-5">
          <Badge variant="gold">Patient Journey</Badge>
          <ol className="mt-4 space-y-2 text-sm text-foreground/80">
            <li>1. Check-in & registration</li>
            <li>2. Screening & queue call</li>
            <li>3. Doctor consultation</li>
            <li>4. Treatment & skincare plan</li>
            <li>5. Billing, invoice, follow-up</li>
          </ol>
        </div>
      </motion.aside>

      <div className="flex-1 p-4 lg:p-6">
        <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/75 p-4 shadow-soft backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="icon" className="lg:hidden" onClick={() => setSidebarOpen((prev) => !prev)}><Menu className="h-4 w-4" /></Button>
            <div className="relative max-w-xl flex-1 lg:w-[420px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input className="pl-10" placeholder="Cari pasien, treatment, invoice, staff..." />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-secondary px-4 py-2 text-sm text-foreground">
              <p className="font-medium">{settings.systemName}</p>
              <p className="text-xs text-muted">{settings.openingHours} • Follow-up {followUps.length}</p>
            </div>
            <Button variant="secondary" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <div className="rounded-2xl bg-secondary px-4 py-2 text-sm">
              <p className="font-medium">{appointments.filter((item) => item.status !== 'cancelled').length} active visits</p>
              <p className="text-xs text-muted">Realtime dummy notifications enabled</p>
            </div>
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
                  <DropdownMenuItem onClick={() => navigate('/settings')}>System settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
