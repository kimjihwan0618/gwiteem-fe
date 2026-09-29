import { NextResponse } from "next/server";
import {
  loginRequestSchema,
  tokenResponseSchema,
} from "@/app/(page)/type/auth";
import {
  authErrorResponse,
  mapAuthUser,
  persistAuthSession,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";

export async function POST(request: Request) {
  const parsed = loginRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "이메일과 비밀번호를 확인해 주세요.",
        code: "INVALID_LOGIN_INPUT",
      },
      { status: 400 },
    );
  }

  try {
    const token = await requestAuthBackend(
      "/api/v1/auth/login",
      tokenResponseSchema,
      {
        method: "POST",
        body: JSON.stringify({
          email: parsed.data.email,
          password: parsed.data.password,
        }),
      },
    );
    const user = mapAuthUser(token.user, parsed.data.email);
    await persistAuthSession(token, user, parsed.data.remember);

    return NextResponse.json({
      success: true,
      data: { user },
      message: "로그인되었습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
