"use client";

import React from "react";
import { Menu, X } from "lucide-react";

type MobileNavState = { open: boolean; setOpen: (open: boolean) => void };

const MobileNavContext = React.createContext<MobileNavState>({ open: false, setOpen: () => {} });

/** Shares the open/closed state of the phone sidebar drawer between the header button and the sidebar. */
export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <MobileNavContext.Provider value={{ open, setOpen }}>{children}</MobileNavContext.Provider>;
}

/**
 * Shows the sidebar as a fixed column on large screens and as a slide-in drawer on phones/tablets.
 * The drawer closes when a link inside it is tapped, when the backdrop is tapped, or with Escape.
 */
export function ResponsiveSidebar({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = React.useContext(MobileNavContext);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      <div className="hidden lg:flex h-full shrink-0">{children}</div>
      {open && (
        <div className="fixed inset-0 z-[70] flex lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div
            className="relative h-full max-w-[85vw]"
            onClickCapture={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            {children}
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="relative ml-2 mt-3 h-10 w-10 shrink-0 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </>
  );
}

/** Hamburger button for dashboard headers; hidden on large screens where the sidebar is always visible. */
export function MobileMenuButton() {
  const { setOpen } = React.useContext(MobileNavContext);
  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open menu"
      className="lg:hidden -ml-2 mr-2 p-2 rounded-lg text-primary hover:bg-slate-100 cursor-pointer shrink-0"
    >
      <Menu size={22} />
    </button>
  );
}
