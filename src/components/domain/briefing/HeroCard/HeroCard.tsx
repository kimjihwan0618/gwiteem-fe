import { ArrowRight, Clock3, MapPin, Plus, Search } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type { ApiResponse } from "@/lib/api/response";
import type { Commute } from "@/app/(page)/(home)/type";
import type { Briefing } from "@/app/(page)/(home)/type/briefing";
import { RouteMap } from "../RouteMap";
import { heroCardStyles } from "./styles";

interface HeroCardProps {
  data: Briefing;
  guestCommute?: UseMutationResult<
    ApiResponse<Commute>,
    Error,
    { origin_address: string; destination_address: string },
    unknown
  >;
  hasCommuteFavorites?: boolean;
  favoriteCommuteLabels?: string[];
  onAddFavorite?: (kind: "commute") => void;
}

type DaumAddressData = {
  address: string;
  roadAddress: string;
  jibunAddress: string;
};
type DaumPostcode = new (options: {
  oncomplete: (data: DaumAddressData) => void;
}) => { open: () => void };

declare global {
  interface Window {
    daum?: { Postcode: DaumPostcode };
  }
}

const COMMUTE_ROUTE_STORAGE_KEY = "daru:guest-commute-route";

export function HeroCard({
  data,
  guestCommute,
  hasCommuteFavorites,
  favoriteCommuteLabels,
  onAddFavorite,
}: HeroCardProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const hasRestoredCommute = useRef(false);
  const guestCommuteData = guestCommute?.data?.data;

  useEffect(() => {
    if (!guestCommute || hasRestoredCommute.current) return;

    try {
      const storedRoute = localStorage.getItem(COMMUTE_ROUTE_STORAGE_KEY);
      if (!storedRoute) return;
      const route: unknown = JSON.parse(storedRoute);
      if (
        !route ||
        typeof route !== "object" ||
        !("origin" in route) ||
        !("destination" in route) ||
        typeof route.origin !== "string" ||
        typeof route.destination !== "string"
      )
        return;

      const storedOrigin = route.origin;
      const storedDestination = route.destination;
      const restoreTimer = window.setTimeout(() => {
        hasRestoredCommute.current = true;
        setOrigin(storedOrigin);
        setDestination(storedDestination);
        if (storedOrigin && storedDestination) {
          guestCommute.mutate({
            origin_address: storedOrigin,
            destination_address: storedDestination,
          });
        }
      }, 0);
      return () => window.clearTimeout(restoreTimer);
    } catch {
      // 저장된 값이 올바른 JSON이 아니면 주소를 다시 선택하도록 둔다.
    }
  }, [guestCommute]);

  function saveRoute(nextOrigin: string, nextDestination: string) {
    localStorage.setItem(
      COMMUTE_ROUTE_STORAGE_KEY,
      JSON.stringify({ origin: nextOrigin, destination: nextDestination }),
    );
  }

  function searchAddress(target: "origin" | "destination") {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: (addressData) => {
        const address =
          addressData.roadAddress ||
          addressData.address ||
          addressData.jibunAddress;
        const nextOrigin = target === "origin" ? address : origin;
        const nextDestination =
          target === "destination" ? address : destination;
        setOrigin(nextOrigin);
        setDestination(nextDestination);
        saveRoute(nextOrigin, nextDestination);
      },
    }).open();
  }

  return (
    <Card className={heroCardStyles.root}>
      {guestCommute && (
        <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      )}
      <CardHeader>
        <CardTitle>길찾기</CardTitle>
      </CardHeader>
      <div className={heroCardStyles.content}>
        {guestCommute ? (
          <>
            <h2 className={heroCardStyles.guestHeadline}>
              원하는 경로를 확인해 보세요
            </h2>
            <form
              className={heroCardStyles.commuteForm}
              onSubmit={(event) => {
                event.preventDefault();
                guestCommute.mutate({
                  origin_address: origin.trim(),
                  destination_address: destination.trim(),
                });
                saveRoute(origin.trim(), destination.trim());
              }}
            >
              <AddressInput
                label="출발지"
                value={origin}
                onSearch={() => searchAddress("origin")}
              />
              <AddressInput
                label="도착지"
                value={destination}
                onSearch={() => searchAddress("destination")}
              />
              <Button
                type="submit"
                disabled={!origin.trim() || !destination.trim()}
                isPending={guestCommute.isPending}
                loadingText="조회 중"
              >
                길찾기
              </Button>
            </form>
            {guestCommuteData && (
              <RouteSummary
                commute={guestCommuteData}
                originLabel={origin}
                destinationLabel={destination}
              />
            )}
          </>
        ) : (
          <>
            <h2 className={heroCardStyles.headline}>
              오늘은 {data.commute.leaveBy}까지
              <br className={heroCardStyles.headlineBreak} /> 출발하세요
            </h2>
            <p className={heroCardStyles.reason}>{data.commute.reason}</p>
          </>
        )}
        {hasCommuteFavorites === false && onAddFavorite && (
          <button
            type="button"
            className={heroCardStyles.favoritePrompt}
            onClick={() => onAddFavorite("commute")}
          >
            <Plus size={15} /> 즐겨찾기 경로를 등록하세요
          </button>
        )}
        {favoriteCommuteLabels && favoriteCommuteLabels.length > 0 && (
          <div className={heroCardStyles.favoriteList}>
            {favoriteCommuteLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        )}
      </div>
      <RouteMap
        origin={guestCommuteData?.origin}
        destination={guestCommuteData?.destination}
        routePolyline={guestCommuteData?.routePolyline}
        originLabel={origin || undefined}
        destinationLabel={destination || data.commute.destination}
        isLoading={guestCommute?.isPending}
      />
    </Card>
  );
}

