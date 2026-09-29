import { NextResponse } from "next/server";
import { z } from "zod";
import { emailCodeSendRequestSchema } from "@/app/(page)/type/auth";
import {
  authErrorResponse,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";

export async function POST(request: Request) {
  const parsed = emailCodeSendRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "이메일 주소를 확인해 주세요.",
        code: "INVALID_EMAIL",
      },
      { status: 400 },
    );
  }

  try {
    await requestAuthBackend("/api/v1/auth/password/reset-code", z.null(), {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return NextResponse.json({
      success: true,
      data: null,
      message: "비밀번호 재설정 인증번호를 보냈습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
