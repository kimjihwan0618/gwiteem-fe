import {
  Car,
  Clock3,
  Map,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ApiResponse } from "@/lib/api/response";
import type { Commute } from "@/app/(page)/(home)/type";
import type { Favorites } from "@/app/(page)/(home)/type";
import type { Briefing } from "@/app/(page)/(home)/type/briefing";
import { DetailModal } from "../DetailModal";
import { RouteMap } from "../RouteMap";
import { heroCardStyles } from "./styles";
import { commuteFavoriteChipVariants } from "./styles";

interface HeroCardProps {
  data: Briefing;
  guestCommute?: UseMutationResult<
    ApiResponse<Commute>,
    Error,
    { origin_address: string; destination_address: string },
    unknown
  >;
  hasCommuteFavorites?: boolean;
  favoriteCommute?: Favorites["commutes"][number];
  favoriteOptions?: Array<{ id: number; label: string }>;
  selectedFavoriteId?: number;
  isFavoriteLoading?: boolean;
  onFavoriteSelect?: (id: number) => void;
  onEditFavorite?: (id: number) => void;
  onDeleteFavorite?: (id: number) => void;
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
  favoriteCommute,
  favoriteOptions,
  selectedFavoriteId,
  isFavoriteLoading,
  onFavoriteSelect,
  onEditFavorite,
  onDeleteFavorite,
  onAddFavorite,
}: HeroCardProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [modal, setModal] = useState<"route" | "map" | null>(null);
  const [isRestoringRoute, setIsRestoringRoute] = useState(
    Boolean(guestCommute),
  );
  const hasRestoredCommute = useRef(false);
  const guestCommuteData = guestCommute?.data?.data;
  const durationMinutes = guestCommute
    ? guestCommuteData?.durationMinutes
    : (favoriteCommute?.commute.estimated_minutes ?? data.commute.etaMinutes);
  const delayMinutes = guestCommute
    ? guestCommuteData?.delayMinutes
    : (favoriteCommute?.commute.delay_minutes ?? data.commute.delayMinutes);
  const isCommuteLoading =
    Boolean(isFavoriteLoading) ||
    (Boolean(guestCommute) &&
      (isRestoringRoute || Boolean(guestCommute?.isPending)));
  const isFavoriteMode = Boolean(onAddFavorite) && !guestCommute;
  const hasCommuteData = guestCommute
    ? Boolean(guestCommuteData)
    : isFavoriteMode
      ? Boolean(favoriteCommute)
      : true;
  const originLabel =
    guestCommuteData?.origin?.label ||
    favoriteCommute?.favorite.origin_address ||
    origin ||
    "출발지";
  const destinationLabel =
    guestCommuteData?.destination?.label ||
    favoriteCommute?.favorite.destination_address ||
    destination ||
    (guestCommute ? "도착지" : data.commute.destination);

  useEffect(() => {
    if (!guestCommute || hasRestoredCommute.current) return;

    try {
      const storedRoute = localStorage.getItem(COMMUTE_ROUTE_STORAGE_KEY);
      if (!storedRoute) {
        const restoreTimer = window.setTimeout(() => {
          hasRestoredCommute.current = true;
          setIsRestoringRoute(false);
        }, 0);
        return () => window.clearTimeout(restoreTimer);
      }
      const route: unknown = JSON.parse(storedRoute);
      if (
        !route ||
        typeof route !== "object" ||
        !("origin" in route) ||
        !("destination" in route) ||
        typeof route.origin !== "string" ||
        typeof route.destination !== "string"
      ) {
        const restoreTimer = window.setTimeout(() => {
          hasRestoredCommute.current = true;
          setIsRestoringRoute(false);
        }, 0);
        return () => window.clearTimeout(restoreTimer);
      }

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
        setIsRestoringRoute(false);
      }, 0);
      return () => window.clearTimeout(restoreTimer);
    } catch {
      const restoreTimer = window.setTimeout(() => {
        hasRestoredCommute.current = true;
        setIsRestoringRoute(false);
      }, 0);
      return () => window.clearTimeout(restoreTimer);
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
      <CardHeader className={heroCardStyles.header}>
        <div className={heroCardStyles.titleGroup}>
          <span className={heroCardStyles.titleIcon} aria-hidden="true">
            <Car size={19} />
          </span>
          <CardTitle className={heroCardStyles.title}>경로 안내</CardTitle>
        </div>
        <span className={heroCardStyles.liveBadge}>
          <span className={heroCardStyles.liveDot} /> 실시간 교통 반영
        </span>
      </CardHeader>
      <div className={heroCardStyles.content}>
        {isCommuteLoading ? (
          <CommuteCardSkeleton />
        ) : hasCommuteData ? (
          <>
            <div className={heroCardStyles.durationSummary}>
              <Clock3 size={22} />
              <strong>{durationMinutes}분</strong>
              {typeof delayMinutes === "number" && delayMinutes > 0 && (
                <span>
                  평소보다 <b>+{delayMinutes}분</b>
                </span>
              )}
            </div>
            <div className={heroCardStyles.routePoints}>
              <p>
                <span className={heroCardStyles.originDot} />
                {originLabel} (출발)
              </p>
              <p>
                <span className={heroCardStyles.destinationDot} />
                {destinationLabel} (도착)
              </p>
            </div>
          </>
        ) : (
          <div className={heroCardStyles.commuteEmpty}>
            {guestCommute?.isError
              ? "출근 정보를 불러오지 못했습니다. 경로를 다시 설정해 주세요."
              : "출근 경로를 설정하면 예상 소요시간을 확인할 수 있어요."}
          </div>
        )}
        {guestCommute && (
          <div className={heroCardStyles.actions}>
            <Button
              size="sm"
              variant="secondary"
              aria-haspopup="dialog"
              onClick={() => setModal("route")}
            >
              <RefreshCw size={15} /> 경로 변경
            </Button>
            <Button
              size="sm"
              variant="secondary"
              aria-haspopup="dialog"
              onClick={() => setModal("map")}
            >
              <Map size={15} /> 지도 보기
            </Button>
          </div>
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
        {favoriteOptions && favoriteOptions.length > 0 && (
          <div className={heroCardStyles.favoriteList}>
            {favoriteOptions.map((favorite) => (
              <div key={favorite.id} className={heroCardStyles.favoriteItem}>
                <button
                  type="button"
                  className={commuteFavoriteChipVariants({
                    isActive: favorite.id === selectedFavoriteId,
                  })}
                  aria-pressed={favorite.id === selectedFavoriteId}
                  onClick={() => onFavoriteSelect?.(favorite.id)}
                >
                  {favorite.label}
                </button>
                <button
                  type="button"
                  className={heroCardStyles.favoriteAction}
                  aria-label={`${favorite.label} 수정`}
                  onClick={() => onEditFavorite?.(favorite.id)}
                >
                  <Pencil size={12} />
                </button>
                <button
                  type="button"
                  className={heroCardStyles.favoriteDeleteAction}
                  aria-label={`${favorite.label} 삭제`}
                  onClick={() => onDeleteFavorite?.(favorite.id)}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {onAddFavorite && (
              <button
                type="button"
                className={heroCardStyles.favoriteAddButton}
                onClick={() => onAddFavorite("commute")}
              >
                <Plus size={13} /> 경로 추가
              </button>
            )}
          </div>
        )}
      </div>
      {guestCommute && (
        <DetailModal
          title="출근 경로 변경"
          icon={<RefreshCw size={19} />}
          isOpen={modal === "route"}
          onClose={() => setModal(null)}
        >
          <form
            className={heroCardStyles.commuteForm}
            onSubmit={(event) => {
              event.preventDefault();
              guestCommute.mutate({
                origin_address: origin.trim(),
                destination_address: destination.trim(),
              });
              saveRoute(origin.trim(), destination.trim());
              setModal(null);
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
        </DetailModal>
      )}
      <DetailModal
        title="출근 경로 지도"
        icon={<Map size={19} />}
        isOpen={modal === "map"}
        onClose={() => setModal(null)}
      >
        <div className={heroCardStyles.mapModal}>
          <RouteMap
            origin={guestCommuteData?.origin}
            destination={guestCommuteData?.destination}
            routePolyline={guestCommuteData?.routePolyline}
            originLabel={origin || undefined}
            destinationLabel={destination || undefined}
            isLoading={guestCommute?.isPending}
          />
        </div>
      </DetailModal>
    </Card>
  );
}

function CommuteCardSkeleton() {
  return (
    <div
      className={heroCardStyles.commuteSkeleton}
      role="status"
      aria-label="출근 정보 불러오는 중"
    >
      <div className={heroCardStyles.durationSkeleton}>
        <Skeleton className={heroCardStyles.clockSkeleton} />
        <Skeleton className={heroCardStyles.minuteSkeleton} />
        <Skeleton className={heroCardStyles.delaySkeleton} />
      </div>
      <div className={heroCardStyles.routeSkeletons}>
        <Skeleton className={heroCardStyles.routeSkeleton} />
        <Skeleton className={heroCardStyles.routeSkeletonLong} />
      </div>
    </div>
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
