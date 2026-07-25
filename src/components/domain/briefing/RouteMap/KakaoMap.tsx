"use client";

import type { Commute } from "@/app/(page)/(home)/type";
import { MapPin } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { routeMapStyles } from "./styles";

type LocationPoint = Commute["origin"];

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (latitude: number, longitude: number) => unknown;
        LatLngBounds: new () => { extend: (point: unknown) => void };
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number },
        ) => { setBounds: (bounds: unknown, padding?: number) => void };
        Marker: new (options: {
          map: unknown;
          position: unknown;
          title?: string;
        }) => unknown;
        Polyline: new (options: {
          map: unknown;
          path: unknown[];
          strokeWeight: number;
          strokeColor: string;
          strokeOpacity: number;
          strokeStyle: string;
        }) => unknown;
      };
    };
  }
}

export function KakaoMap({
  origin,
  destination,
  routePolyline = [],
}: {
  origin?: LocationPoint;
  destination?: LocationPoint;
  routePolyline?: Commute["routePolyline"];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY;

  useEffect(() => {
    if (sdkStatus !== "ready" || !window.kakao || !containerRef.current) return;
    window.kakao.maps.load(() => {
      if (!window.kakao || !containerRef.current) return;
      const maps = window.kakao.maps;
      const fallback = new maps.LatLng(37.5665, 126.978);
      const map = new maps.Map(containerRef.current, {
        center: origin
          ? new maps.LatLng(origin.lat, origin.lng)
          : destination
            ? new maps.LatLng(destination.lat, destination.lng)
            : fallback,
        level: origin && destination ? 7 : 9,
      });
      const bounds = new maps.LatLngBounds();
      const path = routePolyline.map(
        (point) => new maps.LatLng(point.lat, point.lng),
      );

      if (path.length > 1) {
        new maps.Polyline({
          map,
          path,
          strokeWeight: 5,
          strokeColor: "#1d4ed8",
          strokeOpacity: 0.85,
          strokeStyle: "solid",
        });
        path.forEach((point) => bounds.extend(point));
      }

      if (origin) {
        const originPosition = new maps.LatLng(origin.lat, origin.lng);
        new maps.Marker({ map, position: originPosition, title: "출발지" });
        bounds.extend(originPosition);
      }
      if (destination) {
        const destinationPosition = new maps.LatLng(
          destination.lat,
          destination.lng,
        );
        new maps.Marker({
          map,
          position: destinationPosition,
          title: "도착지",
        });
        bounds.extend(destinationPosition);
      }
      if (path.length > 1 || origin || destination) map.setBounds(bounds, 60);
    });
  }, [destination, origin, routePolyline, sdkStatus]);

  if (!appKey)
    return (
      <div className={routeMapStyles.mapState}>
        <MapPin size={22} />
        카카오맵 JavaScript 키를 설정해 주세요.
      </div>
    );

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setSdkStatus("ready")}
        onError={() => setSdkStatus("error")}
      />
      <div ref={containerRef} className={routeMapStyles.map} />
      {sdkStatus === "loading" && (
        <div className={routeMapStyles.mapState}>카카오맵 불러오는 중...</div>
      )}
      {sdkStatus === "error" && (
        <div className={routeMapStyles.mapError}>
          <MapPin size={22} />
          <strong>카카오맵을 불러오지 못했습니다.</strong>
        </div>
      )}
    </>
  );
}
