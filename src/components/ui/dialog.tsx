export function Dialog({ children }) { return <>{children}</>; }
export function DialogTrigger({ children }) { return <>{children}</>; }
export function DialogClose({ children }) { return <>{children}</>; }
export function DialogContent({ className = '', children }) { return <div className={`rounded-[28px] border border-white/70 bg-white p-6 shadow-soft ${className}`}>{children}</div>; }
export function DialogHeader({ className = '', ...props }) { return <div className={`mb-5 space-y-1 ${className}`} {...props} />; }
export function DialogTitle({ className = '', ...props }) { return <h3 className={`text-xl font-semibold ${className}`} {...props} />; }
export function DialogDescription({ className = '', ...props }) { return <p className={`text-sm text-muted ${className}`} {...props} />; }
