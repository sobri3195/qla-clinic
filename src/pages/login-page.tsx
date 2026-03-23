import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarCheck2, CheckCircle2, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { BrandLogo } from '@/components/shared/brand-logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAppStore } from '@/store/app-store';
import type { Role } from '@/types';

const roles: Role[] = ['Admin / Front Office', 'Dokter / Aesthetic Doctor', 'Beautician / Therapist', 'Kasir', 'Manager / Owner'];

const highlights = [
  {
    title: 'Alur kerja lebih cepat',
    description: 'Pendaftaran, jadwal, pemeriksaan, dan pembayaran terasa lebih ringkas.',
    icon: CalendarCheck2,
  },
  {
    title: 'Data pasien lebih rapi',
    description: 'Catatan tindakan, resep, dan riwayat kunjungan tersimpan dalam satu sistem.',
    icon: Stethoscope,
  },
  {
    title: 'Akses sesuai peran',
    description: 'Tim front office, dokter, kasir, dan owner melihat menu yang mereka butuhkan.',
    icon: ShieldCheck,
  },
];

const quickPoints = ['Tampilan ringan dan modern', 'Cocok untuk desktop & tablet', 'Demo login tanpa password'];

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
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffdfb_0%,#fcf4f1_52%,#fff9f7_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8rem] top-[-5rem] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-5rem] right-[-6rem] h-80 w-80 rounded-full bg-[#f2d6b9]/45 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <section className="rounded-[32px] border border-white/70 bg-white/65 p-6 shadow-soft backdrop-blur-xl sm:p-8 lg:p-10">
            <BrandLogo />

            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Sistem operasional klinik
            </div>

            <div className="mt-6 max-w-2xl space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                Landing page baru yang lebih sederhana, tapi tetap terasa premium.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted sm:text-lg">
                QLA Clinic membantu tim bekerja lebih cepat dengan dashboard yang bersih, alur pasien yang jelas, dan akses sesuai peran.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {highlights.map(({ title, description, icon: Icon }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-[24px] border border-border/60 bg-white/80 p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 rounded-[28px] border border-[#ead7d4] bg-[#fff7f5] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-sm font-semibold text-foreground">Kenapa desain ini lebih enak dilihat?</p>
                <p className="mt-1 text-sm leading-6 text-muted">Lebih sedikit distraksi, hierarki konten lebih jelas, dan CTA login langsung terlihat.</p>
              </div>
              <div className="grid gap-2 text-sm text-foreground">
                {quickPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="lg:pl-6">
            <Card className="mx-auto w-full max-w-xl border-white/80 bg-white/92 p-6 sm:p-8 lg:p-9">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Demo Login</p>
              <h2 className="mt-3 text-3xl font-semibold text-foreground">Masuk ke dashboard klinik.</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Gunakan nama staf dan pilih role untuk melihat pengalaman yang berbeda pada setiap bagian sistem.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {['Front Office', 'Dokter', 'Kasir'].map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-secondary/70 px-3 py-3 text-center text-sm text-muted">
                    {item}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Nama user</label>
                  <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Masukkan nama staf" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Pilih role</label>
                  <Select value={role} onChange={(value) => setRole(value as Role)} options={roles.map((item) => ({ value: item, label: item }))} />
                </div>
                <Button type="submit" className="w-full justify-center">
                  Masuk ke dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 rounded-[24px] border border-dashed border-border bg-secondary/40 p-4 text-sm text-muted">
                Cocok untuk demo presentasi produk: pengguna bisa langsung login tanpa password dan melihat alur kerja klinik dalam beberapa klik.
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
