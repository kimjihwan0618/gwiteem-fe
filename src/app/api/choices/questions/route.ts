import { proxyChoiceApi } from "../_lib/backend";

export async function GET(request: Request) {
  const search = new URL(request.url).search;
  return proxyChoiceApi(request, `/api/v1/choices/questions${search}`);
}
