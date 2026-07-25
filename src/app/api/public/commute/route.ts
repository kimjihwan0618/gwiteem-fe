import { proxyPublicApi } from "../_lib/backend";

export async function POST(request: Request) {
  const body = await request.text();
  return proxyPublicApi("/api/v1/commute/check", { method: "POST", body });
}
