"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/response";
import {
  loginResultSchema,
  type OAuthCallbackRequest,
} from "@/app/(page)/type/auth";

function completeSocialLogin(payload: OAuthCallbackRequest) {
  return apiClient("/api/auth/callback", loginResultSchema, {
    method: "POST",
    body: payload,
  });
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function useSocialCallbackMutation() {
  const router = useRouter();
  const toast = useToast();
  const auth = useAuth();
  return useMutation({
    mutationFn: completeSocialLogin,
    onSuccess: (response) => {
      auth.setUser(response.data.user);
      toast.success(response.message);
      router.replace("/");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "소셜 로그인을 완료하지 못했습니다."));
      router.replace("/login");
    },
  });
}
