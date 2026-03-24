import type React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export function StatCard({ title, value, hint, icon: Icon }: { title: string; value: string; hint: string; icon: React.ElementType; }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full border-[#efe7ea]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">{title}</p>
            <h3 className="mt-3 break-words text-[2rem] font-semibold leading-none text-foreground">{value}</h3>
            <p className="mt-3 text-xs leading-5 text-muted">{hint}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#efdee4] bg-[#fdf7f9] text-primary"><Icon className="h-5 w-5" /></div>
        </div>
      </Card>
    </motion.div>
  );
}
