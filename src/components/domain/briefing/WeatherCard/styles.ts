export const weatherCardStyles = {
  root: "flex h-full min-w-0 flex-col p-4 sm:p-5",
  header: "mb-3 min-w-0",
  titleGroup: "flex min-w-0 items-center gap-2.5",
  titleIcon:
    "grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 sm:size-9",
  title: "text-lg sm:text-xl",
  content: "min-w-0",
  weatherBody: "flex min-w-0 items-center justify-between gap-3",
  summary:
    "flex flex-wrap items-baseline gap-2 text-2xl font-extrabold tracking-[-0.04em] text-brand-800 sm:text-3xl [&>span]:text-xs [&>span]:font-semibold [&>span]:tracking-normal [&>span]:text-muted",
  location:
    "flex min-w-0 items-center gap-1.5 truncate text-[0.6875rem] text-subtle",
  locationSkeleton: "h-3.5 w-28 shrink-0 rounded-full",
  hourlyFrame:
    "relative mt-4 min-w-0 overflow-hidden border-t border-border-subtle pt-4",
  skeleton: "min-w-0",
  skeletonSummary: "flex items-center gap-2",
  temperatureSkeleton: "h-8 w-24",
  conditionSkeleton: "h-4 w-10 rounded-full",
  hourlySkeleton:
    "mt-3 grid min-w-0 grid-cols-6 divide-x divide-border-subtle border-t border-border-subtle pt-3",
  hourlySkeletonItem: "flex flex-col items-center gap-1.5 px-1 py-1",
  hourSkeletonTime: "h-2.5 w-7",
  hourSkeletonIcon: "size-5 rounded-full",
  hourSkeletonTemperature: "h-3 w-6",
  hourly:
    "scrollbar-none flex w-full min-w-0 snap-x snap-mandatory overflow-x-auto scroll-smooth px-7 overscroll-x-contain",
  hourlyItem:
    "flex min-w-[4rem] flex-[0_0_calc((100%-3.5rem)/6)] snap-start flex-col items-center gap-0.5 px-0.5 py-1",
  hourlyTime: "whitespace-nowrap text-[0.625rem] font-semibold text-muted",
  hourlyTemperature: "text-xs text-ink",
  hourlyCondition: "whitespace-nowrap text-[0.5625rem] text-subtle",
  hourlyPrevious:
    "focus-ring absolute top-1/2 left-0 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-border-subtle bg-white/95 text-brand-700 shadow-sm disabled:pointer-events-none disabled:opacity-0",
  hourlyNext:
    "focus-ring absolute top-1/2 right-0 z-10 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-border-subtle bg-white/95 text-brand-700 shadow-sm disabled:pointer-events-none disabled:opacity-0",
  iconSun: "text-warning-500",
  iconCloud: "text-subtle",
  iconRain: "text-brand-500",
  iconSnow: "text-brand-400",
} as const;
