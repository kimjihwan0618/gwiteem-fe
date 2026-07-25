import { proxyPublicApi } from "../_lib/backend";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams();
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  if (lat) params.set("lat", lat);
  if (lng) params.set("lng", lng);
  const query = params.size ? `?${params.toString()}` : "";
  return proxyPublicApi(`/api/v1/weather${query}`);
}
