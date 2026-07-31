"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/components/ui/ToastProvider";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/response";
import { queryKeys } from "@/lib/query-keys";
import {
  briefingActionResultSchema,
  briefingSchema,
  type FeedbackValue,
} from "../type/briefing";
import {
  favoritesSchema,
  type FavoriteCreatePayload,
  stockSearchResultsSchema,
} from "../type/favorites";
import {
  commuteSchema,
  stocksSchema,
  type StockDuration,
  weatherSchema,
  type StockMarket,
} from "../type/guest";

function getBriefing() {
  return apiClient("/api/briefing", briefingSchema);
}

function startBriefing(briefingId: string) {
  return apiClient("/api/briefing/start", briefingActionResultSchema, {
    method: "POST",
    body: { briefingId },
  });
}

function saveBriefing(payload: { briefingId: string; saved: boolean }) {
  return apiClient("/api/briefing/save", briefingActionResultSchema, {
    method: "POST",
    body: payload,
  });
}

function submitBriefingFeedback(payload: {
  briefingId: string;
  value: FeedbackValue;
}) {
  return apiClient("/api/briefing/feedback", briefingActionResultSchema, {
    method: "POST",
    body: payload,
  });
}

function trackBriefingShare(briefingId: string) {
  return apiClient("/api/briefing/share", briefingActionResultSchema, {
    method: "POST",
    body: { briefingId },
  });
}

export function useDailyBriefing(isEnabled = true) {
  return useQuery({
    queryKey: queryKeys.briefing.daily("today"),
    queryFn: getBriefing,
    select: (response) => response.data,
    enabled: isEnabled,
  });
}

export function useBriefingMutations() {
  const toast = useToast();
  const onError = (error: Error) =>
    toast.error(
      error instanceof ApiError
        ? error.message
        : "요청 처리 중 오류가 발생했습니다.",
    );
  const onSuccess = (response: { message: string }) =>
    toast.success(response.message);

  const start = useMutation({ mutationFn: startBriefing, onSuccess, onError });
  const save = useMutation({ mutationFn: saveBriefing, onSuccess, onError });
  const feedback = useMutation({
    mutationFn: submitBriefingFeedback,
    onSuccess,
    onError,
  });
  const share = useMutation({
    mutationFn: trackBriefingShare,
    onSuccess,
    onError,
  });

  return { start, save, feedback, share };
}

export function useGuestWeather(
  coordinates: { latitude: number; longitude: number } | null,
  isEnabled = true,
  useDefaultLocation = false,
) {
  return useQuery({
    queryKey: queryKeys.guest.weather(
      coordinates?.latitude,
      coordinates?.longitude,
    ),
    queryFn: () => {
      if (!coordinates) return apiClient("/api/public/weather", weatherSchema);
      const query = new URLSearchParams({
        lat: String(coordinates.latitude),
        lng: String(coordinates.longitude),
      });
      return apiClient(`/api/public/weather?${query}`, weatherSchema);
    },
    select: (response) => response.data,
    enabled: isEnabled && (coordinates !== null || useDefaultLocation),
  });
}

export function useTopStocks(
  market: StockMarket,
  duration: StockDuration,
  isEnabled = true,
) {
  return useQuery({
    queryKey: queryKeys.guest.stocks(market, duration),
    queryFn: () =>
      apiClient(
        `/api/public/stocks?market=${market}&duration=${duration}`,
        stocksSchema,
      ),
    placeholderData: (previousData) => previousData,
    select: (response) => response.data.slice(0, 10),
    enabled: isEnabled,
  });
}

export function useCommuteCheck() {
  const toast = useToast();
  return useMutation({
    mutationFn: (payload: {
      origin_address: string;
      destination_address: string;
    }) =>
      apiClient("/api/public/commute", commuteSchema, {
        method: "POST",
        body: payload,
      }),
    onError: (error: Error) =>
      toast.error(
        error instanceof ApiError
          ? error.message
          : "길찾기 정보를 불러오지 못했습니다.",
      ),
  });
}

export function useFavorites(isEnabled = true) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const query = useQuery({
    queryKey: queryKeys.favorites.lists(),
    queryFn: () => apiClient("/api/user/favorites", favoritesSchema),
    select: (response) => response.data,
    enabled: isEnabled,
  });
  const create = useMutation({
    mutationFn: (payload: FavoriteCreatePayload) =>
      apiClient("/api/user/favorites", z.null(), {
        method: "POST",
        body: payload,
      }),
    onSuccess: async (response) => {
      toast.success(response.message);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.favorites.all,
      });
    },
    onError: (error: Error) =>
      toast.error(
        error instanceof ApiError
          ? error.message
          : "즐겨찾기를 추가하지 못했습니다.",
      ),
  });
  const searchStocks = useMutation({
    mutationFn: (searchQuery: string) =>
      apiClient(
        `/api/public/stocks/search?q=${encodeURIComponent(searchQuery)}`,
        stockSearchResultsSchema,
      ),
  });
  return { query, create, searchStocks };
}
