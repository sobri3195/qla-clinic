import { Children, cloneElement, createContext, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  const context = useMemo(() => ({ value, setValue }), [value]);
  return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>;
}

export function TabsList({ className, ...props }) {
  return <div className={cn('inline-flex rounded-2xl bg-secondary p-1', className)} {...props} />;
}

export function TabsTrigger({ value, className, children, ...props }) {
  const context = useContext(TabsContext);
  const active = context?.value === value;
  return <button className={cn('rounded-2xl px-4 py-2 text-sm text-muted', active && 'bg-white text-foreground shadow', className)} onClick={() => context?.setValue(value)} {...props}>{children}</button>;
}

export function TabsContent({ value, className, children, ...props }) {
  const context = useContext(TabsContext);
  if (context?.value !== value) return null;
  return <div className={cn('mt-6 outline-none', className)} {...props}>{children}</div>;
}
