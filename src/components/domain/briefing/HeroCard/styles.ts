import { cva } from "class-variance-authority";

export const commuteFavoriteChipVariants = cva(
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

export const heroCardStyles = {
  root: "flex h-full min-w-0 flex-col p-4 sm:p-5",
  header: "mb-3 min-w-0",
  titleGroup: "flex min-w-0 items-center gap-2.5",
  titleIcon:
    "grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500 sm:size-9",
  title: "text-lg sm:text-xl",
  liveBadge:
    "flex shrink-0 items-center gap-1.5 text-[0.6875rem] font-semibold text-muted",
  liveDot: "size-2.5 rounded-full bg-success-500",
  content: "flex min-w-0 flex-1 flex-col",
  durationSummary:
    "flex flex-wrap items-center gap-2 text-brand-800 [&>strong]:text-3xl [&>strong]:font-extrabold [&>span]:text-xs [&>span]:font-semibold [&>span]:text-muted [&_b]:rounded-md [&_b]:bg-danger-50 [&_b]:px-1.5 [&_b]:py-0.5 [&_b]:text-danger-500",
  routePoints:
    "mt-3 space-y-1.5 text-xs text-muted [&_p]:flex [&_p]:min-w-0 [&_p]:items-center [&_p]:gap-2 [&_p]:truncate",
  commuteSkeleton: "min-w-0",
  durationSkeleton: "flex items-center gap-2",
  clockSkeleton: "size-6 rounded-full",
  minuteSkeleton: "h-8 w-20",
  delaySkeleton: "h-5 w-24",
  routeSkeletons: "mt-3 space-y-2",
  routeSkeleton: "h-3.5 w-3/5",
  routeSkeletonLong: "h-3.5 w-4/5",
  commuteEmpty:
    "flex min-h-[4.75rem] items-center rounded-xl bg-surface-subtle px-4 text-sm font-semibold leading-relaxed text-muted",
  originDot: "size-2.5 shrink-0 rounded-full bg-success-500",
  destinationDot: "size-2.5 shrink-0 rounded-full bg-danger-500",
  actions: "mt-3 grid grid-cols-2 gap-2 [&>button]:w-full",
  commuteForm:
    "grid min-w-0 gap-3 rounded-xl bg-surface-muted p-4 sm:grid-cols-2 sm:p-5 sm:[&>button]:col-span-2 [&>button]:w-full",
  mapModal: "h-[55dvh] min-h-[320px] [&>div]:h-full",
  addressField: "min-w-0",
  addressLabel: "mb-1.5 block text-xs font-bold text-muted",
  addressPicker:
    "focus-ring flex h-[3.125rem] w-full items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 text-left text-[0.9375rem] hover:border-border-strong focus:border-brand-300",
  addressValue: "min-w-0 truncate text-ink",
  addressPlaceholder: "min-w-0 truncate text-subtle",
  addressSearch: "shrink-0 text-muted",
  favoritePrompt:
    "focus-ring mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-300 px-4 py-6 text-xs font-bold text-brand-700 hover:bg-brand-50",
  favoriteList: "mt-2 flex flex-wrap gap-1.5",
  favoriteAddButton:
    "focus-ring flex items-center gap-1 rounded-full border border-dashed border-brand-300 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50",
  favoriteItem:
    "flex items-center rounded-full border border-border-subtle bg-white pr-1",
  favoriteAction:
    "focus-ring grid size-6 place-items-center rounded-full text-muted hover:bg-brand-50 hover:text-brand-700",
  favoriteDeleteAction:
    "focus-ring grid size-6 place-items-center rounded-full text-muted hover:bg-danger-50 hover:text-danger-500",
} as const;
