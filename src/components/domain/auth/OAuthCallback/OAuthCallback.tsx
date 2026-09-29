"use client";

import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api/response";
import type {
  AuthUser,
  OAuthCallbackRequest,
  SocialProvider,
} from "@/app/(page)/type/auth";
import { oauthCallbackStyles } from "./styles";

export function OAuthCallback({
  provider,
  code,
  state,
  error,
  callback,
}: {
  provider: SocialProvider | null;
  code?: string;
  state?: string;
  error?: string;
  callback: UseMutationResult<
    ApiResponse<{ user: AuthUser }>,
    Error,
    OAuthCallbackRequest,
    unknown
  >;
}) {
  const requested = useRef(false);

  useEffect(() => {
    if (
      requested.current ||
      !provider ||
      !code ||
      (provider === "naver" && !state) ||
      error
    )
      return;
    requested.current = true;
    callback.mutate({ provider, code, state, remember: true });
  }, [callback, code, error, provider, state]);

  const invalid =
    !provider || !code || (provider === "naver" && !state) || Boolean(error);

  return (
    <main className={oauthCallbackStyles.root}>
      <section className={oauthCallbackStyles.card}>
        {!invalid && (
          <LoaderCircle className={oauthCallbackStyles.spinner} aria-hidden />
        )}
        <h1 className={oauthCallbackStyles.title}>
          {invalid ? "소셜 로그인을 완료하지 못했습니다" : "로그인 확인 중"}
        </h1>
        <p className={oauthCallbackStyles.description}>
          {invalid
            ? "인증 정보가 없거나 로그인이 취소되었습니다. 다시 시도해 주세요."
            : "소셜 계정의 인증 정보를 안전하게 확인하고 있습니다."}
        </p>
        {invalid && (
          <Link href="/login" className={oauthCallbackStyles.link}>
            로그인 화면으로 돌아가기
          </Link>
        )}
      </section>
    </main>
  );
}
