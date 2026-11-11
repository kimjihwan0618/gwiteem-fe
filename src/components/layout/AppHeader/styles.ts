export const appHeaderStyles = {
  header: "border-b border-border-strong bg-canvas",
  container:
    "mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-5 gap-y-4 px-5 py-6 sm:px-8 lg:px-10 lg:py-8",
  logo: "focus-ring shrink-0 rounded-sm",
  date: "flex-1 text-center font-editorial text-xs font-bold sm:text-sm lg:text-base",
  nav: "order-last flex w-full items-center justify-center gap-8 border-t border-border pt-4 sm:order-none sm:ml-auto sm:w-auto sm:border-0 sm:pt-0",
  navLink:
    "focus-ring whitespace-nowrap py-2 text-sm font-bold underline-offset-8 transition-colors hover:text-brand-700 hover:underline",
  actions: "ml-auto flex items-center gap-2 sm:gap-3",
  loginLink:
    "focus-ring inline-flex min-h-10 items-center gap-2 rounded-sm border border-border-strong px-4 text-sm font-semibold text-ink-soft transition-colors hover:bg-surface-muted",
} as const;
