"use client";

import { useMemo, useState } from "react";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { ApiResponse } from "@/lib/api/response";
import type {
  Commute,
  CommuteFavoriteUpdatePayload,
  FavoriteCreatePayload,
  Favorites,
  Stock,
  StockDuration,
  StockMarket,
  StockSearchResult,
  Weather,
} from "@/app/(page)/(home)/type";
import type { StockCardItem } from "@/app/(page)/(home)/type/briefing";
import { HeroCard } from "../HeroCard";
import { StockImpactCard } from "../StockImpactCard";
import { WeatherCard } from "../WeatherCard";
import { FavoriteAddModal, type FavoriteModalKind } from "./FavoriteAddModal";
import { dashboardPageStyles } from "./styles";

export function DashboardPage({
  weather,
  guest,
  favorites,
}: {
  weather: UseQueryResult<Weather, Error>;
  guest: GuestTopData | null;
  favorites: {
    data?: Favorites;
    isLoading: boolean;
    isPending: boolean;
    onCreate: (payload: FavoriteCreatePayload) => void;
    onUpdateCommute: (payload: CommuteFavoriteUpdatePayload) => void;
    onDeleteCommute: (id: number) => void;
    isCommuteMutationPending: boolean;
    pendingFavoriteKind: FavoriteCreatePayload["kind"] | null;
    searchResults: StockSearchResult[];
    isSearching: boolean;
    onSearchStocks: (query: string) => void;
    topStocks: Stock[];
    isTopStocksLoading: boolean;
    stockMarket: StockMarket;
    onStockMarketChange: (market: StockMarket) => void;
  } | null;
}) {
  const [favoriteModal, setFavoriteModal] = useState<FavoriteModalKind>(null);
  const [editingCommute, setEditingCommute] = useState<
    Favorites["commutes"][number] | null
  >(null);
  const [deletingCommuteId, setDeletingCommuteId] = useState<number | null>(
    null,
  );
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

  const effectiveCommuteId = favorites?.data?.commutes.some(
    (item) => item.favorite.id === selectedCommuteId,
  )
    ? selectedCommuteId
    : favorites?.data?.commutes[0]?.favorite.id;
  const selectedCommute = favorites?.data?.commutes.find(
    (item) => item.favorite.id === effectiveCommuteId,
  );
  const displayedStocks = favorites?.data
    ? favorites.data.stocks.map(mapFavoriteStock)
    : guest
      ? (guest.stocks.data?.map((stock) =>
          mapGuestStock(stock, guest.stockMarket),
        ) ?? [])
      : [];

  return (
    <div id="top" className={dashboardPageStyles.root}>
      <AppHeader />
      <main className={dashboardPageStyles.main}>
        <div className={dashboardPageStyles.briefingHeader}>
          <div className={dashboardPageStyles.briefingIntro}>
            <h1 className={dashboardPageStyles.greeting}>오늘의 이동과 시장</h1>
            <p className={dashboardPageStyles.date}>{dateLabel}</p>
          </div>
        </div>
        <div className={dashboardPageStyles.featureGrid}>
          <WeatherCard
            guestWeather={weather.data}
            isLoading={weather.isPending}
          />
          <HeroCard
            guestCommute={guest?.commute}
            favoriteCommute={selectedCommute}
            isFavoriteLoading={
              favorites?.isLoading ||
              favorites?.pendingFavoriteKind === "commute"
            }
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
              setDeletingCommuteId(id);
            }}
            onAddFavorite={favorites ? setFavoriteModal : undefined}
          />
          <StockImpactCard
            stocks={displayedStocks}
            market={guest?.stockMarket}
            duration={guest?.stockDuration}
            onMarketChange={guest?.onStockMarketChange}
            modalStocks={guest?.modalStocks.data?.map((stock) =>
              mapGuestStock(stock, guest.modalStockMarket),
            )}
            modalMarket={guest?.modalStockMarket}
            modalDuration={guest?.modalStockDuration}
            onModalMarketChange={guest?.onModalStockMarketChange}
            onModalDurationChange={guest?.onModalStockDurationChange}
            isModalLoading={guest?.modalStocks.isFetching}
            isModalError={guest?.modalStocks.isError}
            isLoading={
              guest?.stocks.isFetching ||
              favorites?.isLoading ||
              favorites?.pendingFavoriteKind === "stock"
            }
            isError={guest?.stocks.isError}
            hasFavorites={
              favorites ? favorites.data?.stocks.length !== 0 : undefined
            }
            onAddFavorite={() => setFavoriteModal("stock")}
            isFavoriteList={Boolean(favorites)}
          />
        </div>
      </main>
      <SiteFooter />
      <ConfirmDialog
        isOpen={deletingCommuteId !== null}
        title="즐겨찾기에서 삭제할까요?"
        description="선택한 경로가 즐겨찾기에서 삭제됩니다. 필요하면 언제든 다시 등록할 수 있어요."
        confirmLabel="삭제"
        isPending={favorites?.isCommuteMutationPending}
        onClose={() => setDeletingCommuteId(null)}
        onConfirm={() => {
          if (deletingCommuteId !== null) {
            favorites?.onDeleteCommute(deletingCommuteId);
            setDeletingCommuteId(null);
          }
        }}
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

type GuestTopData = {
  stocks: UseQueryResult<Stock[], Error>;
  stockMarket: StockMarket;
  stockDuration: StockDuration;
  onStockMarketChange: (market: StockMarket) => void;
  modalStocks: UseQueryResult<Stock[], Error>;
  modalStockMarket: StockMarket;
  modalStockDuration: StockDuration;
  onModalStockMarketChange: (market: StockMarket) => void;
  onModalStockDurationChange: (duration: StockDuration) => void;
  commute: UseMutationResult<
    ApiResponse<Commute>,
    Error,
    { origin_address: string; destination_address: string },
    unknown
  >;
};

function mapGuestStock(stock: Stock, market: StockMarket): StockCardItem {
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
    changeDirection: stock.changeDirection,
    priceHistory: stock.priceHistory,
    priceChart: stock.priceChart,
  };
}

function mapFavoriteStock(item: Favorites["stocks"][number]): StockCardItem {
  return {
    symbol: item.stock.code,
    name: item.stock.name,
    price: item.current_price.toLocaleString(),
    change: item.change_rate,
    changeDirection: item.change_direction,
    priceHistory: item.sparkline_7d,
    priceChart: item.price_chart,
  };
}
