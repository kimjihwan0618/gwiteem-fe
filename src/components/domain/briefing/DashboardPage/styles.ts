export const dashboardPageStyles = {
  errorIcon: "text-danger-500",
  root: "min-h-screen",
  main: "mx-auto max-w-[1540px] px-4 py-5 sm:px-8 sm:py-8",
  briefingHeader:
    "mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
  briefingIntro: "min-w-0",
  greeting: "text-2xl font-bold tracking-[-0.04em] text-ink sm:text-3xl",
  date: "mt-1.5 text-sm font-medium text-muted",
  briefingActions: "flex shrink-0 flex-wrap items-center gap-3",
  featureGrid: "grid items-stretch gap-5 xl:grid-cols-3",
  secondaryGrid:
    "mt-5 grid gap-5 xl:grid-cols-[minmax(0,2.05fr)_minmax(330px,0.95fr)]",
  callout:
    "mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-brand-700 px-6 py-6 text-white sm:flex-row sm:px-8",
  calloutTitle: "font-bold",
  calloutDescription: "mt-1 text-sm text-white/70",
  calloutLink:
    "focus-ring shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-brand-700",
  statusBar: "mb-5 flex flex-wrap items-center justify-between gap-3",
  updatedAt: "flex items-center gap-2 text-sm text-muted",
  liveStatus:
    "flex items-center gap-2 rounded-full bg-success-50 px-3 py-1.5 text-xs font-bold text-success-700",
  liveDot: "h-2 w-2 rounded-full bg-success-500",
  state: "grid min-h-[70vh] place-items-center px-6 text-center text-brand-700",
  stateContent: "space-y-4",
  stateMessage: "font-semibold",
} as const;
