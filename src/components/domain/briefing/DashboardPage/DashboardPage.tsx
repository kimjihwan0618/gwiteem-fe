"use client";

import { Info, Play, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError } from "@/lib/api/response";
import type { ApiResponse } from "@/lib/api/response";
import type {
  Briefing,
  Commute,
  CommuteFavoriteUpdatePayload,
  FavoriteCreatePayload,
  Favorites,
  FeedbackValue,
  Priority,
  Stock,
  StockDuration,
  StockMarket,
  StockSearchResult,
  Weather,
} from "@/app/(page)/(home)/type";
import { BriefingModal, type ModalState } from "../BriefingModal";
import { DashboardSkeleton } from "../DashboardSkeleton";
import { FeedbackBar } from "../FeedbackBar";
import { HeroCard } from "../HeroCard";
import { NewsClusters } from "../NewsClusters";
import { PrioritiesCard } from "../PrioritiesCard";
import { ScheduleCard } from "../ScheduleCard";
import { StockImpactCard } from "../StockImpactCard";
import { WeatherCard } from "../WeatherCard";
import { FavoriteAddModal, type FavoriteModalKind } from "./FavoriteAddModal";
import { dashboardPageStyles } from "./styles";

export function DashboardPage({
  briefing,
  actions,
  guest,
  favorites,
}: {
  briefing: UseQueryResult<Briefing, Error>;
  actions: BriefingActions;
  guest: GuestTopData | null;
  favorites: {
    data?: Favorites;
    isLoading: boolean;
    isPending: boolean;
    onCreate: (payload: FavoriteCreatePayload) => void;
    onUpdateCommute: (payload: CommuteFavoriteUpdatePayload) => void;
    onDeleteCommute: (id: number) => void;
    isCommuteMutationPending: boolean;
    searchResults: StockSearchResult[];
    isSearching: boolean;
    onSearchStocks: (query: string) => void;
    topStocks: Stock[];
    isTopStocksLoading: boolean;
    stockMarket: StockMarket;
    onStockMarketChange: (market: StockMarket) => void;
  } | null;
}) {
  const { data, isLoading, isError, error, refetch, isFetching } = briefing;
  const toast = useToast();
  const [modal, setModal] = useState<ModalState>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [saved, setSaved] = useState(false);
  const [favoriteModal, setFavoriteModal] = useState<FavoriteModalKind>(null);
  const [editingCommute, setEditingCommute] = useState<
    Favorites["commutes"][number] | null
  >(null);
  const [selectedWeatherId, setSelectedWeatherId] = useState<number>();
  const [selectedCommuteId, setSelectedCommuteId] = useState<number>();
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(new Date()),
    [],
  );

  useEffect(() => {
    if (isError)
      toast.error(
        error instanceof ApiError
          ? error.message
          : "브리핑을 불러오지 못했습니다.",
      );
  }, [error, isError, toast]);

  async function shareBriefing() {
    const shareData = {
      title: "Gwiteem 오늘의 3분 브리핑",
      text: "오늘 나에게 중요한 변화 3가지를 확인해 보세요.",
      url: window.location.href,
    };
    if (navigator.share) {
      const shared = await navigator
        .share(shareData)
        .then(() => true)
        .catch(() => false);
      if (!shared) return;
    } else await navigator.clipboard.writeText(window.location.href);
    actions.share.mutate("today");
  }

  function startBriefing() {
    actions.start.mutate("today", {
      onSuccess: () => setModal({ type: "briefing", index: 0 }),
    });
  }

  function toggleSave() {
    const nextSaved = !saved;
    actions.save.mutate(
      { briefingId: "today", saved: nextSaved },
      { onSuccess: () => setSaved(nextSaved) },
    );
  }

  function sendFeedback(value: "up" | "down") {
    actions.feedback.mutate(
      { briefingId: "today", value },
      { onSuccess: () => setFeedback(value) },
    );
  }

  function showEvidence(priority: Priority) {
    setModal({ type: "evidence", priority });
  }

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !data)
    return (
      <PageState
        icon={<Info className={dashboardPageStyles.errorIcon} />}
        message="브리핑을 불러오지 못했어요"
        action={
          <Button
            isPending={isFetching}
            loadingText="다시 불러오는 중"
            onClick={() => refetch()}
          >
            다시 시도
          </Button>
        }
      />
    );

  const effectiveWeatherId = favorites?.data?.weather.some(
    (item) => item.favorite.id === selectedWeatherId,
  )
    ? selectedWeatherId
    : favorites?.data?.weather[0]?.favorite.id;
  const effectiveCommuteId = favorites?.data?.commutes.some(
    (item) => item.favorite.id === selectedCommuteId,
  )
    ? selectedCommuteId
    : favorites?.data?.commutes[0]?.favorite.id;
  const selectedWeather = favorites?.data?.weather.find(
    (item) => item.favorite.id === effectiveWeatherId,
  );
  const selectedCommute = favorites?.data?.commutes.find(
    (item) => item.favorite.id === effectiveCommuteId,
  );
  const displayedStocks = favorites?.data
    ? favorites.data.stocks.map(mapFavoriteStock)
    : guest
      ? (guest.stocks.data?.map((stock) =>
          mapGuestStock(stock, guest.stockMarket),
        ) ?? [])
      : data.stocks;

  return (
    <div id="top" className={dashboardPageStyles.root}>
      <AppHeader />
      <main className={dashboardPageStyles.main}>
        <div className={dashboardPageStyles.briefingHeader}>
          <div className={dashboardPageStyles.briefingIntro}>
            <h1 className={dashboardPageStyles.greeting}>오늘의 브리핑</h1>
            <p className={dashboardPageStyles.date}>{dateLabel}</p>
          </div>
          <div
            className={dashboardPageStyles.briefingActions}
            aria-label="브리핑 작업"
          >
            <Button
              size="lg"
              isPending={actions.start.isPending}
              loadingText="시작하는 중..."
              onClick={startBriefing}
            >
              <Play size={18} fill="currentColor" /> 브리핑 시작
            </Button>
            <Button
              size="lg"
              variant="secondary"
              isPending={actions.share.isPending}
              loadingText="공유 기록 중..."
              onClick={shareBriefing}
            >
              <Share2 size={18} /> 공유
            </Button>
          </div>
        </div>
        <div className={dashboardPageStyles.featureGrid}>
          <WeatherCard
            weather={data.weather}
            guestWeather={
              guest?.weather.data ??
              (selectedWeather
                ? mapFavoriteWeather(selectedWeather)
                : undefined)
            }
            isLoading={guest?.weather.isPending || favorites?.isLoading}
            hasFavorites={
              favorites ? favorites.data?.weather.length !== 0 : undefined
            }
            favoriteOptions={favorites?.data?.weather.map((item) => ({
              id: item.favorite.id,
              label: item.favorite.label,
            }))}
            selectedFavoriteId={effectiveWeatherId}
            onFavoriteSelect={(id) => {
              setSelectedWeatherId(id);
            }}
            onAddFavorite={
              favorites ? () => setFavoriteModal("weather") : undefined
            }
          />
          <HeroCard
            data={data}
            guestCommute={guest?.commute}
            favoriteCommute={selectedCommute}
            isFavoriteLoading={favorites?.isLoading}
            hasCommuteFavorites={
              favorites ? favorites.data?.commutes.length !== 0 : undefined
            }
            favoriteOptions={favorites?.data?.commutes.map((item) => ({
              id: item.favorite.id,
              label: item.favorite.label,
            }))}
            selectedFavoriteId={effectiveCommuteId}
            onFavoriteSelect={(id) => {
              setSelectedCommuteId(id);
            }}
            onEditFavorite={(id) => {
              const target = favorites?.data?.commutes.find(
                (item) => item.favorite.id === id,
              );
              if (target) {
                setEditingCommute(target);
                setFavoriteModal("commute");
              }
            }}
            onDeleteFavorite={(id) => {
              if (window.confirm("이 즐겨찾기 경로를 삭제하시겠습니까?"))
                favorites?.onDeleteCommute(id);
            }}
            onAddFavorite={setFavoriteModal}
          />
          <StockImpactCard
            stocks={displayedStocks}
            market={guest?.stockMarket}
            duration={guest?.stockDuration}
            onMarketChange={guest?.onStockMarketChange}
            onDurationChange={guest?.onStockDurationChange}
            isLoading={guest?.stocks.isFetching || favorites?.isLoading}
            isError={guest?.stocks.isError}
            hasFavorites={
              favorites ? favorites.data?.stocks.length !== 0 : undefined
            }
            onAddFavorite={() => setFavoriteModal("stock")}
            isFavoriteList={Boolean(favorites)}
          />
        </div>
        <div className={dashboardPageStyles.secondaryGrid}>
          <PrioritiesCard
            priorities={data.priorities}
            onEvidence={showEvidence}
          />
          <ScheduleCard schedule={data.schedule} />
        </div>
        <NewsClusters clusters={data.clusters} />
        <FeedbackBar
          updatedAt={data.updatedAt}
          feedback={feedback}
          saved={saved}
          onFeedback={sendFeedback}
          onSave={toggleSave}
          onShare={shareBriefing}
          feedbackPending={actions.feedback.isPending}
          savePending={actions.save.isPending}
          sharePending={actions.share.isPending}
        />
        <section id="settings" className={dashboardPageStyles.callout}>
          <div>
            <p className={dashboardPageStyles.calloutTitle}>
              이 브리핑을 매일 오전 7:30에 받아보세요
            </p>
            <p className={dashboardPageStyles.calloutDescription}>
              로그인하면 관심사, 출근 경로, 알림 시간을 저장할 수 있어요.
            </p>
          </div>
          <Link href="/register" className={dashboardPageStyles.calloutLink}>
            회원가입하고 내 브리핑 만들기
          </Link>
        </section>
      </main>
      <SiteFooter />
      <BriefingModal
        state={modal}
        priorities={data.priorities}
        onClose={() => setModal(null)}
        onChange={setModal}
      />
      {favorites && (
        <FavoriteAddModal
          key={favoriteModal ?? "closed"}
          kind={favoriteModal}
          isPending={favorites.isPending || favorites.isCommuteMutationPending}
          editingCommute={editingCommute}
          searchResults={favorites.searchResults}
          isSearching={favorites.isSearching}
          onSearchStocks={favorites.onSearchStocks}
          topStocks={favorites.topStocks}
          isTopStocksLoading={favorites.isTopStocksLoading}
          stockMarket={favorites.stockMarket}
          onStockMarketChange={favorites.onStockMarketChange}
          onCreate={(payload) => {
            favorites.onCreate(payload);
            setFavoriteModal(null);
          }}
          onUpdateCommute={(payload) => {
            favorites.onUpdateCommute(payload);
            setEditingCommute(null);
            setFavoriteModal(null);
          }}
          onClose={() => {
            setEditingCommute(null);
            setFavoriteModal(null);
          }}
        />
      )}
    </div>
  );
}

