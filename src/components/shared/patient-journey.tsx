import { CalendarClock, ClipboardCheck, CreditCard, HeartHandshake, Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const journeySteps = [
  {
    title: 'Booking & Registrasi',
    description: 'Slot tervalidasi dan data awal pasien tersimpan.',
    icon: CalendarClock,
    accent: 'bg-[#fff5f8] border-[#f1dce3]',
  },
  {
    title: 'Check-in & Queue',
    description: 'Nomor antrean dan ETA real-time untuk front office.',
    icon: ClipboardCheck,
    accent: 'bg-[#fff8f1] border-[#f2e2cf]',
  },
  {
    title: 'Konsultasi Dokter',
    description: 'SOAP note dan rekomendasi treatment di satu panel.',
    icon: Stethoscope,
    accent: 'bg-[#f1faf6] border-[#dceee4]',
  },
  {
    title: 'Treatment & Produk',
    description: 'Paket perawatan dan consumable sinkron otomatis.',
    icon: HeartHandshake,
    accent: 'bg-[#faf4fb] border-[#ecddf0]',
  },
  {
    title: 'Kasir & Follow-up',
    description: 'Pembayaran, reminder, dan jadwal lanjutan terhubung.',
    icon: CreditCard,
    accent: 'bg-[#f3f5ff] border-[#e1e4f4]',
  },
] as const;

export function PatientJourney({ className }: { className?: string }) {
  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <div className="border-b border-[#f0e6ea] px-5 py-5 sm:px-6">
        <p className="text-xs uppercase tracking-[0.26em] text-primary">Patient Journey</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">Alur operasional pasien end-to-end.</h3>
      </div>
      <div className="grid gap-3 p-5 sm:p-6 xl:grid-cols-5">
        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative">
              <div className={cn('h-full rounded-[22px] border p-4', step.accent)}>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/90 bg-white/90 text-primary shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">Step {index + 1}</span>
                </div>
                <h4 className="mt-4 text-base font-semibold leading-tight">{step.title}</h4>
                <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
              </div>
              {index < journeySteps.length - 1 && <div className="absolute right-[-8px] top-1/2 hidden h-px w-4 -translate-y-1/2 bg-[#ead8df] xl:block" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
