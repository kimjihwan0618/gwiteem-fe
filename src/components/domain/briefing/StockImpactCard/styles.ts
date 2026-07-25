import { cva } from "class-variance-authority";

export const stockChangeVariants = cva("mt-1 text-xs font-bold", {
  variants: {
    direction: {
      up: "text-danger-500",
      down: "text-brand-600",
      flat: "text-muted",
    },
  },
});

export const stockTabIndicatorVariants = cva(
  "active-motion absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-lg bg-white shadow-sm transition-[left] duration-500 ease-in-out",
  {
    variants: {
      market: {
        domestic: "left-1",
        overseas: "left-1/2",
      },
    },
  },
);

export const stockDurationIndicatorVariants = cva(
  "active-motion absolute inset-y-1 w-[calc(25%-0.125rem)] rounded-lg bg-white shadow-sm transition-[left] duration-500 ease-in-out",
  {
    variants: {
      duration: {
        realtime: "left-1",
        "1d": "left-1/4",
        "1w": "left-1/2",
        "1mo": "left-3/4",
      },
    },
  },
);

export const stockImpactCardStyles = {
  root: "h-full min-h-[430px] p-5 sm:p-6",
  header: "mb-3",
  moreButton: "focus-ring rounded-lg p-2 text-muted hover:bg-surface-subtle",
  controls: "flex flex-col items-end gap-2",
  tabs: "relative flex rounded-xl bg-surface-soft p-1",
  tab: "focus-ring relative z-10 min-w-12 rounded-lg px-3 py-1.5 text-xs font-bold text-muted transition-colors duration-300",
  activeTab:
    "focus-ring relative z-10 min-w-12 rounded-lg px-3 py-1.5 text-xs font-bold text-brand-700 transition-colors duration-300",
  durationTabs: "relative flex rounded-xl bg-surface-soft p-1",
  durationTab:
    "focus-ring relative z-10 min-w-12 rounded-lg px-2 py-1.5 text-[0.6875rem] font-bold text-muted transition-colors duration-300",
  activeDurationTab:
    "focus-ring relative z-10 min-w-12 rounded-lg px-2 py-1.5 text-[0.6875rem] font-bold text-brand-700 transition-colors duration-300",
  list: "animate-loading-in divide-y divide-border-subtle",
  item: "grid grid-cols-[1fr_auto] items-center gap-4 py-4",
  identity: "flex min-w-0 items-center gap-2",
  name: "font-bold",
  symbol:
    "rounded-md bg-surface-subtle px-1.5 py-0.5 text-[0.625rem] font-bold text-subtle",
  issue: "mt-1 line-clamp-1 text-xs text-subtle",
  metrics: "flex items-center gap-3",
  priceGroup: "min-w-[78px] text-right",
  price: "text-sm font-semibold",
  directionLabel: "ml-1 font-semibold",
  sparkline: "h-7 w-20",
  sparklineUp: "stroke-danger-500",
  sparklineDown: "stroke-brand-600",
  sparklineFlat: "stroke-muted",
  disclaimer: "mt-3 flex items-center gap-1.5 text-[0.6875rem] text-subtle",
  loading:
    "animate-loading-in flex items-center justify-center gap-2 py-12 text-center text-sm text-muted",
  loader: "animate-spin",
  emptyFavorite:
    "focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 px-4 py-12 text-sm font-bold text-brand-700 hover:bg-brand-50",
} as const;
