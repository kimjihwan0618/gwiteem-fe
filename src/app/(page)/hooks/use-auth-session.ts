"use client";

import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { apiClient } from "@/lib/api/client";
import { sessionResultSchema, type AuthUser } from "@/app/(page)/type/auth";

function getSession() {
  return apiClient("/api/auth/session", sessionResultSchema);
}

function logoutSession() {
  return apiClient("/api/auth/logout", z.null(), { method: "POST" });
}

export function useAuthSession() {
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

  const setUser = useCallback((nextUser: AuthUser) => {
    setUserState(nextUser);
    setIsReady(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      setUserState(null);
    }
  }, []);

  return { user, isReady, setUser, logout };
}
