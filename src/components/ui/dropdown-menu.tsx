import { createContext, useContext, useEffect, useRef, useState } from 'react';

const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return <DropdownContext.Provider value={{ open, setOpen, ref }}>{children}</DropdownContext.Provider>;
}

export function DropdownMenuTrigger({ asChild, children }) {
  const { open, setOpen, ref } = useContext(DropdownContext);
  if (asChild && children) {
    return <div ref={ref} onClick={() => setOpen(!open)}>{children}</div>;
  }
  return <button ref={ref} onClick={() => setOpen(!open)}>{children}</button>;
}

export function DropdownMenuContent({ children, className = '' }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;
  return <div className={`absolute right-0 top-full z-50 mt-2 min-w-48 rounded-2xl border border-border bg-white p-2 shadow-soft ${className}`}>{children}</div>;
}

export function DropdownMenuItem({ children, className = '', onClick }) {
  const { setOpen } = useContext(DropdownContext);
  return <button className={`flex w-full cursor-pointer items-center rounded-xl px-3 py-2 text-left text-sm outline-none hover:bg-secondary ${className}`} onClick={() => { onClick?.(); setOpen(false); }}>{children}</button>;
}
