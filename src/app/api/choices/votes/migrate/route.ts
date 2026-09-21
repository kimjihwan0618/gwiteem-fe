import { proxyChoiceApi } from "../../_lib/backend";

export async function POST(request: Request) {
  return proxyChoiceApi(request, "/api/v1/choices/votes/migrate", {
    method: "POST",
    requiresAuth: true,
  });
}
