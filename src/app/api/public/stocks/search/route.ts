import { proxyPublicApi } from "../../_lib/backend";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  return proxyPublicApi(`/api/v1/stocks/search?q=${encodeURIComponent(query)}`);
}
