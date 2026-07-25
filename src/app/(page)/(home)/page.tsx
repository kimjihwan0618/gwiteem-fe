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
  const [stockMarket, setStockMarket] = useState<StockMarket>("domestic");
  const [stockDuration, setStockDuration] = useState<StockDuration>("realtime");
  const isGuest = isReady && !user;
  const briefing = useDailyBriefing();
  const actions = useBriefingMutations();
  const weather = useGuestWeather(coordinates, isGuest);
  const stocks = useTopStocks(stockMarket, stockDuration, isGuest);
  const commute = useCommuteCheck();
  const favorites = useFavorites(isReady && Boolean(user));

  useEffect(() => {
    if (!isGuest || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      () => undefined,
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
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
              searchResults: favorites.searchStocks.data?.data ?? [],
              isSearching: favorites.searchStocks.isPending,
              onSearchStocks: favorites.searchStocks.mutate,
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
              onStockDurationChange: setStockDuration,
              commute,
            }
          : null
      }
    />
  );
}
