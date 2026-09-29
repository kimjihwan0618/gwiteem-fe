"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/response";
import {
  loginResultSchema,
  socialLoginUrlSchema,
  type LoginRequest,
  type SocialProvider,
} from "@/app/(page)/type/auth";

function login(payload: LoginRequest) {
  return apiClient("/api/auth/login", loginResultSchema, {
    method: "POST",
    body: payload,
  });
}

function getSocialLoginUrl(provider: SocialProvider) {
  return apiClient(
    `/api/auth/social-login?provider=${encodeURIComponent(provider)}`,
    socialLoginUrlSchema,
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function useLoginMutation() {
  const router = useRouter();
  const toast = useToast();
  const auth = useAuth();
  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      auth.setUser(response.data.user);
      toast.success(response.message);
      router.push("/");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "로그인 중 오류가 발생했습니다.")),
  });
}

export function useSocialLoginMutation() {
  const toast = useToast();
  return useMutation({
    mutationFn: getSocialLoginUrl,
    onSuccess: (response) => window.location.assign(response.data.loginUrl),
    onError: (error) =>
      toast.error(
        getErrorMessage(error, "소셜 로그인 연결 중 오류가 발생했습니다."),
      ),
  });
}
