import { proxyChoiceApi } from "../../_lib/backend";

export async function GET(
  request: Request,
  context: RouteContext<"/api/choices/questions/[questionId]">,
) {
  const { questionId } = await context.params;
  return proxyChoiceApi(request, `/api/v1/choices/questions/${questionId}`);
}
