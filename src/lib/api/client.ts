import type { ZodType } from "zod";
import { ApiError, apiResponseSchema, type ApiResponse } from "./response";

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

const GUEST_SESSION_STORAGE_KEY = "gwiteem_guest_session_id";

function createGuestSessionId() {
  if (typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  if (typeof window.crypto?.getRandomValues === "function") {
    const bytes = window.crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const value = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
    return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
  }

  return `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getGuestSessionId() {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(GUEST_SESSION_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    // 저장소 접근이 제한된 모바일 브라우저에서도 조회 요청은 계속 진행한다.
  }

  const created = createGuestSessionId();
  try {
    window.localStorage.setItem(GUEST_SESSION_STORAGE_KEY, created);
  } catch {
    // 저장하지 못하면 현재 요청에서만 생성한 세션 ID를 사용한다.
  }
  return created;
}

export async function apiClient<T>(
  path: string,
  dataSchema: ZodType<T>,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const guestSessionId = getGuestSessionId();
  const response = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(guestSessionId ? { "X-Guest-Session-Id": guestSessionId } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const failure = payload as {
      message?: string;
      code?: string;
      error?: { message?: string; code?: string } | null;
    } | null;
    throw new ApiError(
      failure?.error?.message ??
        failure?.message ??
        "요청 처리 중 오류가 발생했습니다.",
      response.status,
      failure?.error?.code ?? failure?.code,
    );
  }

  const parsed = apiResponseSchema(dataSchema).safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(
      "서버 응답 형식이 올바르지 않습니다.",
      response.status,
      "INVALID_RESPONSE",
    );
  }
  return parsed.data;
}
