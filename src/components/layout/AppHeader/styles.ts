export const appHeaderStyles = {
  header:
    "sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-xl",
  container: "mx-auto flex h-[74px] max-w-[1540px] items-center px-5 sm:px-8",
  logo: "focus-ring rounded text-2xl font-black tracking-[-0.04em] text-brand-700 italic",
  actions: "ml-auto flex items-center gap-2 sm:gap-3",
  loginLink:
    "focus-ring inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold text-ink-soft hover:bg-surface-muted",
} as const;
