export const profileMenuStyles = {
  root: "relative",
  trigger:
    "focus-ring flex items-center gap-2 rounded-full border border-transparent p-1 pr-2 hover:border-border hover:bg-surface-muted",
  userName: "hidden text-sm font-bold text-ink-soft md:inline",
  chevron: "hidden text-subtle md:block",
  panel:
    "animate-state-in absolute top-[54px] right-0 z-50 w-[260px] origin-top-right overflow-hidden rounded-card border border-border bg-white p-2 shadow-2xl",
  identity: "flex items-center gap-3 border-b border-border-subtle px-3 py-3",
  identityText: "min-w-0",
  name: "font-bold text-ink",
  email: "truncate text-xs text-subtle",
  actions: "py-2",
  action:
    "focus-ring flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-surface-muted",
  logout:
    "focus-ring flex w-full items-center gap-3 rounded-lg border-t border-border-subtle px-3 py-3 text-sm font-semibold text-danger-700 hover:bg-danger-50",
  avatarImage: "h-10 w-10 rounded-full object-cover",
  avatarFallback:
    "grid h-10 w-10 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white",
} as const;
