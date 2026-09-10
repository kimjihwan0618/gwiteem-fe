export const detailModalStyles = {
  root: "fixed inset-0 z-[70] grid place-items-center p-3 sm:p-6",
  backdrop: "absolute inset-0 bg-brand-900/55 backdrop-blur-sm",
  panel:
    "animate-state-in relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[960px] flex-col overflow-hidden rounded-card border border-border bg-white shadow-card sm:max-h-[calc(100dvh-3rem)]",
  header:
    "flex shrink-0 items-center justify-between gap-4 border-b border-border-subtle px-4 py-3 sm:px-6 sm:py-4",
  titleGroup: "flex min-w-0 items-center gap-2.5",
  icon: "grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-500",
  title: "truncate text-xl font-bold tracking-[-0.03em] text-ink",
  close:
    "focus-ring grid size-9 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-subtle",
  body: "min-h-0 overflow-y-auto p-4 sm:p-6",
} as const;
