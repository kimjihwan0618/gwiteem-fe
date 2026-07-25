"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { SocialButton } from "@/components/domain/auth/SocialButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ApiResponse } from "@/lib/api/response";
import type {
  AuthUser,
  LoginRequest,
  SocialProvider,
} from "@/app/(page)/type/auth";
import { loginFormStyles } from "./styles";

export function LoginForm({
  loginMutation,
  socialLoginMutation,
}: {
  loginMutation: UseMutationResult<
    ApiResponse<{ user: AuthUser }>,
    Error,
    LoginRequest,
    unknown
  >;
  socialLoginMutation: UseMutationResult<
    ApiResponse<{ loginUrl: string }>,
    Error,
    SocialProvider,
    unknown
  >;
}) {
  const [showPassword, setShowPassword] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    loginMutation.mutate({
      email: String(form.get("email")),
      password: String(form.get("password")),
      remember: false,
    });
  }

  return (
    <div className={loginFormStyles.root}>
      <div className={loginFormStyles.intro}>
        <h1 className={loginFormStyles.title}>로그인</h1>
        <p className={loginFormStyles.description}>
          Gwiteem 계정으로 나만의 브리핑을 이어보세요.
        </p>
      </div>

      <form onSubmit={submit} className={loginFormStyles.form}>
        <label className={loginFormStyles.field}>
          <span className={loginFormStyles.fieldLabel}>이메일</span>
          <div className={loginFormStyles.fieldControl}>
            <Mail className={loginFormStyles.fieldIcon} size={18} />
            <Input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
              className={loginFormStyles.emailInput}
            />
          </div>
        </label>
        <label className={loginFormStyles.field}>
          <span className={loginFormStyles.fieldLabel}>비밀번호</span>
          <div className={loginFormStyles.fieldControl}>
            <LockKeyhole className={loginFormStyles.fieldIcon} size={18} />
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={6}
              placeholder="비밀번호 6자 이상"
              className={loginFormStyles.passwordInput}
            />
            <button
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShowPassword(!showPassword)}
              className={loginFormStyles.visibilityButton}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <div className={loginFormStyles.optionsRow}>
          <Link href="/password-reset" className={loginFormStyles.forgotLink}>
            비밀번호 찾기
          </Link>
        </div>
        <Button
          type="submit"
          size="lg"
          className={loginFormStyles.submitButton}
          isPending={loginMutation.isPending}
          loadingText="로그인 중..."
        >
          로그인
        </Button>
      </form>

      <div className={loginFormStyles.divider}>
        <span className={loginFormStyles.dividerLine} />
        간편 로그인
        <span className={loginFormStyles.dividerLine} />
      </div>

      <div className={loginFormStyles.socialGrid}>
        <SocialButton
          label="Google"
          provider="google"
          mutation={socialLoginMutation}
        />
        <SocialButton
          label="네이버"
          provider="naver"
          mutation={socialLoginMutation}
        />
        {/* Kakao OAuth is temporarily disabled until integration is ready.
        <SocialButton
          label="카카오"
          provider="kakao"
          mutation={socialLoginMutation}
        />
        */}
      </div>

      <p className={loginFormStyles.signUpPrompt}>
        아직 계정이 없으신가요?{" "}
        <Link href="/register" className={loginFormStyles.signUpLink}>
          회원가입
        </Link>
      </p>
      <Link href="/" className={loginFormStyles.guestLink}>
        로그인 없이 오늘 브리핑 보기
      </Link>
    </div>
  );
}
