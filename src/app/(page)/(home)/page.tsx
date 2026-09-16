"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { DashboardPage } from "@/components/domain/briefing/DashboardPage";
import {
  useBriefingMutations,
  useCommuteCheck,
  useDailyBriefing,
  useFavorites,
  useGuestWeather,
  useTopStocks,
} from "./hooks";
import type { StockDuration, StockMarket } from "./type";

export default function Home() {
  const { user, isReady } = useAuth();
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLocationUnavailable, setIsLocationUnavailable] = useState(false);
  const [stockMarket, setStockMarket] = useState<StockMarket>("domestic");
  const stockDuration: StockDuration = "1d";
  const [stockModalMarket, setStockModalMarket] =
    useState<StockMarket>("domestic");
  const [stockModalDuration, setStockModalDuration] =
    useState<StockDuration>("1d");
  const isGuest = isReady && !user;
  const briefing = useDailyBriefing();
  const actions = useBriefingMutations();
  const weather = useGuestWeather(coordinates, isGuest, isLocationUnavailable);
  const stocks = useTopStocks(stockMarket, stockDuration, isReady);
  const modalStocks = useTopStocks(
    stockModalMarket,
    stockModalDuration,
    isGuest,
  );
  const commute = useCommuteCheck();
  const favorites = useFavorites(isReady && Boolean(user));

  useEffect(() => {
    if (!isGuest) return;
    if (!navigator.geolocation) {
      const unavailableTimer = window.setTimeout(
        () => setIsLocationUnavailable(true),
        0,
      );
      return () => window.clearTimeout(unavailableTimer);
    }
    const locationFallbackTimer = window.setTimeout(
      () => setIsLocationUnavailable(true),
      8500,
    );
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        window.clearTimeout(locationFallbackTimer);
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setIsLocationUnavailable(false);
      },
      () => {
        window.clearTimeout(locationFallbackTimer);
        setIsLocationUnavailable(true);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
    return () => window.clearTimeout(locationFallbackTimer);
  }, [isGuest]);

  return (
    <DashboardPage
      briefing={briefing}
      actions={actions}
      favorites={
        user
          ? {
              data: favorites.query.data,
              isLoading: favorites.query.isLoading,
              isPending: favorites.create.isPending,
              onCreate: favorites.create.mutate,
              onUpdateCommute: favorites.updateCommute.mutate,
              onDeleteCommute: favorites.deleteCommute.mutate,
              isCommuteMutationPending:
                favorites.updateCommute.isPending ||
                favorites.deleteCommute.isPending,
              pendingFavoriteKind:
                favorites.updateCommute.isPending ||
                favorites.deleteCommute.isPending
                  ? "commute"
                  : favorites.create.isPending
                    ? (favorites.create.variables?.kind ?? null)
                    : null,
              searchResults: favorites.searchStocks.data?.data ?? [],
              isSearching: favorites.searchStocks.isPending,
              onSearchStocks: favorites.searchStocks.mutate,
              topStocks: stocks.data ?? [],
              isTopStocksLoading: stocks.isFetching,
              stockMarket,
              onStockMarketChange: setStockMarket,
            }
          : null
      }
      guest={
        isGuest
          ? {
              weather,
              stocks,
              stockMarket,
              stockDuration,
              onStockMarketChange: setStockMarket,
              modalStocks,
              modalStockMarket: stockModalMarket,
              modalStockDuration: stockModalDuration,
              onModalStockMarketChange: setStockModalMarket,
              onModalStockDurationChange: setStockModalDuration,
              commute,
            }
          : null
      }
    />
  );
}
