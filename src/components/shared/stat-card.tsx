import type React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function StatCard({ title, value, hint, icon: Icon }: { title: string; value: string; hint: string; icon: React.ElementType; }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full bg-white/85">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted">{title}</p>
            <h3 className="mt-3 text-3xl font-semibold">{value}</h3>
            <p className="mt-3 flex items-center gap-1 text-xs text-muted"><ArrowUpRight className="h-3 w-3 text-success" /> {hint}</p>
          </div>
          <div className="rounded-2xl bg-secondary p-3 text-primary"><Icon className="h-5 w-5" /></div>
        </div>
      </Card>
    </motion.div>
  );
}
