"use client";

import { LoaderCircle } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api/response";
import type { SocialProvider } from "@/app/(page)/type/auth";
import {
  socialButtonStyles,
  socialButtonVariants,
  socialMarkVariants,
} from "./styles";

export function SocialButton({
  label,
  provider,
  mutation,
}: {
  label: string;
  provider: SocialProvider;
  mutation: UseMutationResult<
    ApiResponse<{ loginUrl: string }>,
    Error,
    SocialProvider,
    unknown
  >;
}) {
  const isCurrentPending =
    mutation.isPending && mutation.variables === provider;

  return (
    <button
      type="button"
      disabled={mutation.isPending}
      aria-busy={isCurrentPending}
      aria-label={`${label}로 로그인`}
      onClick={() => mutation.mutate(provider)}
      className={socialButtonVariants({ provider })}
    >
      <span className={socialMarkVariants({ provider })}>
        {isCurrentPending ? (
          <LoaderCircle size={20} className={socialButtonStyles.loader} />
        ) : (
          <SocialBrandIcon provider={provider} />
        )}
      </span>
      <span className={socialButtonStyles.label}>
        {isCurrentPending ? "연결 중..." : label}
      </span>
    </button>
  );
}

function SocialBrandIcon({ provider }: { provider: SocialProvider }) {
  if (provider === "naver") {
    return <span className={socialButtonStyles.naverGlyph}>N</span>;
  }

  if (provider === "kakao") {
    return (
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className={socialButtonStyles.brandIcon}
      >
        <path
          fill="currentColor"
          d="M16 5C8.82 5 3 9.48 3 15c0 3.58 2.46 6.72 6.16 8.49l-1.2 4.42c-.11.4.35.72.7.49l5.25-3.48c.68.08 1.38.12 2.09.12 7.18 0 13-4.48 13-10.04S23.18 5 16 5Z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={socialButtonStyles.brandIcon}
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.55h3.24c1.9-1.75 2.98-4.33 2.98-7.42Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.64-2.43l-3.24-2.55c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.85A6.02 6.02 0 0 1 6.08 12c0-.64.11-1.26.31-1.85V7.53H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.47l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.02c1.47 0 2.79.5 3.83 1.5l2.88-2.87A9.65 9.65 0 0 0 12 2a10 10 0 0 0-8.96 5.53l3.35 2.62C7.18 7.78 9.39 6.02 12 6.02Z"
      />
    </svg>
  );
}
