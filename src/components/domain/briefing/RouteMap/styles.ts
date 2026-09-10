export const routeMapStyles = {
  root: "relative min-h-[180px] flex-1 overflow-hidden rounded-xl border border-border bg-surface-muted sm:min-h-[230px] sm:rounded-2xl fullscreen:rounded-none fullscreen:border-0",
  legend:
    "absolute top-3 left-3 z-10 max-w-[calc(100%-4.5rem)] space-y-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur sm:top-5 sm:left-5 sm:max-w-[calc(100%-2.5rem)] sm:space-y-2 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm",
  origin: "flex items-center gap-2 font-semibold",
  originIcon: "text-success-500",
  destination: "flex items-center gap-2 text-muted",
  destinationIcon: "text-danger-500",
  map: "absolute inset-0 h-full w-full",
  currentLocationButton:
    "focus-ring absolute right-3 bottom-3 z-10 grid size-9 place-items-center rounded-full border border-border bg-white text-brand-700 shadow-md hover:bg-brand-50 disabled:cursor-wait sm:right-4 sm:bottom-4 sm:size-10",
  fullscreenButton:
    "focus-ring absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full border border-border bg-white text-brand-700 shadow-md hover:bg-brand-50 sm:top-4 sm:right-4 sm:size-10",
  locationLoader: "animate-spin",
  locationError:
    "absolute right-4 bottom-16 z-10 rounded-lg bg-white/95 px-3 py-2 text-xs font-semibold text-danger-700 shadow-sm",
  routeLoading:
    "absolute inset-0 z-30 flex flex-col justify-end gap-3 bg-white/90 p-4 backdrop-blur-[1px]",
  routeLoadingSkeleton: "absolute inset-0 size-full rounded-none",
  routeLoadingDetails:
    "relative z-10 space-y-2 rounded-xl bg-white/90 p-3 shadow-sm",
  routeLoadingTitle: "h-4 w-28",
  routeLoadingLine: "h-3 w-3/4",
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
    "absolute inset-0 flex flex-col justify-end gap-3 overflow-hidden bg-surface-muted p-4",
  mapSkeleton: "absolute inset-0 size-full rounded-none",
  mapSkeletonBadge:
    "relative z-10 space-y-2 rounded-xl bg-white/90 p-3 shadow-sm",
  mapSkeletonTitle: "h-4 w-28",
  mapSkeletonLine: "h-3 w-3/4",
  mapError:
    "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-danger-50 px-5 text-center text-sm font-semibold text-danger-700",
} as const;
