export const editorialStyles = {
  calendarToggle:
    "focus-ring flex min-h-11 w-full items-center justify-between gap-2 rounded-sm border border-border-strong px-3 font-editorial text-sm font-bold lg:hidden",
  calendarBody: "hidden lg:block",
  calendarBodyOpen: "animate-state-in mt-5 block lg:mt-0",
  hero: "grid border-b border-border-strong lg:grid-cols-[minmax(0,1fr)_19rem]",
  calendar:
    "border-t border-border px-3 py-7 sm:px-6 lg:border-t-0 lg:border-l lg:py-6",
  calendarHeading:
    "mb-5 flex items-center justify-between gap-3 font-editorial text-xl font-bold",
  monthButton:
    "grid size-9 place-items-center rounded-sm text-muted disabled:cursor-not-allowed disabled:opacity-35",
  calendarGrid: "mx-auto grid max-w-sm grid-cols-7 gap-y-1 text-center",
  weekday: "py-2 text-xs font-semibold text-muted",
  day: "focus-ring mx-auto grid size-8 place-items-center rounded-full text-sm tabular-nums transition-colors disabled:cursor-not-allowed disabled:text-faint",
  today: "bg-brand-700 text-white disabled:text-white",
  calendarNote: "mt-5 text-center text-xs leading-relaxed text-muted",
  categories:
    "flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border-strong py-4",
  category:
    "focus-ring relative border-b-2 border-transparent py-2 text-sm font-bold text-muted transition-colors hover:text-brand-700",
  categoryActive: "border-brand-700 text-brand-700",
  categoryCreate: "ml-auto",
  listHeader: "flex flex-wrap items-end justify-between gap-4 pt-8 pb-4",
  listHeading: "font-editorial text-2xl font-bold tracking-tight sm:text-3xl",
  listNumber: "font-sans text-xs font-normal text-muted",
  titleLink:
    "focus-ring block min-w-0 text-left font-editorial text-xl leading-relaxed font-bold break-words transition-colors hover:text-brand-700 sm:text-2xl",
  row: "grid gap-3 border-b border-border py-5 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5",
  rowCategory: "text-xs font-semibold text-brand-700",
  rowActions: "flex flex-wrap items-center gap-2 text-xs text-muted",
  rowOpen:
    "focus-ring inline-flex items-center gap-2 py-2 text-xs font-semibold text-ink transition-colors hover:text-brand-700",
  introTitle: "font-editorial text-xl font-bold",
} as const;
