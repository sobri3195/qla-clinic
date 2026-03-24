import type React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export function StatCard({ title, value, hint, icon: Icon }: { title: string; value: string; hint: string; icon: React.ElementType }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full border-[#ede2e7] bg-[linear-gradient(170deg,#ffffff,#fff9fb)] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">{title}</p>
            <h3 className="mt-2 break-words text-[1.9rem] font-semibold leading-none text-foreground">{value}</h3>
            <p className="mt-2 text-xs leading-5 text-muted">{hint}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#ecdce3] bg-white text-primary shadow-[0_8px_16px_rgba(164,108,125,0.1)]">
            <Icon className="h-[18px] w-[18px]" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
