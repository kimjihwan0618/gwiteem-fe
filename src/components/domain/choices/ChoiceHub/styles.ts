import { cva } from "class-variance-authority";

export const categoryTabVariants = cva(
  "focus-ring rounded-full px-4 py-2 text-sm font-bold transition-colors",
  {
    variants: {
      active: {
        true: "bg-brand-700 text-white shadow-sm",
        false: "bg-white text-muted hover:bg-brand-50 hover:text-brand-700",
      },
    },
  },
);

export const optionButtonVariants = cva(
  "focus-ring flex min-h-16 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
  {
    variants: {
      tone: {
        a: "border-brand-200 bg-brand-50/70 hover:border-brand-500",
        b: "border-danger-200 bg-danger-50/70 hover:border-danger-500",
        c: "border-success-200 bg-success-50/70 hover:border-success-500",
        d: "border-violet-600/30 bg-violet-50 hover:border-violet-600",
      },
      selected: {
        true: "ring-2 ring-brand-500 ring-offset-2",
        false: "",
      },
    },
  },
);

export const optionLabelVariants = cva(
  "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black text-white",
  {
    variants: {
      tone: {
        a: "bg-brand-700",
        b: "bg-danger-500",
        c: "bg-success-500",
        d: "bg-violet-600",
      },
    },
  },
);

export const resultSegmentVariants = cva(
  "flex items-center justify-center overflow-hidden px-2 transition-[width] duration-500",
  {
    variants: {
      tone: {
        a: "bg-brand-500",
        b: "bg-danger-500",
        c: "bg-success-500",
        d: "bg-violet-600",
      },
    },
  },
);

