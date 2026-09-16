export const confirmDialogStyles = {
  root: "fixed inset-0 z-[90] grid place-items-center p-4",
  backdrop: "absolute inset-0 bg-brand-900/55 backdrop-blur-sm",
  panel:
    "animate-state-in relative z-10 w-full max-w-sm rounded-card border border-border bg-white p-6 text-center shadow-2xl",
  icon: "mx-auto grid size-11 place-items-center rounded-full bg-warning-50 text-warning-500",
  title: "text-lg font-bold text-ink",
  titleWithIcon: "mt-4 text-lg font-bold text-ink",
  description: "mt-2 text-sm leading-relaxed text-muted",
  actions: "mt-6 grid grid-cols-2 gap-2",
} as const;
