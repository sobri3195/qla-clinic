import type React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageShell({ title, description, actions, children, className }: { title: string; description?: string; actions?: React.ReactNode; children: React.ReactNode; className?: string; }) {
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={cn('space-y-6', className)}>
      <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur xl:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Clinic workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            {description && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-[15px]">{description}</p>}
          </div>
          {actions && <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
        </div>
      </div>
      {children}
    </motion.section>
  );
}