export const choiceHubStyles = {
  root: "min-h-screen bg-canvas",
  main: "mx-auto max-w-[1440px] px-4 py-8 sm:px-7 lg:px-10 lg:py-11",
  intro: "mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
  eyebrow: "mb-2 text-sm font-semibold text-muted",
  title: "text-3xl font-black tracking-[-0.045em] text-ink sm:text-4xl",
  subtitle: "mt-2 text-sm text-muted sm:text-base",
  date: "text-sm font-semibold text-subtle",
  mobileCategories: "-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden",
  featured:
    "relative overflow-hidden rounded-card border border-brand-200 bg-white p-5 shadow-card sm:p-7 lg:p-8",
  featuredGlow:
    "pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-brand-50",
  featuredContent:
    "relative grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]",
  badgeRow: "mb-4 flex flex-wrap items-center gap-2",
  featuredTitle:
    "max-w-3xl text-2xl font-black tracking-[-0.04em] text-ink sm:text-3xl",
  featuredMeta: "flex flex-wrap items-center gap-x-4 gap-y-1",
  featuredOptions: "mt-6 grid gap-3 sm:grid-cols-2",
  featuredOption:
    "flex min-h-16 items-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-3 font-bold text-ink-soft",
  featuredAction: "flex min-w-48 flex-col items-stretch gap-2",
  participantMeta:
    "mt-1 inline-flex items-center gap-1 text-xs font-semibold text-subtle",
  sectionHeader:
    "mt-9 mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  sectionTitle: "text-xl font-black tracking-[-0.03em] text-ink sm:text-2xl",
  sortGroup: "flex w-fit rounded-xl border border-border bg-surface-subtle p-1",
  sortButton:
    "focus-ring rounded-lg px-4 py-2 text-xs font-bold text-muted transition-colors",
  sortButtonActive: "bg-white text-brand-700 shadow-sm",
  grid: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
  questionCard:
    "group flex min-h-52 flex-col rounded-card border border-border bg-white p-5 text-left shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg",
  cardMeta: "flex items-center justify-between gap-3",
  cardBadges: "flex flex-wrap gap-2",
  tension:
    "rounded-full bg-danger-50 px-2.5 py-1 text-[0.6875rem] font-bold text-danger-700",
  cardTitle:
    "mt-4 text-lg font-extrabold leading-snug tracking-[-0.025em] text-ink",
  questionByline: "mt-1 block text-xs font-medium text-subtle",
  cardOptions: "mt-4 grid grid-cols-2 gap-2",
  cardOption:
    "truncate rounded-lg bg-surface-muted px-3 py-2.5 text-xs font-bold text-ink-soft",
  cardOptionKey: "mr-1 font-black text-brand-600",
  cardFooter:
    "mt-auto flex items-center justify-between border-t border-border-subtle pt-4 text-xs font-semibold text-subtle",
  voted: "inline-flex items-center gap-1 text-success-700",
  arrow: "text-brand-600 transition-transform group-hover:translate-x-1",
  participantIcon: "mr-1 inline",
  moreRow: "mt-6 flex justify-center",
  state:
    "grid min-h-72 place-items-center rounded-card border border-border bg-white p-8 text-center shadow-card",
  stateTitle: "font-bold text-ink",
  stateDescription: "mt-2 text-sm text-muted",
  retryButton: "mt-4",
  skeletonFeatured: "h-64 rounded-card",
  skeletonGrid: "mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3",
  skeletonCard: "h-52 rounded-card",
  modalLayer: "fixed inset-0 z-50 grid place-items-center p-3 sm:p-6",
  backdrop: "absolute inset-0 bg-brand-900/55 backdrop-blur-sm",
  modal:
    "animate-state-in relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-card border border-border bg-white shadow-2xl",
  modalHeader:
    "sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/95 px-5 py-4 backdrop-blur sm:px-7",
  modalHeading: "font-black text-ink",
  modalHeaderActions: "flex items-center gap-1",
  shareIconButton:
    "focus-ring rounded-lg p-2 text-brand-600 hover:bg-brand-50 hover:text-brand-800",
  closeButton:
    "focus-ring rounded-lg p-2 text-muted hover:bg-surface-muted hover:text-ink",
  modalBody: "p-5 sm:p-7",
  modalSkeletonBadge: "h-6 w-20",
  modalSkeletonTitle: "mt-4 h-16 w-full",
  modalSkeletonOptions: "mt-7 h-32 w-full",
  modalQuestion:
    "mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-ink sm:text-3xl",
  modalHint: "mt-2 text-sm text-muted",
  optionGrid: "mt-6 grid gap-3 sm:grid-cols-2",
  optionText: "font-extrabold text-ink",
  reasonPanel:
    "animate-fade-up mt-6 rounded-xl border border-border bg-surface-muted p-4 sm:p-5",
  reasonLabel: "mb-2 block text-sm font-bold text-ink-soft",
  requiredLabel: "text-danger-700",
  select:
    "focus-ring min-h-12 w-full rounded-xl border border-border-strong bg-white px-4 text-sm font-semibold text-ink",
  submitRow: "mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  resultHeader:
    "mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
  resultHeading: "text-lg font-black text-ink",
  resultCount:
    "inline-flex items-center gap-1 text-xs font-semibold text-subtle",
  resultBar:
    "mt-4 flex h-12 overflow-hidden rounded-xl bg-surface-subtle text-sm font-black text-white",
  resultLabels: "mt-3 grid grid-cols-2 gap-3 text-sm font-bold",
  reasonResults: "mt-6 space-y-3",
  reasonResult: "grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-3",
  reasonText: "text-sm font-semibold text-ink-soft",
  reasonTrack: "mt-1 h-2 overflow-hidden rounded-full bg-border-subtle",
  reasonFill: "h-full rounded-full bg-brand-500",
  reasonPercent: "text-right text-xs font-bold text-muted",
  resultActions: "mt-7 grid gap-2",
  loginNote: "mt-3 text-center text-xs leading-relaxed text-subtle",
  loginLink: "mt-4",
  mineHeader: "mb-5 flex items-center justify-between",
  mineList: "grid gap-3",
  mineItem:
    "rounded-xl border border-border bg-white p-4 text-left transition hover:border-brand-300",
  mineMeta: "mb-2 flex items-center justify-between gap-3",
  mineQuestion: "font-bold text-ink",
  mineAnswer: "mt-2 text-sm font-semibold text-brand-700",
  mineReason: "mt-1 text-xs text-muted",
  mineDate: "text-xs text-subtle",
} as const;
