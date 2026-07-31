export const weatherCardStyles = {
  root: "flex flex-col gap-4 p-5 sm:p-6 lg:grid lg:grid-cols-[auto_auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8 xl:col-span-2",
  weatherBody: "flex items-center gap-4",
  icon: "grid size-12 shrink-0 place-items-center rounded-2xl bg-warning-50 text-warning-500",
  content: "min-w-0 flex-1",
  summary:
    "mt-1 flex flex-wrap items-baseline gap-2 text-2xl font-extrabold tracking-[-0.04em] text-brand-800 [&>span]:text-sm [&>span]:font-semibold [&>span]:tracking-normal [&>span]:text-muted",
  loading: "mt-1 animate-pulse text-base font-bold text-brand-800",
  location: "mt-1.5 flex items-center gap-1.5 text-xs text-subtle",
  hourly:
    "flex min-w-0 snap-x gap-1 overflow-x-auto border-t border-border-subtle pt-4 lg:grid lg:grid-cols-8 lg:gap-0 lg:overflow-visible lg:border-t-0 lg:border-l lg:py-0 lg:pl-6",
  hourlyItem:
    "flex min-w-[4.5rem] snap-start flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-warning-500 lg:min-w-0",
  hourlyTime: "text-[0.6875rem] font-semibold whitespace-nowrap text-muted",
  hourlyTemperature: "text-sm text-ink",
  hourlyCondition: "text-[0.625rem] whitespace-nowrap text-subtle",
  favorites: "lg:ml-auto",
  favoritePrompt:
    "focus-ring flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-300 px-4 py-6 text-xs font-bold text-brand-700 hover:bg-brand-50",
  favoriteList:
    "flex flex-wrap gap-1.5 text-xs text-muted [&>span]:rounded-full [&>span]:bg-surface-subtle [&>span]:px-2.5 [&>span]:py-1",
} as const;
