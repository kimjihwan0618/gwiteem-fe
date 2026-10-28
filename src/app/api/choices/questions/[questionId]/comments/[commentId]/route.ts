import { proxyChoiceApi } from "@/app/api/choices/_lib/backend";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ questionId: string; commentId: string }> },
) {
  const { questionId, commentId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments/${commentId}`,
    { method: "PATCH", requiresAuth: true, body: await request.text() },
  );
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ questionId: string; commentId: string }> },
) {
  const { questionId, commentId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments/${commentId}`,
    { method: "DELETE", requiresAuth: true },
  );
}
