import { NextResponse } from "next/server";
import { z } from "zod";
import {
  authErrorResponse,
  getStoredAuth,
  requestAuthBackend,
} from "@/app/api/auth/_lib/server";

const updateSchema = z.object({
  label: z.string().min(1),
  originAddress: z.string().min(1),
  destinationAddress: z.string().min(1),
});

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

async function authorization() {
  const { accessToken } = await getStoredAuth();
  if (!accessToken) throw new Error("로그인이 필요합니다.");
  return { Authorization: `Bearer ${accessToken}` };
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ favoriteId: string }> },
) {
  try {
    const payload = updateSchema.parse(await request.json());
    const { favoriteId } = await params;
    const headers = await authorization();
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
      `/api/v1/users/me/commute-favorites/${favoriteId}`,
      z.unknown(),
      {
        method: "PUT",
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
    return NextResponse.json({
      success: true,
      data: null,
      message: "경로를 수정했습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ favoriteId: string }> },
) {
  try {
    const { favoriteId } = await params;
    const headers = await authorization();
    await requestAuthBackend(
      `/api/v1/users/me/commute-favorites/${favoriteId}`,
      z.null(),
      { method: "DELETE", headers },
    );
    return NextResponse.json({
      success: true,
      data: null,
      message: "경로를 삭제했습니다.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
