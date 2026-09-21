import { proxyChoiceApi } from "../_lib/backend";

export async function GET(request: Request) {
  return proxyChoiceApi(request, "/api/v1/choices/me", {
    requiresAuth: true,
  });
}