type BriefingActionResponse = ApiResponse<{
  briefingId: string;
  action: "start" | "save" | "feedback" | "share";
}>;

type BriefingActions = {
  start: UseMutationResult<BriefingActionResponse, Error, string, unknown>;
  save: UseMutationResult<
    BriefingActionResponse,
    Error,
    { briefingId: string; saved: boolean },
    unknown
  >;
  feedback: UseMutationResult<
    BriefingActionResponse,
    Error,
    { briefingId: string; value: FeedbackValue },
    unknown
  >;
  share: UseMutationResult<BriefingActionResponse, Error, string, unknown>;
};

type GuestTopData = {
  weather: UseQueryResult<Weather, Error>;
  stocks: UseQueryResult<Stock[], Error>;
  stockMarket: StockMarket;
  stockDuration: StockDuration;
  onStockMarketChange: (market: StockMarket) => void;
  onStockDurationChange: (duration: StockDuration) => void;
  commute: UseMutationResult<
    ApiResponse<Commute>,
    Error,
    { origin_address: string; destination_address: string },
    unknown
  >;
};

function mapGuestStock(
  stock: Stock,
  market: StockMarket,
): Briefing["stocks"][number] {
  const currency = market === "domestic" ? "KRW" : "USD";
  return {
    symbol: stock.symbol,
    name: stock.name,
    price: new Intl.NumberFormat(market === "domestic" ? "ko-KR" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: market === "domestic" ? 0 : 2,
    }).format(stock.price),
    change: stock.changeRate,
    issue: stock.relatedIssues[0]?.title ?? "",
    changeDirection: stock.changeDirection,
    priceHistory: stock.priceHistory,
    priceChart: stock.priceChart,
    relatedIssues: stock.relatedIssues,
  };
}

function mapFavoriteStock(
  item: Favorites["stocks"][number],
): Briefing["stocks"][number] {
  return {
    symbol: item.stock.code,
    name: item.stock.name,
    price: item.current_price.toLocaleString(),
    change: item.change_rate,
    issue: item.related_issue_summary ?? "",
    changeDirection: item.change_direction,
    priceHistory: item.sparkline_7d,
    relatedIssues: [],
  };
}

function mapFavoriteWeather(item: Favorites["weather"][number]): Weather {
  return {
    temperature: item.weather.temp_c,
    condition: item.weather.condition,
    location: item.favorite.label,
    hourly: item.hourly.map((forecast) => ({
      time: forecast.time,
      temperature: forecast.temp_c,
      condition: forecast.condition,
    })),
  };
}

function PageState({
  icon,
  message,
  action,
}: {
  icon: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <div className={dashboardPageStyles.state}>
        <div className={dashboardPageStyles.stateContent}>
          {icon}
          <p className={dashboardPageStyles.stateMessage}>{message}</p>
          {action}
        </div>
      </div>
    </>
  );
}
