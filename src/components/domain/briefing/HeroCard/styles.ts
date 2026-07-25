export const heroCardStyles = {
  root: "flex h-full min-h-[430px] flex-col gap-5 p-5 sm:p-6",
  content: "flex flex-1 flex-col",
  badges: "flex flex-wrap items-center gap-2",
  headline:
    "mt-7 text-[2rem] leading-[1.18] font-extrabold tracking-[-0.055em] text-brand-800 sm:text-[2.5rem]",
  headlineBreak: "hidden sm:block",
  guestHeadline:
    "mt-6 text-2xl leading-tight font-extrabold tracking-[-0.04em] text-brand-800",
  commuteForm: "mt-4 grid gap-3",
  addressField: "min-w-0",
  addressLabel: "mb-1.5 block text-xs font-bold text-muted",
  addressPicker:
    "focus-ring flex h-[3.125rem] w-full items-center justify-between gap-3 rounded-xl border border-border bg-white px-4 text-left text-[0.9375rem] hover:border-border-strong focus:border-brand-300",
  addressValue: "min-w-0 truncate text-ink",
  addressPlaceholder: "min-w-0 truncate text-subtle",
  addressSearch: "shrink-0 text-muted",
  reason: "mt-3 leading-7 text-muted",
  favoritePrompt:
    "focus-ring mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-300 px-4 py-6 text-xs font-bold text-brand-700 hover:bg-brand-50",
  favoriteList:
    "mt-2 flex flex-wrap gap-1.5 text-xs text-muted [&>span]:rounded-full [&>span]:bg-surface-subtle [&>span]:px-2.5 [&>span]:py-1",
} as const;
