import type React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PageShell({ title, description, actions, children, className }: { title: string; description?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={cn('space-y-6', className)}>
      <div className="overflow-hidden rounded-[24px] border border-[#eee3e8] bg-white/85 p-5 shadow-[0_10px_28px_rgba(71,45,52,0.06)] backdrop-blur sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>}
          </div>
          {actions && <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}
