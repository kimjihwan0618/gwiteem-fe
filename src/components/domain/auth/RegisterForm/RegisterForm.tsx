"use client";

import {
  formatVerificationTime,
  useVerificationTimer,
} from "@/app/(page)/hooks/use-verification-timer";
import {
  emailCodeSendRequestSchema,
  type AuthUser,
  type EmailCodeConfirmRequest,
  type EmailCodeSendRequest,
  type RegisterRequest,
} from "@/app/(page)/type/auth";
import { isPasswordValid } from "@/app/(page)/type/password";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ApiResponse } from "@/lib/api/response";
import type { UseMutationResult } from "@tanstack/react-query";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PasswordRuleHint } from "../PasswordRuleHint";
import { registerFormStyles } from "./styles";

export function RegisterForm({
  registerMutation,
  nicknameAvailabilityMutation,
  sendCodeMutation,
  confirmCodeMutation,
}: {
  registerMutation: UseMutationResult<
    ApiResponse<{ user: AuthUser }>,
    Error,
    RegisterRequest,
    unknown
  >;
  nicknameAvailabilityMutation: UseMutationResult<
    ApiResponse<{ isAvailable: boolean }>,
    Error,
    string,
    unknown
  >;
  sendCodeMutation: UseMutationResult<
    ApiResponse<null>,
    Error,
    EmailCodeSendRequest,
    unknown
  >;
  confirmCodeMutation: UseMutationResult<
    ApiResponse<null>,
    Error,
    EmailCodeConfirmRequest,
    unknown
  >;
}) {
  const verificationTimer = useVerificationTimer();
  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState("");
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [hasSentCode, setHasSentCode] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  const isEmailValid = emailCodeSendRequestSchema.safeParse({ email }).success;
  const isEmailVerified = verifiedEmail === email;
  const normalizedNickname = nickname.trim();
  const isNicknameValid =
    normalizedNickname.length > 0 && normalizedNickname.length <= 50;
  const isNicknameVerified = verifiedNickname === normalizedNickname;
  const canRegister =
    isNicknameVerified &&
    isEmailVerified &&
    isPasswordValid(password) &&
    !registerMutation.isPending;

  function changeEmail(nextEmail: string) {
    setEmail(nextEmail);
    if (nextEmail === email) return;
    setHasSentCode(false);
    setVerificationCode("");
    setVerifiedEmail(null);
    verificationTimer.stop();
  }

  function changeNickname(nextNickname: string) {
    setNickname(nextNickname);
    setVerifiedNickname(null);
    nicknameAvailabilityMutation.reset();
  }

  function checkNicknameAvailability() {
    if (!isNicknameValid) return;
    nicknameAvailabilityMutation.mutate(normalizedNickname, {
      onSuccess: (response) => {
        setVerifiedNickname(
          response.data.isAvailable ? normalizedNickname : null,
        );
      },
    });
  }

  function sendVerificationCode() {
    if (!isEmailValid) return;
    sendCodeMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setHasSentCode(true);
          setVerificationCode("");
          setVerifiedEmail(null);
          verificationTimer.start();
        },
      },
    );
  }

  function confirmVerificationCode() {
    if (!verificationCode.trim() || verificationTimer.remainingSeconds <= 0)
      return;
    confirmCodeMutation.mutate(
      { email, code: verificationCode.trim() },
      {
        onSuccess: () => {
          setVerifiedEmail(email);
          verificationTimer.stop();
        },
      },
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canRegister) return;
    registerMutation.mutate({
      nickname: nickname.trim(),
      email,
      password,
      remember: true,
    });
  }

  return (
    <div className={registerFormStyles.root}>
      <div className={registerFormStyles.intro}>
        <h1 className={registerFormStyles.title}>회원가입</h1>
        <p className={registerFormStyles.description}>
          이메일 인증 후 기본 정보를 입력해 주세요.
        </p>
      </div>
      <form onSubmit={submit} className={registerFormStyles.form}>
        <div className={registerFormStyles.field}>
          <span className={registerFormStyles.label}>닉네임</span>
          <div className={registerFormStyles.inputActionRow}>
            <div className={registerFormStyles.fieldControl}>
              <UserRound className={registerFormStyles.fieldIcon} size={18} />
              <Input
                name="nickname"
                value={nickname}
                onChange={(event) => changeNickname(event.target.value)}
                required
                maxLength={50}
                autoComplete="nickname"
                placeholder="브리핑에서 사용할 이름"
                className={registerFormStyles.input}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              className={registerFormStyles.actionButton}
              disabled={!isNicknameValid || isNicknameVerified}
              isPending={nicknameAvailabilityMutation.isPending}
              loadingText="확인 중"
              onClick={checkNicknameAvailability}
            >
              중복 확인
            </Button>
          </div>
          {isNicknameVerified && (
            <p className={registerFormStyles.nicknameAvailableMessage}>
              <CheckCircle2 size={15} /> 사용할 수 있는 닉네임입니다.
            </p>
          )}
          {nicknameAvailabilityMutation.data &&
            nicknameAvailabilityMutation.variables === normalizedNickname &&
            !nicknameAvailabilityMutation.data.data.isAvailable && (
              <p className={registerFormStyles.nicknameUnavailableMessage}>
                이미 사용 중인 닉네임입니다.
              </p>
            )}
        </div>
        <label className={registerFormStyles.field}>
          <span className={registerFormStyles.label}>이메일</span>
          <div className={registerFormStyles.inputActionRow}>
            <div className={registerFormStyles.fieldControl}>
              <Mail className={registerFormStyles.fieldIcon} size={18} />
              <Input
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => changeEmail(event.target.value)}
                autoComplete="email"
                placeholder="name@example.com"
                className={registerFormStyles.input}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              className={registerFormStyles.actionButton}
              disabled={!isEmailValid || isEmailVerified}
              isPending={sendCodeMutation.isPending}
              loadingText="발송 중"
              onClick={sendVerificationCode}
            >
              {hasSentCode ? "재발송" : "인증번호 받기"}
            </Button>
          </div>
        </label>
        {hasSentCode && !isEmailVerified && (
          <div className={registerFormStyles.verificationBlock}>
            <label className={registerFormStyles.field}>
              <span className={registerFormStyles.label}>인증번호</span>
              <div className={registerFormStyles.inputActionRow}>
                <div className={registerFormStyles.fieldControl}>
                  <KeyRound
                    className={registerFormStyles.fieldIcon}
                    size={18}
                  />
                  <Input
                    name="verificationCode"
                    value={verificationCode}
                    onChange={(event) =>
                      setVerificationCode(event.target.value)
                    }
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="인증번호 입력"
                    className={registerFormStyles.codeInput}
                  />
                  <span className={registerFormStyles.timer}>
                    {formatVerificationTime(verificationTimer.remainingSeconds)}
                  </span>
                </div>
                <Button
                  type="button"
                  className={registerFormStyles.actionButton}
                  disabled={
                    !verificationCode.trim() ||
                    verificationTimer.remainingSeconds <= 0
                  }
                  isPending={confirmCodeMutation.isPending}
                  loadingText="확인 중"
                  onClick={confirmVerificationCode}
                >
                  인증 확인
                </Button>
              </div>
            </label>
            {verificationTimer.remainingSeconds <= 0 && (
              <p className={registerFormStyles.expiredMessage}>
                인증번호가 만료되었습니다. 다시 발송해 주세요.
              </p>
            )}
          </div>
        )}
        {isEmailVerified && (
          <p className={registerFormStyles.verifiedMessage}>
            <CheckCircle2 size={15} /> 이메일 인증이 완료되었습니다.
          </p>
        )}
        <label className={registerFormStyles.field}>
          <span className={registerFormStyles.label}>비밀번호</span>
          <div className={registerFormStyles.fieldControl}>
            <LockKeyhole className={registerFormStyles.fieldIcon} size={18} />
            <Input
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              maxLength={16}
              autoComplete="new-password"
              placeholder="8~16자 비밀번호"
              className={registerFormStyles.passwordInput}
            />
            <button
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              onClick={() => setShowPassword(!showPassword)}
              className={registerFormStyles.visibilityButton}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <PasswordRuleHint password={password} />
        </label>
        <Button
          type="submit"
          size="lg"
          className={registerFormStyles.submit}
          disabled={!canRegister}
          isPending={registerMutation.isPending}
          loadingText="가입 중..."
        >
          회원가입
        </Button>
      </form>
      <p className={registerFormStyles.loginPrompt}>
        이미 계정이 있나요?{" "}
        <Link href="/login" className={registerFormStyles.loginLink}>
          로그인
        </Link>
      </p>
    </div>
  );
}
