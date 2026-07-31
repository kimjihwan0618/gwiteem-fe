"use client";

import {
  BriefcaseBusiness,
  Expand,
  House,
  LoaderCircle,
  Minimize2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Commute } from "@/app/(page)/(home)/type";
import { KakaoMap } from "./KakaoMap";
import { routeMapStyles } from "./styles";

export function RouteMap({
  origin,
  destination,
  routePolyline,
  originLabel,
  destinationLabel,
  isLoading = false,
}: {
  origin?: Commute["origin"];
  destination?: Commute["destination"];
  routePolyline?: Commute["routePolyline"];
  originLabel?: string;
  destinationLabel?: string;
  isLoading?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateFullscreen = () =>
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  async function toggleFullscreen() {
    if (!rootRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await rootRef.current.requestFullscreen();
  }

  return (
    <div ref={rootRef} className={routeMapStyles.root}>
      <KakaoMap
        origin={origin}
        destination={destination}
        routePolyline={routePolyline}
      />
      <button
        type="button"
        className={routeMapStyles.fullscreenButton}
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "전체화면 종료" : "전체화면으로 보기"}
        title={isFullscreen ? "전체화면 종료" : "전체화면으로 보기"}
      >
        {isFullscreen ? <Minimize2 size={19} /> : <Expand size={19} />}
      </button>
      <div className={routeMapStyles.legend}>
        <div className={routeMapStyles.origin}>
          <House size={15} className={routeMapStyles.originIcon} />{" "}
          {origin?.label ?? originLabel ?? "출발지"}
        </div>
        <div className={routeMapStyles.destination}>
          <BriefcaseBusiness
            size={15}
            className={routeMapStyles.destinationIcon}
          />{" "}
          {destination?.label ?? destinationLabel ?? "도착지"}
        </div>
      </div>
      {isLoading && (
        <div
          className={routeMapStyles.routeLoading}
          role="status"
          aria-live="polite"
        >
          <LoaderCircle size={24} className={routeMapStyles.routeLoadingIcon} />
          <span className={routeMapStyles.routeLoadingLabel}>
            경로를 불러오는 중
          </span>
        </div>
      )}
    </div>
  );
}
