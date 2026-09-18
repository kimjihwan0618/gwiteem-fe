import { cva } from "class-variance-authority";

export const favoriteModalStyles = {
  layer: "fixed inset-0 z-[70] grid place-items-center p-4",
  backdrop: "absolute inset-0 bg-brand-900/45 backdrop-blur-sm",
  panel:
    "animate-state-in relative z-10 w-full max-w-xl rounded-card border border-border bg-white p-5 shadow-2xl sm:p-7",
  header: "mb-5 flex items-center justify-between",
  title: "text-xl font-bold",
  close: "focus-ring rounded-lg p-2 text-muted hover:bg-surface-muted",
  search: "grid grid-cols-[1fr_auto] gap-2",
  results: "mt-4 max-h-80 space-y-2 overflow-y-auto",
  result:
    "focus-ring flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-left hover:bg-surface-muted disabled:opacity-50",
  resultIdentity: "flex min-w-0 items-center gap-3",
  rank: "grid size-7 shrink-0 place-items-center rounded-full bg-brand-50 text-xs text-brand-700",
  resultSkeleton: "h-14 w-full rounded-xl",
  stockSections: "mt-4 grid gap-6",
  searchEmpty:
    "rounded-xl bg-surface-muted px-4 py-5 text-center text-sm text-muted",
  sectionHeader: "flex items-center justify-between gap-3",
  sectionTitle: "text-sm font-bold text-ink",
  marketTabs: "flex rounded-lg bg-surface-muted p-1",
  form: "grid gap-3",
  addressField: "grid gap-1.5",
  addressLabel: "text-xs font-semibold text-muted",
  addressPicker:
    "focus-ring flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 text-left text-sm text-ink hover:bg-surface-muted",
} as const;

export const favoriteMarketTabVariants = cva(
  "focus-ring rounded-md px-4 py-1.5 text-xs font-semibold transition",
  {
    variants: {
      isActive: {
        true: "bg-white text-brand-700 shadow-sm",
        false: "text-muted hover:text-ink",
      },
    },
    defaultVariants: { isActive: false },
  },
);
