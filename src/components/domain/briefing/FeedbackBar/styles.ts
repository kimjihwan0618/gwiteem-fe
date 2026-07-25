import { cva } from "class-variance-authority";

export const feedbackButtonVariants = cva(
  "focus-ring rounded-full border p-2.5 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      tone: {
        idle: "border-border",
        positive:
          "animate-state-in border-brand-300 bg-brand-50 text-brand-700",
        negative:
          "animate-state-in border-danger-200 bg-danger-50 text-danger-700",
      },
    },
    defaultVariants: { tone: "idle" },
  },
);

export const feedbackBarStyles = {
  root: "mt-5 flex flex-col items-center justify-between gap-4 p-4 sm:flex-row sm:px-6",
  meta: "flex items-center gap-2 text-sm text-muted",
  actions: "flex flex-wrap items-center justify-center gap-2",
  question: "mr-1 text-sm font-semibold",
  loader: "animate-spin",
  divider: "mx-1 hidden h-7 w-px bg-border sm:block",
} as const;
