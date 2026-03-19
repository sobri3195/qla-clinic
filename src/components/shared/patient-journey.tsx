import { ArrowRight, CalendarClock, ClipboardCheck, CreditCard, HeartHandshake, Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const journeySteps = [
  {
    title: 'Booking & Registrasi',
    description: 'Pasien pilih treatment, slot tervalidasi, dan data awal langsung tersimpan.',
    icon: CalendarClock,
    accent: 'from-[#f8dce2] to-[#fff5f7]',
  },
  {
    title: 'Check-in & Queue',
    description: 'Front office check-in, nomor antrean muncul, dan ETA terus diperbarui.',
    icon: ClipboardCheck,
    accent: 'from-[#fef0e3] to-[#fffaf2]',
  },
  {
    title: 'Konsultasi Dokter',
    description: 'SOAP note, consent, diagnosis, dan rekomendasi tersusun di satu workspace.',
    icon: Stethoscope,
    accent: 'from-[#eaf7f2] to-[#f9fffc]',
  },
  {
    title: 'Treatment & Produk',
    description: 'Pelaksanaan tindakan, pemakaian consumable, dan stok langsung sinkron.',
    icon: HeartHandshake,
    accent: 'from-[#f8ecf8] to-[#fff9ff]',
  },
  {
    title: 'Kasir & Follow-up',
    description: 'Pembayaran, loyalty point, reminder, dan next visit siap dijalankan.',
    icon: CreditCard,
    accent: 'from-[#eceffd] to-[#fbfcff]',
  },
] as const;

export function PatientJourney({ className }: { className?: string }) {
  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div className="border-b border-white/70 px-6 py-5">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Patient Journey</p>
        <h3 className="mt-2 text-xl font-semibold">Alur pasien dibuat jelas dari datang sampai follow-up.</h3>
        <p className="mt-2 text-sm text-muted">Tiap tahap disusun untuk memudahkan front office, dokter, therapist, kasir, dan owner membaca progres layanan.</p>
      </div>
      <div className="grid gap-4 p-6 xl:grid-cols-5">
        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative">
              <div className={cn('h-full rounded-[24px] border border-white/70 bg-gradient-to-br p-5', step.accent)}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">0{index + 1}</span>
                </div>
                <h4 className="mt-5 text-lg font-semibold">{step.title}</h4>
                <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
              </div>
              {index < journeySteps.length - 1 && <ArrowRight className="absolute -right-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary/60 xl:block" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
