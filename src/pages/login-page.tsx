import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import type { Role } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-hero-gradient p-10 lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-primary">QLA Clinic</p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight">QLA Clinic Management System untuk workflow pasien dari datang hingga pulang.</h1>
          <p className="mt-6 max-w-lg text-base text-muted">Premium SaaS-style frontend prototype untuk operasional aesthetic clinic: registrasi, konsultasi, treatment, kasir, invoice, follow-up, laporan, dan membership.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Check-in seamless', ShieldCheck],
            ['Doctor-ready medical notes', Stethoscope],
            ['Elegant premium dashboard', Sparkles],
          ].map(([label, Icon]) => (
            <motion.div whileHover={{ y: -4 }} key={label} className="rounded-[28px] border border-white/70 bg-white/70 p-5 backdrop-blur">
              <Icon className="h-6 w-6 text-primary" />
              <p className="mt-4 text-sm font-medium">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center p-6 lg:p-10">
        <Card className="w-full max-w-xl bg-white/90 p-8 lg:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Demo Login</p>
          <h2 className="mt-4 text-3xl font-semibold">Masuk ke sistem klinik.</h2>
          <p className="mt-3 text-sm text-muted">Tanpa backend — role, data, dan workflow disimulasikan penuh di frontend menggunakan localStorage.</p>

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
