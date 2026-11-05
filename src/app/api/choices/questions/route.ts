import { proxyChoiceApi } from "../_lib/backend";
import { NextResponse } from "next/server";
import { createQuestionSchema } from "@/app/(page)/questions/new/type";

export async function GET(request: Request) {
  const search = new URL(request.url).search;
  return proxyChoiceApi(request, `/api/v1/choices/questions${search}`);
}

export async function POST(request: Request) {
  const parsed = createQuestionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message:
          parsed.error.issues[0]?.message ?? "입력 내용을 확인해 주세요.",
        code: "INVALID_REQUEST",
      },
      { status: 400 },
    );
  }
  const response = await proxyChoiceApi(request, "/api/v1/choices/questions", {
    method: "POST",
    body: JSON.stringify(parsed.data),
    requiresAuth: true,
  });
  if (response.status === 422) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message:
          "입력 내용 또는 카테고리가 변경되었습니다. 카테고리를 새로 확인하고 다시 시도해 주세요.",
        code: "INVALID_REQUEST",
      },
      { status: 422 },
    );
  }
  if (!response.ok) return response;
  const body: unknown = await response.json();
  return NextResponse.json(
    {
      ...(typeof body === "object" && body !== null ? body : {}),
      message: "질문을 게시했어요.",
    },
    { status: response.status },
  );
}
