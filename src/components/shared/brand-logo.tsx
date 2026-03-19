import { cn } from '@/lib/utils';

export function BrandLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#1f7669,#c48b9a_55%,#f4dfe3)] shadow-soft">
        <div className="absolute inset-1 rounded-[18px] border border-white/40" />
        <span className="relative text-lg font-bold tracking-[0.28em] text-white">QLA</span>
      </div>
      {!compact && (
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-primary">QLA Clinic</p>
          <p className="text-sm font-semibold text-foreground">Premium Care OS</p>
        </div>
      )}
    </div>
  );
}
