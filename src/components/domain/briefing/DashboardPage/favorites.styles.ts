import { cva } from "class-variance-authority";

export const favoritesCardStyles = {
  root: "mt-5 p-5 sm:p-7",
  limit: "text-xs text-subtle",
  grid: "grid gap-4 lg:grid-cols-3",
  section: "rounded-2xl border border-border-subtle bg-surface-muted p-4",
  sectionHeader: "mb-3 flex items-center justify-between",
  sectionTitle: "flex items-center gap-2 font-bold text-ink",
  addButton:
    "focus-ring grid size-8 place-items-center rounded-full border border-border bg-white text-brand-700 transition hover:bg-brand-50",
  list: "space-y-2",
  item: "flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 text-sm",
  routeItem:
    "grid grid-cols-[1fr_auto] gap-1 rounded-xl bg-white px-3 py-2.5 text-sm",
  form: "animate-fade-up grid gap-2 rounded-xl bg-white p-3",
  empty:
    "focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong px-3 py-6 text-sm font-semibold text-muted hover:bg-white",
  skeletonList: "space-y-2",
  skeletonItem:
    "flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5",
  skeletonLabel: "h-4 w-24",
  skeletonValue: "h-4 w-16",
} as const;

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
