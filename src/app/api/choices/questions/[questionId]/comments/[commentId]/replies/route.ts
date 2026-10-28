import { proxyChoiceApi } from "@/app/api/choices/_lib/backend";
export async function POST(
  request: Request,
  context: { params: Promise<{ questionId: string; commentId: string }> },
) {
  const { questionId, commentId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments/${commentId}/replies`,
    { method: "POST", requiresAuth: true, body: await request.text() },
  );
}
