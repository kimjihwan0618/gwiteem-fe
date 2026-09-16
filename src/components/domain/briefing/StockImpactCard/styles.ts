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

export const stockFavoriteChipVariants = cva(
  "focus-ring rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      isActive: {
        true: "bg-brand-700 text-white",
        false:
          "bg-surface-subtle text-muted hover:bg-brand-50 hover:text-brand-700",
      },
    },
  },
);

export const stockImpactCardStyles = {
  root: "flex h-full min-w-0 flex-col p-4 sm:p-5",
  header: "mb-2 min-w-0",
  titleGroup: "flex min-w-0 items-center gap-2.5",
  titleIcon:
    "grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500 sm:size-9",
  title: "text-lg sm:text-xl",
  expandButton:
    "focus-ring flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-50",
  moreButton: "focus-ring rounded-lg p-2 text-muted hover:bg-surface-subtle",
  headerAddButton:
    "focus-ring flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50",
  controls: "mb-2 flex w-full min-w-0 flex-col gap-2",
  summaryMarketTabs:
    "mb-2 grid w-36 grid-cols-2 rounded-lg bg-surface-subtle p-1",
  summaryMarketTab:
    "focus-ring rounded-md px-2 py-1 text-[0.6875rem] font-bold text-muted",
  activeSummaryMarketTab:
    "focus-ring rounded-md bg-white px-2 py-1 text-[0.6875rem] font-bold text-brand-700 shadow-sm",
  tabs: "grid w-full grid-cols-2 rounded-xl bg-surface-subtle p-1 sm:w-56",
  tab: "focus-ring rounded-lg px-3 py-1.5 text-xs font-bold text-muted transition-all duration-200 disabled:cursor-wait disabled:opacity-60",
  activeTab:
    "focus-ring rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-brand-700 shadow-sm transition-all duration-200 disabled:cursor-wait disabled:opacity-60",
  durationTabs:
    "grid w-full grid-cols-4 rounded-xl bg-surface-subtle p-1 sm:w-80",
  durationTab:
    "focus-ring rounded-lg px-2 py-1.5 text-[0.6875rem] font-bold text-muted transition-all duration-200 disabled:cursor-wait disabled:opacity-60",
  activeDurationTab:
    "focus-ring rounded-lg bg-white px-2 py-1.5 text-[0.6875rem] font-bold text-brand-700 shadow-sm transition-all duration-200 disabled:cursor-wait disabled:opacity-60",
  body: "relative flex min-h-0 flex-1 flex-col overflow-hidden",
  favoriteList: "mt-2 flex flex-wrap gap-1.5",
  favoriteAddButton:
    "focus-ring flex items-center gap-1 rounded-full border border-dashed border-brand-300 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50",
  list: "animate-loading-in divide-y divide-border-subtle",
  modalList:
    "animate-loading-in max-h-[52dvh] divide-y divide-border-subtle overflow-y-auto rounded-xl border border-border-subtle px-2",
  skeletonList: "divide-y divide-border-subtle",
  modalSkeletonList:
    "max-h-[52dvh] divide-y divide-border-subtle overflow-hidden rounded-xl border border-border-subtle px-2",
  skeletonRow:
    "grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-1.5 px-1 py-2 sm:grid-cols-[1.75rem_minmax(0,1fr)_5rem_auto] sm:gap-2 sm:px-2",
  rankSkeleton: "size-7 rounded-full",
  identitySkeleton: "flex min-w-0 items-center gap-2",
  nameSkeleton: "h-4 w-20 sm:w-24",
  symbolSkeleton: "h-4 w-10",
  chartSkeleton: "hidden h-6 w-16 sm:block xl:w-20",
  priceSkeletonGroup: "flex flex-col items-end gap-1",
  priceSkeleton: "h-3.5 w-16 sm:w-20",
  changeSkeleton: "h-2.5 w-12",
  modalState:
    "flex min-h-64 items-center justify-center gap-2 rounded-xl border border-border-subtle bg-surface-subtle px-4 text-center text-sm font-semibold text-muted",
  modalError:
    "flex min-h-64 items-center justify-center gap-2 rounded-xl bg-danger-50 px-4 text-center text-sm font-semibold text-danger-700",
  item: "focus-ring grid w-full grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-1.5 rounded-xl px-1 py-2 text-left transition-colors duration-200 hover:bg-surface-subtle sm:gap-2 sm:px-2",
  favoriteItem:
    "focus-ring grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl px-2 py-2.5 text-left transition-colors duration-200 hover:bg-surface-subtle",
  rank: "flex size-7 items-center justify-center rounded-full bg-brand-50 text-xs font-black text-brand-700",
  stockSummary: "min-w-0",
  identity: "flex min-w-0 items-center gap-2",
  name: "truncate font-bold",
  symbol:
    "rounded-md bg-surface-subtle px-1.5 py-0.5 text-[0.625rem] font-bold text-subtle",
  issue: "hidden",
  metrics: "flex min-w-0 items-center gap-2 sm:gap-3",
  priceGroup: "min-w-[68px] text-right sm:min-w-[78px]",
  price: "text-xs font-semibold sm:text-sm",
  directionLabel: "ml-1 font-semibold",
  sparkline: "hidden h-6 w-16 sm:block xl:w-20",
  sparklineUp: "stroke-stock-up",
  sparklineDown: "stroke-stock-down",
  sparklineFlat: "stroke-muted",
  chartOverlay:
    "animate-loading-in relative z-20 flex min-h-[280px] flex-col rounded-xl bg-white p-1",
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
  error:
    "flex items-center justify-center gap-2 rounded-xl bg-danger-50 px-4 py-12 text-sm font-semibold text-danger-700",
  empty:
    "flex items-center justify-center rounded-xl bg-surface-subtle px-4 py-12 text-sm text-muted",
  emptyFavorite:
    "focus-ring flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 px-4 py-12 text-sm font-bold text-brand-700 hover:bg-brand-50",
} as const;
