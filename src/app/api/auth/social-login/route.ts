import { NextResponse } from "next/server";
import {
  loginUrlResponseSchema,
  socialProviderSchema,
} from "@/app/(page)/type/auth";
import {
  authErrorResponse,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";

export async function GET(request: Request) {
  const provider = socialProviderSchema.safeParse(
    new URL(request.url).searchParams.get("provider"),
  );
  if (!provider.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "지원하지 않는 소셜 로그인 방식입니다.",
        code: "INVALID_SOCIAL_PROVIDER",
      },
      { status: 400 },
    );
  }

  try {
    const result = await requestAuthBackend(
      `/api/v1/auth/${provider.data}/login-url`,
      loginUrlResponseSchema,
    );
    return NextResponse.json({
      success: true,
      data: { loginUrl: result.login_url },
      message: "소셜 로그인 페이지로 이동합니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
