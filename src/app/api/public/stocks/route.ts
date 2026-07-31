import { NextResponse } from "next/server";
import { proxyPublicApi } from "../_lib/backend";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const market = searchParams.get("market");
  const duration = searchParams.get("duration");
  if (market !== "domestic" && market !== "overseas") {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: "INVALID_MARKET",
          message: "지원하지 않는 증시 구분입니다.",
        },
      },
      { status: 400 },
    );
  }
  if (!duration || !["1d", "1w", "1mo", "1y"].includes(duration)) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: {
          code: "INVALID_DURATION",
          message: "지원하지 않는 조회 기간입니다.",
        },
      },
      { status: 400 },
    );
  }
  return proxyPublicApi(
    `/api/v1/stocks/top?market=${market}&duration=${duration}`,
  );
}
