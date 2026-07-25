import { NextResponse } from "next/server";
import { z } from "zod";
import {
  authErrorResponse,
  getStoredAuth,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";
import { favoritesSchema } from "@/app/(page)/(home)/type/favorites";

const createFavoriteSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("stock"), code: z.string().min(1) }),
  z.object({
    kind: z.literal("weather"),
    label: z.string().min(1),
    latitude: z.number(),
    longitude: z.number(),
  }),
  z.object({
    kind: z.literal("commute"),
    label: z.string().min(1),
    originAddress: z.string().min(1),
    destinationAddress: z.string().min(1),
  }),
]);

const commuteCheckSchema = z.object({
  origin: z.object({
    label: z.string().nullable(),
    lat: z.number(),
    lng: z.number(),
  }),
  destination: z.object({
    label: z.string().nullable(),
    lat: z.number(),
    lng: z.number(),
  }),
});

async function getAuthorization() {
  const { accessToken } = await getStoredAuth();
  if (!accessToken) throw new Error("로그인이 필요합니다.");
  return { Authorization: `Bearer ${accessToken}` };
}

export async function GET() {
  try {
    const headers = await getAuthorization();
    const [weather, stocks, commutes] = await Promise.all([
      requestAuthBackend(
        "/api/v1/users/me/weather-favorites/weather",
        favoritesSchema.shape.weather,
        { headers },
      ),
      requestAuthBackend(
        "/api/v1/users/me/watchlist/market-impact",
        favoritesSchema.shape.stocks,
        { headers },
      ),
      requestAuthBackend(
        "/api/v1/users/me/commute-favorites/commute",
        favoritesSchema.shape.commutes,
        { headers },
      ),
    ]);
    return NextResponse.json({
      success: true,
      data: {
        weather: weather.slice(0, 5),
        stocks: stocks.slice(0, 5),
        commutes: commutes.slice(0, 5),
      },
      message: "즐겨찾기를 불러왔습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = createFavoriteSchema.parse(await request.json());
    const headers = await getAuthorization();

    if (payload.kind === "stock") {
      await requestAuthBackend(
        "/api/v1/interests",
        z.object({ id: z.number(), type: z.string(), value: z.string() }),
        {
          method: "POST",
          headers,
          body: JSON.stringify({ type: "STOCK", value: payload.code }),
        },
      );
    } else if (payload.kind === "weather") {
      await requestAuthBackend(
        "/api/v1/users/me/weather-favorites",
        z.unknown(),
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            label: payload.label,
            latitude: payload.latitude,
            longitude: payload.longitude,
          }),
        },
      );
    } else {
      const commute = await requestAuthBackend(
        "/api/v1/commute/check",
        commuteCheckSchema,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            origin_address: payload.originAddress,
            destination_address: payload.destinationAddress,
          }),
        },
      );
      await requestAuthBackend(
        "/api/v1/users/me/commute-favorites",
        z.unknown(),
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            label: payload.label,
            origin_address: payload.originAddress,
            origin_lat: commute.origin.lat,
            origin_lng: commute.origin.lng,
            destination_address: payload.destinationAddress,
            destination_lat: commute.destination.lat,
            destination_lng: commute.destination.lng,
          }),
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: "즐겨찾기에 추가했습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
