import { cva } from "class-variance-authority";

export const commentStyles = {
  replies: "mt-2",
  replyActions: "flex items-center gap-4",
  replyToggle:
    "focus-ring rounded-md py-1 text-xs font-semibold text-muted transition-colors hover:text-brand-700",
  replyList:
    "mt-2 divide-y divide-border-subtle border-l-2 border-border pl-3 sm:pl-4",
  replyComposer: "mt-3 rounded-xl bg-surface-muted p-3",
  replyLabel: "mb-2 block text-xs font-semibold text-muted",
  root: "animate-state-in",
  tabs: "relative mb-5 grid grid-cols-2 border-b border-border",
  tab: "p-3 text-sm font-bold text-muted transition-colors aria-selected:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-500",
  byline: "mb-3 flex items-center justify-between gap-3 text-xs text-muted",
  composer: "flex items-start gap-3 border-b border-border pb-5",
  input:
    "min-h-11 w-full resize-y rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-500 disabled:bg-surface",
  inputArea: "min-w-0 flex-1",
  hint: "mt-1 text-right text-xs text-muted",
  list: "divide-y divide-border",
  row: "flex gap-3 py-5",
  avatar:
    "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted text-sm font-bold text-muted",
  image: "size-full object-cover",
  body: "min-w-0 flex-1",
  header: "flex flex-wrap items-center gap-2 text-xs",
  author: "font-bold text-ink",
  time: "text-muted",
  actions: "ml-auto flex items-center gap-2",
  icon: "inline-flex min-h-7 items-center gap-1 rounded-md px-1 text-muted transition-colors hover:text-brand-700 disabled:opacity-50 aria-pressed:text-danger-500 focus-visible:outline-2 focus-visible:outline-brand-500",
  content:
    "mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-ink",
  menuPanel:
    "fixed z-[70] grid w-[112px] gap-1 rounded-xl border border-border bg-white p-1 shadow-lg",
  menuButton:
    "rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface",
  editActions: "mt-2 flex justify-end gap-2",
  state: "py-10 text-center text-sm text-muted",
  skeleton: "my-5 h-16 w-full",
  more: "mt-3 flex justify-center",
  countButton:
    "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-muted hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-brand-500",
};
export const commentIndicator = cva(
  "absolute bottom-0 left-0 h-0.5 w-1/2 bg-brand-700 transition-transform duration-200",
  {
    variants: {
      tab: { result: "translate-x-0", comments: "translate-x-full" },
    },
  },
);
