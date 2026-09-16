import "server-only";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z, type ZodType } from "zod";
import {
  accessTokenResponseSchema,
  authUserSchema,
  type AuthUser,
  type TokenResponse,
} from "@/app/(page)/type/auth";

const ACCESS_TOKEN_COOKIE = "daru_access_token";
const REFRESH_TOKEN_COOKIE = "daru_refresh_token";
const USER_COOKIE = "daru_user";
const REMEMBER_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const backendEnvelopeSchema = z.object({
  success: z.boolean(),
  data: z.unknown().nullable(),
  error: z
    .object({ code: z.string(), message: z.string() })
    .nullable()
    .optional(),
});

export class AuthBackendError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "AUTH_REQUEST_FAILED",
  ) {
    super(message);
    this.name = "AuthBackendError";
  }
}

function getBackendBaseUrl() {
  const url = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!url) {
    throw new Error("API_BASE_URL is not defined.");
  }

  return url.replace(/\/$/, "");
}

export async function requestAuthBackend<T>(
  path: string,
  dataSchema: ZodType<T>,
  init: RequestInit = {},
) {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  }).catch(() => {
    throw new AuthBackendError(
      "인증 서버에 연결할 수 없습니다.",
      503,
      "AUTH_SERVER_UNAVAILABLE",
    );
  });

  const payload: unknown = await response.json().catch(() => null);
  const envelope = backendEnvelopeSchema.safeParse(payload);

  if (!response.ok || !envelope.success || !envelope.data.success) {
    const error = envelope.success ? envelope.data.error : null;
    throw new AuthBackendError(
      error?.message ?? "인증 요청을 처리하지 못했습니다.",
      response.status || 500,
      error?.code,
    );
  }

  const parsed = dataSchema.safeParse(envelope.data.data);
  if (!parsed.success) {
    throw new AuthBackendError(
      "인증 서버 응답 형식이 올바르지 않습니다.",
      502,
      "INVALID_AUTH_RESPONSE",
    );
  }

  return parsed.data;
}

export function mapAuthUser(
  user: TokenResponse["user"],
  email?: string,
): AuthUser {
  return {
    id: String(user.id),
    name: user.nickname,
    email: email ?? null,
    avatarUrl: user.profile_image_url ?? null,
  };
}

export async function persistAuthSession(
  token: TokenResponse,
  user: AuthUser,
  remember: boolean,
) {
  const cookieStore = await cookies();
  const common = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };

  cookieStore.set(ACCESS_TOKEN_COOKIE, token.access_token, {
    ...common,
    maxAge: token.expires_in,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, token.refresh_token, {
    ...common,
    ...(remember ? { maxAge: REMEMBER_MAX_AGE_SECONDS } : {}),
  });
  cookieStore.set(USER_COOKIE, JSON.stringify(user), {
    ...common,
    ...(remember ? { maxAge: REMEMBER_MAX_AGE_SECONDS } : {}),
  });
}

export async function updateAccessToken(
  accessToken: string,
  expiresIn: number,
) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresIn,
  });
}

export async function getStoredAuth() {
  const cookieStore = await cookies();
  const rawUser = cookieStore.get(USER_COOKIE)?.value;
  let user: AuthUser | null = null;
  if (rawUser) {
    try {
      const parsedUser = authUserSchema.safeParse(JSON.parse(rawUser));
      user = parsedUser.success ? parsedUser.data : null;
    } catch {
      user = null;
    }
  }

  return {
    accessToken: cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null,
    refreshToken: cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null,
    user,
  };
}

export async function getAuthorizationHeaders() {
  const { accessToken, refreshToken } = await getStoredAuth();
  if (accessToken) return { Authorization: `Bearer ${accessToken}` };
  if (!refreshToken) {
    throw new AuthBackendError(
      "로그인 세션이 만료되었습니다. 다시 로그인해 주세요.",
      401,
      "MISSING_AUTH_TOKEN",
    );
  }

  const token = await requestAuthBackend(
    "/api/v1/auth/refresh",
    accessTokenResponseSchema,
    {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  );
  await updateAccessToken(token.access_token, token.expires_in);
  return { Authorization: `Bearer ${token.access_token}` };
}

export async function clearAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(USER_COOKIE);
}

export function authErrorResponse(error: unknown) {
  const authError =
    error instanceof AuthBackendError
      ? error
      : new AuthBackendError("인증 처리 중 오류가 발생했습니다.", 500);

  return NextResponse.json(
    {
      success: false,
      data: null,
      message: authError.message,
      code: authError.code,
    },
    { status: authError.status },
  );
}
