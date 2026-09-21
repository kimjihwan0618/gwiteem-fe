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
  guestContent: "flex min-w-0 flex-1 flex-col justify-center py-1 sm:py-2",
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
  actions: "mt-auto grid grid-cols-2 gap-2 pt-3 [&>button]:w-full",
  guestActions: "mt-4 grid grid-cols-2 gap-2 [&>button]:w-full",
  favoriteMapAction: "mt-3 [&>button]:w-full",
  commuteForm:
    "grid min-w-0 gap-3 rounded-xl bg-surface-muted p-4 sm:grid-cols-2 sm:p-5 sm:[&>button]:col-span-2 [&>button]:w-full",
  routeDetail: "grid gap-4",
  routeMetrics:
    "grid grid-cols-2 gap-2 [&>div]:grid [&>div]:grid-cols-[auto_1fr] [&>div]:items-center [&>div]:gap-x-2 [&>div]:rounded-xl [&>div]:bg-surface-muted [&>div]:p-3 [&_svg]:row-span-2 [&_svg]:text-brand-600 [&_span]:text-xs [&_span]:text-muted [&_strong]:text-sm [&_strong]:text-ink",
  mapModal: "h-[44dvh] min-h-[280px] [&>div]:h-full",
  routeSteps:
    "grid max-h-52 gap-1 overflow-y-auto rounded-xl border border-border-subtle p-2 [&_li]:grid [&_li]:grid-cols-[1.5rem_1fr_auto] [&_li]:items-center [&_li]:gap-2 [&_li]:rounded-lg [&_li]:px-2 [&_li]:py-2 [&_li>span]:grid [&_li>span]:size-6 [&_li>span]:place-items-center [&_li>span]:rounded-full [&_li>span]:bg-brand-50 [&_li>span]:text-xs [&_li>span]:font-bold [&_li>span]:text-brand-700 [&_p]:text-sm [&_p]:font-medium [&_small]:text-xs [&_small]:text-muted",
  addressField: "min-w-0",
  addressLabel: "mb-1.5 block text-xs font-bold text-muted",
  addressPicker:
    "focus-ring flex h-[3.125rem] w-full items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 text-left text-[0.9375rem] hover:border-border-strong focus:border-brand-300",
  addressValue: "min-w-0 truncate text-ink",
  addressPlaceholder: "min-w-0 truncate text-subtle",
  addressSearch: "shrink-0 text-muted",
  favoriteSection: "mt-auto border-t border-border-subtle pt-3",
  favoriteHeader: "flex items-center justify-between gap-3",
  favoriteTitle: "text-xs font-bold text-muted",
  favoriteList: "mt-2 flex flex-wrap gap-2",
  favoriteEmpty:
    "mt-2 rounded-xl bg-surface-subtle px-3 py-3 text-xs text-muted",
  favoriteAddButton:
    "focus-ring flex items-center gap-1 rounded-full border border-dashed border-brand-300 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50",
  favoriteItem:
    "relative flex items-center rounded-full border border-border-subtle bg-white pr-1",
  favoriteMenu: "relative",
  favoriteMenuTrigger:
    "focus-ring grid size-6 place-items-center rounded-full text-muted hover:bg-surface-muted",
  favoriteMenuItems:
    "absolute right-0 z-20 mt-1 grid min-w-24 overflow-hidden rounded-xl border border-border bg-white p-1 shadow-lg",
  favoriteMenuItem:
    "focus-ring flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-ink hover:bg-surface-muted",
  favoriteMenuDelete:
    "focus-ring flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-danger-500 hover:bg-danger-50",
} as const;
