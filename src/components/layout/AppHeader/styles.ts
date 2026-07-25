import { cva } from "class-variance-authority";

export const desktopNavItemVariants = cva(
  "focus-ring relative z-10 flex h-full w-28 items-center justify-center text-[0.9375rem] font-semibold transition-colors duration-300",
  {
    variants: {
      active: {
        true: "text-brand-700",
        false: "text-muted hover:text-ink-soft",
      },
    },
  },
);

export const desktopActiveIndicatorVariants = cva(
  "active-motion absolute bottom-0 h-0.5 w-20 rounded-full bg-brand-700 transition-[left] duration-500 ease-in-out",
  {
    variants: {
      position: {
        0: "left-[1rem]",
        1: "left-[8rem]",
        2: "left-[15rem]",
        3: "left-[22rem]",
      },
    },
    defaultVariants: { position: 0 },
  },
);

export const mobileNavItemVariants = cva(
  "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-colors duration-300",
  {
    variants: {
      active: {
        true: "animate-state-in bg-brand-50 text-brand-700",
        false: "text-muted",
      },
    },
  },
);

export const appHeaderStyles = {
  header:
    "sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-xl",
  container:
    "mx-auto flex h-[74px] max-w-[1540px] items-center gap-7 px-5 sm:px-8",
  menuButton: "focus-ring rounded-lg p-2 lg:hidden",
  logo: "focus-ring rounded text-2xl font-black tracking-[-0.04em] text-brand-700 italic",
  desktopNav: "relative hidden h-full items-center lg:flex",
  actions: "ml-auto flex items-center gap-2 sm:gap-3",
  loginLink:
    "focus-ring inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-ink-soft hover:bg-surface-muted",
  signUpLink:
    "focus-ring inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800",
  mobileLayer: "fixed inset-0 z-50 lg:hidden",
  mobileBackdrop: "animate-fade-up absolute inset-0 bg-brand-900/40",
  mobilePanel:
    "animate-state-in relative h-full w-[290px] bg-white p-6 shadow-2xl",
  mobileHeader: "mb-9 flex items-center justify-between",
  mobileLogo: "text-2xl font-black text-brand-700 italic",
  closeButton: "focus-ring rounded-lg p-2",
  mobileNav: "space-y-2",
  mobileAuthActions: "mt-4 space-y-2 border-t border-border pt-4",
  mobileLogin:
    "flex items-center gap-3 rounded-xl border border-border px-4 py-3 font-semibold text-ink-soft",
  mobileSignUp:
    "flex items-center gap-3 rounded-xl bg-brand-700 px-4 py-3 font-bold text-white",
} as const;
