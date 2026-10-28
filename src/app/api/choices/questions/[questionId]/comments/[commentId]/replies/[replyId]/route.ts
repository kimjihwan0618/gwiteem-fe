import { proxyChoiceApi } from "@/app/api/choices/_lib/backend";
export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ questionId: string; commentId: string; replyId: string }>;
  },
) {
  const { questionId, commentId, replyId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments/${commentId}/replies/${replyId}`,
    { method: "PATCH", requiresAuth: true, body: await request.text() },
  );
}
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ questionId: string; commentId: string; replyId: string }>;
  },
) {
  const { questionId, commentId, replyId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments/${commentId}/replies/${replyId}`,
    { method: "DELETE", requiresAuth: true },
  );
}
