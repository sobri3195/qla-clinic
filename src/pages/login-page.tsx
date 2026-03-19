import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Stethoscope, Smartphone } from 'lucide-react';
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
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_30%),linear-gradient(145deg,#fffdfb_0%,#fcf2f4_48%,#f6ebe7_100%)] lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative overflow-hidden px-6 py-8 lg:px-10 lg:py-10">
        <div className="flex h-full flex-col justify-between rounded-[36px] border border-white/70 bg-white/45 p-6 shadow-soft backdrop-blur-lg lg:p-8">
          <div>
            <BrandLogo />
            <p className="mt-8 text-sm uppercase tracking-[0.32em] text-primary">Clinic Experience OS</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight lg:text-5xl">
              Dashboard klinik aesthetic yang lebih elegan, jelas, dan siap dipakai di desktop maupun mobile.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted lg:text-base">
              UI/UX dirancang untuk menjelaskan alur pasien dari booking sampai follow-up, sambil tetap mudah dipakai oleh front office, dokter, therapist, kasir, dan owner.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Multi akses level', ShieldCheck],
              ['Doctor-ready notes', Stethoscope],
              ['Premium visual dashboard', Sparkles],
              ['Responsive mobile view', Smartphone],
            ].map(([label, Icon]) => (
              <motion.div whileHover={{ y: -4 }} key={label} className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur">
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-4 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 lg:p-10">
        <Card className="w-full max-w-xl bg-white/92 p-7 lg:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Demo Login</p>
          <h2 className="mt-4 text-3xl font-semibold">Masuk ke sistem klinik.</h2>
          <p className="mt-3 text-sm text-muted">Role dapat diganti kapan saja untuk menguji permission matrix, alur pasien, dan akses modul.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              'Front office untuk registrasi & booking',
              'Dokter untuk SOAP & konsultasi',
              'Kasir untuk billing & loyalty',
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
