export const weatherCardStyles = {
  root: "flex h-full min-h-[430px] flex-col gap-5 p-5 sm:p-6",
  weatherBody: "flex items-center gap-4",
  icon: "grid size-12 shrink-0 place-items-center rounded-2xl bg-warning-50 text-warning-500",
  content: "min-w-0 flex-1",
  summary:
    "mt-1 flex flex-wrap items-baseline gap-2 text-2xl font-extrabold tracking-[-0.04em] text-brand-800 [&>span]:text-sm [&>span]:font-semibold [&>span]:tracking-normal [&>span]:text-muted",
  loading: "mt-1 animate-pulse text-base font-bold text-brand-800",
  location: "mt-1.5 flex items-center gap-1.5 text-xs text-subtle",
  favorites: "mt-auto",
  favoritePrompt:
    "focus-ring flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-300 px-4 py-6 text-xs font-bold text-brand-700 hover:bg-brand-50",
  favoriteList:
    "flex flex-wrap gap-1.5 text-xs text-muted [&>span]:rounded-full [&>span]:bg-surface-subtle [&>span]:px-2.5 [&>span]:py-1",
} as const;
