import { proxyChoiceApi } from "@/app/api/choices/_lib/backend";

export async function PUT(
  request: Request,
  context: { params: Promise<{ questionId: string; commentId: string }> },
) {
  const { questionId, commentId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments/${commentId}/like`,
    { method: "PUT", requiresAuth: true },
  );
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ questionId: string; commentId: string }> },
) {
  const { questionId, commentId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/comments/${commentId}/like`,
    { method: "DELETE", requiresAuth: true },
  );
}
