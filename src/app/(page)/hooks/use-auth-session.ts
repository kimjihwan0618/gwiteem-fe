"use client";

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { apiClient } from "@/lib/api/client";
import { sessionResultSchema, type AuthUser } from "@/app/(page)/type/auth";
import { queryKeys } from "@/lib/query-keys";

function getSession() {
  return apiClient("/api/auth/session", sessionResultSchema);
}

function logoutSession() {
  return apiClient("/api/auth/logout", z.null(), { method: "POST" });
}

export function useAuthSession() {
  const queryClient = useQueryClient();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getSession()
      .then((response) => {
        if (isMounted) setUserState(response.data.user);
      })
      .catch(() => {
        if (isMounted) setUserState(null);
      })
      .finally(() => {
        if (isMounted) setIsReady(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const setUser = useCallback(
    (nextUser: AuthUser) => {
      setUserState(nextUser);
      setIsReady(true);
      void queryClient.resetQueries({ queryKey: queryKeys.choices.all });
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      setUserState(null);
      await queryClient.resetQueries({ queryKey: queryKeys.choices.all });
    }
  }, [queryClient]);

  return { user, isReady, setUser, logout };
}
