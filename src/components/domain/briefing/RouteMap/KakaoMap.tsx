"use client";

import type { Commute } from "@/app/(page)/(home)/type";
import { LoaderCircle, LocateFixed, MapPin } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { routeMapStyles } from "./styles";

type LocationPoint = Commute["origin"];
type KakaoLatLng = unknown;
type KakaoMapInstance = {
  setBounds: (bounds: unknown, padding?: number) => void;
  panTo: (point: KakaoLatLng) => void;
  setLevel: (level: number) => void;
  relayout: () => void;
};
type KakaoOverlayInstance = {
  setMap: (map: KakaoMapInstance | null) => void;
  setPosition: (position: KakaoLatLng) => void;
};

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
        ) => KakaoMapInstance;
        CustomOverlay: new (options: {
          map: KakaoMapInstance;
          position: unknown;
          content: HTMLElement;
          yAnchor?: number;
          zIndex?: number;
        }) => KakaoOverlayInstance;
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
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const currentLocationMarkerRef = useRef<KakaoOverlayInstance | null>(null);
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
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
      mapRef.current = map;
      currentLocationMarkerRef.current = null;
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
        new maps.CustomOverlay({
          map,
          position: originPosition,
          content: createMapMarker("출발", "origin"),
          yAnchor: 1.15,
          zIndex: 3,
        });
        bounds.extend(originPosition);
      }
      if (destination) {
        const destinationPosition = new maps.LatLng(
          destination.lat,
          destination.lng,
        );
        new maps.CustomOverlay({
          map,
          position: destinationPosition,
          content: createMapMarker("도착", "destination"),
          yAnchor: 1.15,
          zIndex: 3,
        });
        bounds.extend(destinationPosition);
      }
      if (path.length > 1 || origin || destination) map.setBounds(bounds, 60);
    });
  }, [destination, origin, routePolyline, sdkStatus]);

  useEffect(() => {
    const relayoutMap = () => mapRef.current?.relayout();
    window.addEventListener("resize", relayoutMap);
    document.addEventListener("fullscreenchange", relayoutMap);
    return () => {
      window.removeEventListener("resize", relayoutMap);
      document.removeEventListener("fullscreenchange", relayoutMap);
    };
  }, []);

  function moveToCurrentLocation() {
    if (!navigator.geolocation || !window.kakao || !mapRef.current) {
      setLocationError("현재 위치를 확인할 수 없어요.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!window.kakao || !mapRef.current) return;
        const position = new window.kakao.maps.LatLng(
          coords.latitude,
          coords.longitude,
        );
        const marker = currentLocationMarkerRef.current;
        if (marker) {
          marker.setPosition(position);
          marker.setMap(mapRef.current);
        } else {
          currentLocationMarkerRef.current =
            new window.kakao.maps.CustomOverlay({
              map: mapRef.current,
              position,
              content: createMapMarker("내 위치", "current"),
              yAnchor: 1.15,
              zIndex: 4,
            });
        }
        mapRef.current.setLevel(4);
        mapRef.current.panTo(position);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError("위치 권한을 허용해 주세요.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  }

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
      {sdkStatus === "ready" && (
        <button
          type="button"
          className={routeMapStyles.currentLocationButton}
          onClick={moveToCurrentLocation}
          aria-label="내 위치로 이동"
          title="내 위치로 이동"
          disabled={isLocating}
        >
          {isLocating ? (
            <LoaderCircle size={19} className={routeMapStyles.locationLoader} />
          ) : (
            <LocateFixed size={19} />
          )}
        </button>
      )}
      {locationError && (
        <p className={routeMapStyles.locationError} role="status">
          {locationError}
        </p>
      )}
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

function createMapMarker(
  label: string,
  kind: "origin" | "destination" | "current",
) {
  const marker = document.createElement("div");
  marker.className = routeMapStyles.marker[kind];
  marker.textContent = label;
  marker.setAttribute("aria-label", label);
  return marker;
}
