import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn('flex min-h-[120px] w-full rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-primary', className)} {...props} />
));
Textarea.displayName = 'Textarea';

export { Textarea };
