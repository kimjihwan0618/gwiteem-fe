export const prioritiesCardStyles = {
  root: "p-5 sm:p-7",
  title: "flex items-center gap-2",
  titleIcon: "text-brand-600",
  list: "space-y-2.5",
  item: "group flex items-center gap-3 rounded-xl border border-border px-3 py-3 transition hover:border-border-strong hover:bg-surface-muted sm:px-4",
  index:
    "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-subtle text-xs font-bold text-muted",
  icon: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700",
  text: "min-w-0 flex-1 text-sm leading-6 font-semibold sm:text-[0.9375rem]",
} as const;
