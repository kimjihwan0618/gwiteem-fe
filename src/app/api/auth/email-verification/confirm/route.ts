import { NextResponse } from "next/server";
import { z } from "zod";
import { emailCodeConfirmRequestSchema } from "@/app/(page)/type/auth";
import {
  authErrorResponse,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";

export async function POST(request: Request) {
  const parsed = emailCodeConfirmRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "이메일과 인증번호를 확인해 주세요.",
        code: "INVALID_VERIFICATION_CODE",
      },
      { status: 400 },
    );
  }

  try {
    await requestAuthBackend(
      "/api/v1/auth/email/verification-code/confirm",
      z.null(),
      {
        method: "POST",
        body: JSON.stringify(parsed.data),
      },
    );
    return NextResponse.json({
      success: true,
      data: null,
      message: "이메일 인증이 완료되었습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
