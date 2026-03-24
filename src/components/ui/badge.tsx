import type React from 'react';
import { cn } from '@/lib/utils';

const styles: Record<string, string> = {
  pink: 'border border-[#efd9e0] bg-[#fff3f6] text-[#8c5f6c]',
  green: 'border border-[#d8eadf] bg-[#effaf4] text-[#3f7d5c]',
  gold: 'border border-[#f2e2c7] bg-[#fff7e8] text-[#9a7341]',
  red: 'border border-[#f1d4db] bg-[#fff1f4] text-[#9b4f60]',
  slate: 'border border-[#e4e4eb] bg-[#f7f8fb] text-[#61667a]',
};

export function Badge({ children, variant = 'pink', className }: { children: React.ReactNode; variant?: keyof typeof styles; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', styles[variant], className)}>{children}</span>;
}
