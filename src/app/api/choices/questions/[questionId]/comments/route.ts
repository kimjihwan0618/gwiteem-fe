import { proxyChoiceApi } from "@/app/api/choices/_lib/backend";

export async function GET(
  request: Request,
  context: { params: Promise<{ questionId: string }> },
) {
  const { questionId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments${new URL(request.url).search}`,
    { method: "GET", requiresAuth: false },
  );
}

export async function POST(
  request: Request,
  context: { params: Promise<{ questionId: string }> },
) {
  const { questionId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments`,
    { method: "POST", requiresAuth: true, body: await request.text() },
  );
}
