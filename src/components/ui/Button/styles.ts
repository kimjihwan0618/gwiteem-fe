import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-700 text-white shadow-lg shadow-brand-700/15 hover:bg-brand-800",
        danger: "bg-danger-500 text-white hover:bg-danger-700",
        secondary:
          "border border-border bg-white text-ink-soft hover:bg-surface-muted",
        ghost: "text-muted hover:bg-surface-subtle",
        social:
          "border border-border bg-white text-ink-soft hover:border-border-strong hover:bg-surface-muted",
      },
      size: {
        sm: "min-h-9 px-3 text-xs",
        md: "min-h-11 px-4 text-sm",
        lg: "min-h-[3.25rem] px-5 text-[0.9375rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const buttonStyles = {
  loader: "animate-spin",
} as const;
