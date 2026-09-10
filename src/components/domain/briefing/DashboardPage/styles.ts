export const dashboardPageStyles = {
  errorIcon: "text-danger-500",
  root: "min-h-screen",
  main: "mx-auto max-w-[1540px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
  briefingHeader:
    "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  briefingIntro: "flex min-w-0 items-baseline gap-2.5",
  greeting: "text-lg font-bold tracking-[-0.03em] text-ink sm:text-xl",
  date: "text-xs font-medium text-muted sm:text-sm",
  briefingActions:
    "grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:shrink-0 sm:flex-wrap sm:items-center sm:gap-3",
  featureGrid:
    "grid min-w-0 items-stretch gap-3 sm:gap-4 lg:grid-cols-3 [&>*]:min-w-0",
  secondaryGrid:
    "mt-5 grid gap-5 xl:grid-cols-[minmax(0,2.05fr)_minmax(330px,0.95fr)]",
  callout:
    "mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-brand-700 px-6 py-6 text-white sm:flex-row sm:px-8",
  calloutTitle: "font-bold",
  calloutDescription: "mt-1 text-sm text-white/70",
  calloutLink:
    "focus-ring shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-brand-700",
  state: "grid min-h-[70vh] place-items-center px-6 text-center text-brand-700",
  stateContent: "space-y-4",
  stateMessage: "font-semibold",
} as const;
