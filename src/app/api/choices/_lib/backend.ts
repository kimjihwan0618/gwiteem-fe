import "server-only";

import { NextResponse } from "next/server";
import {
  AuthBackendError,
  authErrorResponse,
  getAuthorizationHeaders,
  getStoredAuth,
} from "@/app/api/auth/_lib/server";

function getBackendBaseUrl() {
  const url = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!url) throw new Error("API_BASE_URL is not defined.");
  return url.replace(/\/$/, "");
}

export async function proxyChoiceApi(
  request: Request,
  path: string,
  options: { method?: string; body?: string; requiresAuth?: boolean } = {},
) {
  try {
    const storedAuth = await getStoredAuth();
    let authHeaders: Record<string, string> = {};
    if (options.requiresAuth) {
      authHeaders = await getAuthorizationHeaders();
    } else if (storedAuth.accessToken || storedAuth.refreshToken) {
      authHeaders = await getAuthorizationHeaders();
    }
    const guestSessionId = request.headers.get("x-guest-session-id");
    const response = await fetch(`${getBackendBaseUrl()}${path}`, {
      method: options.method ?? "GET",
      body: options.body,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(guestSessionId ? { "X-Guest-Session-Id": guestSessionId } : {}),
        ...authHeaders,
      },
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
        ...(response.headers.get("x-guest-session-id")
          ? {
              "X-Guest-Session-Id": response.headers.get("x-guest-session-id")!,
            }
          : {}),
      },
    });
  } catch (error) {
    if (error instanceof AuthBackendError) return authErrorResponse(error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: "CHOICE_API_UNAVAILABLE",
          message: "선택 콘텐츠 서버에 연결할 수 없습니다.",
        },
      },
      { status: 503 },
    );
  }
}
