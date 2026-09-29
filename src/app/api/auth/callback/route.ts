import { NextResponse } from "next/server";
import {
  oauthCallbackRequestSchema,
  tokenResponseSchema,
} from "@/app/(page)/type/auth";
import {
  authErrorResponse,
  mapAuthUser,
  persistAuthSession,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";

export async function POST(request: Request) {
  const parsed = oauthCallbackRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "소셜 로그인 요청이 올바르지 않습니다.",
        code: "INVALID_OAUTH_CALLBACK",
      },
      { status: 400 },
    );
  }

  try {
    const token = await requestAuthBackend(
      `/api/v1/auth/${parsed.data.provider}/callback`,
      tokenResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({
          code: parsed.data.code,
          state: parsed.data.state,
        }),
      },
    );
    const user = mapAuthUser(token.user);
    await persistAuthSession(token, user, parsed.data.remember);
    return NextResponse.json({
      success: true,
      data: { user },
      message: "소셜 로그인이 완료되었습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
