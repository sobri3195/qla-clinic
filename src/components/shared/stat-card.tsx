import type React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export function StatCard({ title, value, hint, icon: Icon }: { title: string; value: string; hint: string; icon: React.ElementType; }) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted">{title}</p>
            <h3 className="mt-2 break-words text-3xl font-semibold sm:text-[2rem]">{value}</h3>
            <p className="mt-2 text-xs leading-5 text-muted">{hint}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary"><Icon className="h-5 w-5" /></div>
        </div>
      </Card>
    </motion.div>
  );
}
