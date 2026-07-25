export const registerFormStyles = {
  root: "w-full max-w-[420px]",
  intro: "mb-7 text-center",
  title:
    "text-[2rem] font-extrabold tracking-[-0.045em] text-ink sm:text-[2.25rem]",
  description: "mt-2 text-sm leading-6 text-muted sm:text-[0.9375rem]",
  form: "space-y-4",
  field: "block",
  label: "mb-2 block text-sm font-bold text-ink-soft",
  fieldControl: "relative",
  inputActionRow: "grid grid-cols-[minmax(0,1fr)_auto] gap-2",
  fieldIcon:
    "pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-subtle",
  input: "h-12 pl-11",
  codeInput: "h-12 pr-14 pl-11",
  passwordInput: "h-12 pr-12 pl-11",
  actionButton: "h-12 min-w-[104px] px-3 whitespace-nowrap",
  verificationBlock: "rounded-xl bg-surface-muted p-3",
  timer:
    "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs font-bold text-danger-700",
  expiredMessage: "mt-2 text-xs text-danger-700",
  verifiedMessage:
    "flex items-center gap-1.5 text-sm font-semibold text-success-700",
  visibilityButton:
    "focus-ring absolute top-1/2 right-3 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-subtle transition-colors hover:bg-surface-muted hover:text-ink-soft",
  submit: "mt-1 w-full",
  submitHint: "text-center text-xs leading-5 text-subtle",
  loginPrompt: "mt-6 text-center text-sm text-muted",
  loginLink:
    "focus-ring rounded font-bold text-brand-700 hover:text-brand-800 hover:underline",
} as const;
