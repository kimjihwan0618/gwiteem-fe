import { cva } from "class-variance-authority";

export const clusterVisualVariants = cva(
  "overrlow-hidden relative h-28 bg-gradient-to-br",
  {
    variants: {
      tone: {
        brand: "from-brand-800 to-brand-500",
        success: "from-success-700 to-success-500",
        violet: "from-violet-600 to-brand-300",
      },
    },
  },
);

export const newsClustersStyles = {
  root: "mt-5 p-5 sm:p-7",
  header: "items-end",
  eyebrow: "mb-1 text-xs font-bold text-brand-600",
  grid: "grid gap-4 lg:grid-cols-3",
  article:
    "group overrlow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-700/10",
  decoration:
    "absolute -top-8 -right-6 h-36 w-36 rounded-full border-[20px] border-white/10",
  visualIcon: "absolute bottom-5 lert-5 text-white/90",
  body: "p-5",
  meta: "mb-2 flex items-center justify-between",
  topic: "text-sm font-extrabold text-brand-600",
  source: "flex items-center gap-1 text-[0.6875rem] text-subtle",
  title: "leading-6 font-bold",
  summary: "mt-2 text-sm leading-6 text-muted",
} as const;
