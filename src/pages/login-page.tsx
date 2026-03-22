import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Stethoscope, Smartphone, HeartHandshake, CalendarClock } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import type { Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { BrandLogo } from '@/components/shared/brand-logo';
import { toast } from 'sonner';

const roles: Role[] = ['Admin / Front Office', 'Dokter / Aesthetic Doctor', 'Beautician / Therapist', 'Kasir', 'Manager / Owner'];

export function LoginPage() {
  const [name, setName] = useState('Nadya Prameswari');
  const [role, setRole] = useState<Role>(roles[0]);
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login({
      name,
      role,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    });
    toast.success(`Masuk sebagai ${role}`);
    navigate('/');
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_28%),linear-gradient(145deg,#fffdfb_0%,#fcf2f4_48%,#f6ebe7_100%)] lg:grid-cols-[1.02fr_0.98fr]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5rem] top-[-4rem] h-48 w-48 rounded-full bg-primary/15 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute bottom-0 right-[-6rem] h-56 w-56 rounded-full bg-[#f2d6b9]/35 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <section className="relative overflow-hidden px-4 py-5 sm:px-6 lg:px-10 lg:py-10">
        <div className="flex h-full flex-col justify-between rounded-[32px] border border-white/70 bg-white/50 p-5 shadow-soft backdrop-blur-lg sm:p-6 lg:p-8">
          <div>
            <BrandLogo />
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.28em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              QLA Clinic
            </div>
            <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Sistem klinik yang rapi, cepat, dan nyaman dipakai di semua ukuran layar.
            </h1>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ['10+', 'modul operasional'],
                ['5 role', 'akses sesuai tugas'],
                ['Realtime', 'queue & reminder'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-[24px] border border-white/75 bg-white/70 px-4 py-4 backdrop-blur">
                  <p className="text-2xl font-semibold text-foreground">{value}</p>
                  <p className="mt-2 text-sm text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              ['Multi akses level', ShieldCheck],
              ['Catatan dokter', Stethoscope],
              ['Patient flow', HeartHandshake],
              ['Booking cepat', CalendarClock],
              ['UI ringkas', Sparkles],
              ['Mobile ready', Smartphone],
            ].map(([label, Icon]) => (
              <motion.div whileHover={{ y: -4 }} key={label} className="rounded-[24px] border border-white/70 bg-white/70 p-4 backdrop-blur">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 flex items-center justify-center p-4 sm:p-5 lg:p-10">
        <Card className="w-full max-w-xl bg-white/92 p-5 sm:p-7 lg:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Demo Login</p>
          <h2 className="mt-4 text-3xl font-semibold">Masuk ke sistem klinik.</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Pilih role untuk mulai.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              'Front office',
              'Dokter',
              'Kasir',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-secondary/70 px-4 py-3 text-sm text-muted">
                {item}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Nama user</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Masukkan nama staf" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Pilih role</label>
              <Select value={role} onChange={(value) => setRole(value as Role)} options={roles.map((item) => ({ value: item, label: item }))} />
            </div>
            <Button type="submit" className="w-full justify-center">
              Masuk ke dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
