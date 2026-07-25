import { cva } from "class-variance-authority";

export const notificationItemVariants = cva(
  "focus-ring flex w-full gap-3 border-b border-border-subtle px-5 py-4 text-left transition hover:bg-surface-muted",
  { variants: { unread: { true: "bg-brand-50/60", false: "" } } },
);

export const notificationTypeVariants = cva(
  "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
  {
    variants: {
      type: {
        briefing: "bg-brand-100 text-brand-600",
        market: "bg-violet-50 text-violet-600",
        commute: "bg-success-50 text-success-700",
      },
    },
  },
);

export const notificationMenuStyles = {
  root: "relative",
  trigger: "focus-ring relative rounded-full p-2.5 hover:bg-canvas",
  count:
    "absolute top-0.5 right-0.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-danger-500 px-1 text-[0.625rem] font-bold text-white ring-2 ring-white",
  panel:
    "animate-state-in absolute top-[52px] right-[-56px] z-50 w-[min(370px,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-card border border-border bg-white shadow-2xl sm:right-0",
  header:
    "flex items-center justify-between border-b border-border-subtle px-5 py-4",
  title: "font-bold",
  unreadSummary: "mt-0.5 text-xs text-subtle",
  markAll:
    "focus-ring flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-brand-600 disabled:text-faint",
  list: "max-h-[410px] overflow-y-auto",
  content: "min-w-0 flex-1",
  titleRow: "flex items-start gap-2",
  itemTitle: "flex-1 text-sm leading-5 text-ink",
  unreadDot: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500",
  description: "mt-1 block text-xs leading-5 text-muted",
  createdAt: "mt-2 block text-[0.6875rem] text-subtle",
  viewAll:
    "focus-ring flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-brand-600 hover:bg-surface-muted",
} as const;
