import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-11 w-full rounded-2xl border border-[#ebe2e6] bg-white px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-[#9f9197] focus:border-[#d7b4c0] focus:shadow-[0_0_0_3px_rgba(183,125,140,0.12)]',
      className
    )}
    {...props}
  />
));
Input.displayName = 'Input';

export { Input };
