import "server-only";

import { NextResponse } from "next/server";

function getBackendBaseUrl() {
  const baseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("API_BASE_URL is not defined.");
  return baseUrl.replace(/\/$/, "");
}

export async function proxyPublicApi(path: string, init?: RequestInit) {
  try {
    const response = await fetch(`${getBackendBaseUrl()}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: "PUBLIC_API_UNAVAILABLE",
          message: "실시간 정보 서버에 연결할 수 없습니다.",
        },
      },
      { status: 503 },
    );
  }
}
