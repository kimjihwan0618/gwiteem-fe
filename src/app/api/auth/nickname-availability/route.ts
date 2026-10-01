import { NextResponse } from "next/server";
import { z } from "zod";
import { nicknameAvailabilitySchema } from "@/app/(page)/type/auth";
import {
  authErrorResponse,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";

const backendNicknameAvailabilitySchema = z.object({
  is_available: z.boolean(),
});

export async function GET(request: Request) {
  const nickname = new URL(request.url).searchParams.get("nickname")?.trim();
  if (!nickname || nickname.length > 50) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "닉네임을 확인해 주세요.",
        code: "INVALID_NICKNAME",
      },
      { status: 400 },
    );
  }

  try {
    const result = await requestAuthBackend(
      `/api/v1/auth/nickname/availability?nickname=${encodeURIComponent(nickname)}`,
      backendNicknameAvailabilitySchema,
    );
    const data = nicknameAvailabilitySchema.parse({
      isAvailable: result.is_available,
    });
    return NextResponse.json({
      success: true,
      data,
      message: data.isAvailable
        ? "사용할 수 있는 닉네임입니다."
        : "이미 사용 중인 닉네임입니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