function RouteSummary({
  commute,
  originLabel,
  destinationLabel,
}: {
  commute: Commute;
  originLabel: string;
  destinationLabel: string;
}) {
  const resolvedOrigin = commute.origin?.label || originLabel || "출발지";
  const resolvedDestination =
    commute.destination?.label || destinationLabel || "도착지";

  return (
    <section className={heroCardStyles.routeSummary} aria-label="경로 요약">
      <div className={heroCardStyles.routeSummaryHeader}>
        <span className={heroCardStyles.durationIcon} aria-hidden="true">
          <Clock3 size={18} />
        </span>
        <div className={heroCardStyles.durationCopy}>
          <span className={heroCardStyles.durationLabel}>예상 소요시간</span>
          <strong className={heroCardStyles.durationValue}>
            {commute.durationMinutes}분
          </strong>
        </div>
        <span className={heroCardStyles.trafficBadge}>실시간 교통 반영</span>
      </div>
      <div className={heroCardStyles.routePath}>
        <MapPin size={14} aria-hidden="true" />
        <span className={heroCardStyles.routeEndpoint}>{resolvedOrigin}</span>
        <ArrowRight
          className={heroCardStyles.routeArrow}
          size={14}
          aria-hidden="true"
        />
        <span className={heroCardStyles.routeEndpoint}>
          {resolvedDestination}
        </span>
      </div>
      {commute.delayMinutes !== null && commute.delayMinutes > 0 && (
        <p className={heroCardStyles.routeNotice}>
          교통 상황으로 약 {commute.delayMinutes}분 지연
          {commute.delayReason ? ` · ${commute.delayReason}` : ""}
        </p>
      )}
      {commute.recommendedDepartureTime && (
        <p className={heroCardStyles.routeNotice}>
          권장 출발시간 {commute.recommendedDepartureTime}
        </p>
      )}
    </section>
  );
}

function AddressInput({
  label,
  value,
  onSearch,
}: {
  label: string;
  value: string;
  onSearch: () => void;
}) {
  return (
    <label className={heroCardStyles.addressField}>
      <span className={heroCardStyles.addressLabel}>{label}</span>
      <button
        type="button"
        className={heroCardStyles.addressPicker}
        onClick={onSearch}
        aria-label={`${label} 주소 검색`}
      >
        <span
          className={
            value
              ? heroCardStyles.addressValue
              : heroCardStyles.addressPlaceholder
          }
        >
          {value || `${label} 주소를 검색하세요`}
        </span>
        <span className={heroCardStyles.addressSearch}>
          <Search size={16} />
        </span>
      </button>
    </label>
  );
}
