export const routeMapStyles = {
  root: "relative min-h-[210px] flex-1 overflow-hidden rounded-2xl border border-border bg-surface-muted",
  legend:
    "absolute top-5 left-5 z-10 max-w-[calc(100%-2.5rem)] space-y-2 rounded-xl bg-white/90 px-4 py-3 text-sm shadow-sm backdrop-blur",
  origin: "flex items-center gap-2 font-semibold",
  originIcon: "text-success-500",
  destination: "flex items-center gap-2 text-muted",
  destinationIcon: "text-danger-500",
  map: "absolute inset-0 h-full w-full",
  mapState:
    "animate-pulse absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-muted text-sm font-semibold text-muted",
  mapError:
    "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-danger-50 px-5 text-center text-sm font-semibold text-danger-700",
} as const;
