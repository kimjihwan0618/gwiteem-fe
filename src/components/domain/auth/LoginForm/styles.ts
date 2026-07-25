export const loginFormStyles = {
  root: "w-full max-w-[420px]",
  intro: "mb-7 text-center",
  title:
    "text-[32px] font-extrabold tracking-[-0.045em] text-ink sm:text-[36px]",
  description: "mt-2 text-sm leading-6 text-muted sm:text-[15px]",
  socialGrid: "grid grid-cols-2 gap-2",
  divider: "my-6 flex items-center gap-4 text-xs font-medium text-subtle",
  dividerLine: "h-px flex-1 bg-border-subtle",
  form: "space-y-4",
  field: "block",
  fieldLabel: "mb-2 block text-sm font-bold text-ink-soft",
  fieldControl: "relative",
  fieldIcon: "absolute top-1/2 left-4 -translate-y-1/2 text-subtle",
  emailInput: "h-12 pl-11",
  passwordInput: "h-12 px-11",
  optionsRow: "flex items-center justify-end",
  forgotLink:
    "focus-ring rounded text-xs font-semibold text-muted hover:text-brand-700",
  visibilityButton:
    "focus-ring absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-2 text-subtle",
  submitButton: "mt-1 w-full",
  signUpPrompt: "mt-6 text-center text-sm text-muted",
  signUpLink: "focus-ring rounded font-bold text-brand-700",
  guestLink:
    "focus-ring mx-auto mt-4 block w-fit rounded-lg text-sm font-medium text-subtle hover:text-brand-700",
} as const;
