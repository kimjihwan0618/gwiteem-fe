import { proxyChoiceApi } from "../../../_lib/backend";

export async function PUT(
  request: Request,
  context: RouteContext<"/api/choices/questions/[questionId]/like">,
) {
  const { questionId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/like`,
    { method: "PUT", requiresAuth: true },
  );
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/choices/questions/[questionId]/like">,
) {
  const { questionId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/like`,
    { method: "DELETE", requiresAuth: true },
  );
}
