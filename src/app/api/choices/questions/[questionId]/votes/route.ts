import { proxyChoiceApi } from "../../../_lib/backend";

export async function POST(
  request: Request,
  context: RouteContext<"/api/choices/questions/[questionId]/votes">,
) {
  const { questionId } = await context.params;
  return proxyChoiceApi(
    request,
    `/api/v1/choices/questions/${questionId}/votes`,
    { method: "POST", body: await request.text() },
  );
}
