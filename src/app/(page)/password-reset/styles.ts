export const passwordResetPageStyles = {
  root: "flex min-h-screen flex-col bg-white px-5 sm:px-8",
  header:
    "mx-auto flex w-full max-w-6xl items-center justify-between py-5 sm:py-7",
  logo: "focus-ring shrink-0 rounded-sm",
  backLink:
    "focus-ring flex items-center gap-2 rounded-lg text-sm font-semibold text-muted hover:text-brand-700",
  formContent: "flex flex-1 items-center justify-center py-8 sm:py-12",
  footer:
    "mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 border-t border-border-subtle py-5 text-xs text-subtle sm:flex-row",
  footerLinks: "flex items-center gap-5",
} as const;
