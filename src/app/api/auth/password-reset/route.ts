import { NextResponse } from "next/server";
import { z } from "zod";
import { passwordResetRequestSchema } from "@/app/(page)/type/auth";
import {
  authErrorResponse,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";

export async function POST(request: Request) {
  const parsed = passwordResetRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "이메일과 새 비밀번호를 확인해 주세요.",
        code: "INVALID_PASSWORD_RESET_INPUT",
      },
      { status: 400 },
    );
  }

  try {
    await requestAuthBackend("/api/v1/auth/password/reset", z.null(), {
      method: "POST",
      body: JSON.stringify({
        email: parsed.data.email,
        new_password: parsed.data.newPassword,
      }),
    });
    return NextResponse.json({
      success: true,
      data: null,
      message: "비밀번호가 변경되었습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
