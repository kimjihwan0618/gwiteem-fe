export const routeMapStyles = {
  root: "relative min-h-[210px] flex-1 overflow-hidden rounded-2xl border border-border bg-surface-muted fullscreen:rounded-none fullscreen:border-0",
  legend:
    "absolute top-5 left-5 z-10 max-w-[calc(100%-2.5rem)] space-y-2 rounded-xl bg-white/90 px-4 py-3 text-sm shadow-sm backdrop-blur",
  origin: "flex items-center gap-2 font-semibold",
  originIcon: "text-success-500",
  destination: "flex items-center gap-2 text-muted",
  destinationIcon: "text-danger-500",
  map: "absolute inset-0 h-full w-full",
  currentLocationButton:
    "focus-ring absolute right-4 bottom-4 z-10 grid size-10 place-items-center rounded-full border border-border bg-white text-brand-700 shadow-md hover:bg-brand-50 disabled:cursor-wait",
  fullscreenButton:
    "focus-ring absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full border border-border bg-white text-brand-700 shadow-md hover:bg-brand-50",
  locationLoader: "animate-spin",
  locationError:
    "absolute right-4 bottom-16 z-10 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-danger-700 shadow-sm",
  routeLoading:
    "absolute inset-0 z-30 grid place-items-center bg-white/85 backdrop-blur-[1px]",
  routeLoadingIcon: "animate-spin text-brand-700",
  routeLoadingLabel: "sr-only",
  marker: {
    origin:
      "relative rounded-full border-2 border-white bg-success-500 px-2.5 py-1 text-[0.6875rem] font-black whitespace-nowrap text-white shadow-md after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-x-transparent after:border-b-transparent after:border-t-success-500",
    destination:
      "relative rounded-full border-2 border-white bg-danger-500 px-2.5 py-1 text-[0.6875rem] font-black whitespace-nowrap text-white shadow-md after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-x-transparent after:border-b-transparent after:border-t-danger-500",
    current:
      "relative rounded-full border-2 border-white bg-brand-600 px-2.5 py-1 text-[0.6875rem] font-black whitespace-nowrap text-white shadow-md ring-4 ring-brand-200/70 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-x-transparent after:border-b-transparent after:border-t-brand-600",
  },
  mapState:
    "animate-pulse absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-muted text-sm font-semibold text-muted",
  mapError:
    "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-danger-50 px-5 text-center text-sm font-semibold text-danger-700",
} as const;
