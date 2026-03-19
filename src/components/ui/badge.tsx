import type React from 'react';
import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
  pink: 'bg-accent text-foreground',
  green: 'bg-emerald-100 text-emerald-700',
  gold: 'bg-amber-100 text-amber-700',
  red: 'bg-rose-100 text-rose-700',
  slate: 'bg-slate-100 text-slate-700',
};

export function Badge({ children, variant = 'pink', className }: { children: React.ReactNode; variant?: keyof typeof styles; className?: string; }) {
  return <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', styles[variant], className)}>{children}</span>;
}
