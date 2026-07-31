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
        "1d": "left-1",
        "1w": "left-1/4",
        "1mo": "left-1/2",
        "1y": "left-3/4",
      },
    },
  },
);

export const stockImpactCardStyles = {
  root: "flex h-full min-h-[430px] flex-col p-5 sm:p-6",
  header: "mb-3",
  moreButton: "focus-ring rounded-lg p-2 text-muted hover:bg-surface-subtle",
  controls: "flex flex-col items-end gap-2",
  tabs: "relative flex rounded-xl bg-surface-soft p-1",
  tab: "focus-ring relative z-10 min-w-12 rounded-lg px-3 py-1.5 text-xs font-bold text-muted transition-colors duration-300 disabled:cursor-wait disabled:opacity-60",
  activeTab:
    "focus-ring relative z-10 min-w-12 rounded-lg px-3 py-1.5 text-xs font-bold text-brand-700 transition-colors duration-300 disabled:cursor-wait disabled:opacity-60",
  durationTabs: "relative flex rounded-xl bg-surface-soft p-1",
  durationTab:
    "focus-ring relative z-10 min-w-12 rounded-lg px-2 py-1.5 text-[0.6875rem] font-bold text-muted transition-colors duration-300 disabled:cursor-wait disabled:opacity-60",
  activeDurationTab:
    "focus-ring relative z-10 min-w-12 rounded-lg px-2 py-1.5 text-[0.6875rem] font-bold text-brand-700 transition-colors duration-300 disabled:cursor-wait disabled:opacity-60",
  body: "relative flex min-h-0 flex-1 flex-col overflow-hidden",
  list: "animate-loading-in divide-y divide-border-subtle",
  item: "focus-ring grid w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl px-2 py-2.5 text-left transition-colors duration-200 hover:bg-surface-subtle",
  rank: "flex size-7 items-center justify-center rounded-full bg-brand-50 text-xs font-black text-brand-700",
  stockSummary: "min-w-0",
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
  sparklineUp: "stroke-stock-up",
  sparklineDown: "stroke-stock-down",
  sparklineFlat: "stroke-muted",
  chartOverlay:
    "animate-loading-in absolute inset-0 z-20 flex flex-col rounded-xl bg-white p-1",
  chartEmpty:
    "flex flex-1 items-center justify-center rounded-xl bg-surface-subtle px-4 py-8 text-center text-xs text-muted",
  chartHeader: "mb-3 flex items-start justify-between gap-4",
  chartIdentity: "flex items-center gap-2",
  chartRank:
    "flex size-6 items-center justify-center rounded-full bg-brand-50 text-[0.6875rem] font-black text-brand-700",
  chartTitle: "text-sm font-bold text-ink",
  chartPeriod: "mt-0.5 text-[0.6875rem] text-subtle",
  backButton:
    "focus-ring flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50",
  chart: "min-h-0 w-full flex-1 overflow-visible",
  chartGuide: "stroke-border-subtle [stroke-dasharray:4_4]",
  chartAxisGutter: "fill-surface-muted",
  chartSectionDivider: "stroke-border-strong",
  chartAxisText: "fill-muted text-[0.5rem] font-semibold",
  chartAxisTitle: "fill-subtle text-[0.5625rem] font-bold",
  chartTimeTitle: "fill-ink-soft text-[0.5625rem] font-bold",
  candleUp: "fill-stock-up stroke-stock-up",
  candleDown: "fill-stock-down stroke-stock-down",
  volumeUp: "fill-stock-up-soft",
  volumeDown: "fill-stock-down-soft",
  movingAverage5: "stroke-warning-500",
  movingAverage20: "stroke-success-500",
  movingAverage5Label: "fill-warning-500 text-[0.5rem] font-bold",
  movingAverage20Label: "fill-success-500 text-[0.5rem] font-bold",
  disclaimer:
    "mt-3 flex shrink-0 items-center gap-1.5 border-t border-border-subtle pt-3 text-[0.6875rem] text-subtle",
  loading:
    "animate-loading-in flex items-center justify-center py-12 text-muted",
  loadingOverlay:
    "absolute inset-0 z-30 flex items-center justify-center rounded-xl bg-white/90 text-muted backdrop-blur-[1px]",
  loadingLabel: "sr-only",
  loader: "animate-spin",
  emptyFavorite:
    "focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 px-4 py-12 text-sm font-bold text-brand-700 hover:bg-brand-50",
} as const;
