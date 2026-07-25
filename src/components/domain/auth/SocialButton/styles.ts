import { cva } from "class-variance-authority";

export const socialButtonVariants = cva(
  "group focus-ring flex h-12 min-w-0 items-center justify-center gap-2 rounded-xl border border-border bg-white px-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      provider: {
        kakao: "hover:text-ink",
        naver: "hover:text-social-naver-hover",
        google: "hover:text-social-google-hover",
      },
    },
  },
);

export const socialMarkVariants = cva(
  "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors",
  {
    variants: {
      provider: {
        kakao: "bg-social-kakao text-ink group-hover:bg-social-kakao-hover",
        naver: "bg-social-naver text-white group-hover:bg-social-naver-hover",
        google: "bg-surface-subtle group-hover:bg-border-subtle",
      },
    },
  },
);

export const socialButtonStyles = {
  loader: "animate-spin",
  label: "truncate text-[0.8125rem] whitespace-nowrap sm:text-sm",
  brandIcon: "h-4 w-4",
  naverGlyph: "text-sm leading-none font-black",
} as const;
