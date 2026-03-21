import type React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function StatCard({ title, value, hint, icon: Icon }: { title: string; value: string; hint: string; icon: React.ElementType; }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,237,240,0.88))]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted">{title}</p>
            <h3 className="mt-3 break-words text-3xl font-semibold sm:text-[2rem]">{value}</h3>
            <p className="mt-3 flex items-center gap-1 text-xs leading-5 text-muted"><ArrowUpRight className="h-3 w-3 shrink-0 text-success" /> {hint}</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-white/90 text-primary shadow-sm"><Icon className="h-5 w-5" /></div>
        </div>
        <div className="mt-5 h-2 rounded-full bg-white/80">
          <div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#b77d8c,#d8b594)]" />
        </div>
      </Card>
    </motion.div>
  );
}
