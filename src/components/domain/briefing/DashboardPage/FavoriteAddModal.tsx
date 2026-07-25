"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type {
  FavoriteCreatePayload,
  StockSearchResult,
} from "@/app/(page)/(home)/type";
import { favoriteModalStyles } from "./favorites.styles";

export type FavoriteModalKind = "weather" | "stock" | "commute" | null;

export function FavoriteAddModal({
  kind,
  isPending,
  searchResults,
  isSearching,
  onSearchStocks,
  onCreate,
  onClose,
}: {
  kind: FavoriteModalKind;
  isPending: boolean;
  searchResults: StockSearchResult[];
  isSearching: boolean;
  onSearchStocks: (query: string) => void;
  onCreate: (payload: FavoriteCreatePayload) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState("");
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  if (!kind) return null;

  function addWeather() {
    navigator.geolocation.getCurrentPosition(({ coords }) =>
      onCreate({
        kind: "weather",
        label: label.trim() || "현재 위치",
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    );
  }

  return (
    <div className={favoriteModalStyles.layer}>
      <button
        type="button"
        className={favoriteModalStyles.backdrop}
        onClick={onClose}
        aria-label="즐겨찾기 등록 닫기"
      />
      <section className={favoriteModalStyles.panel} role="dialog" aria-modal>
        <div className={favoriteModalStyles.header}>
          <h2 className={favoriteModalStyles.title}>
            {kind === "stock"
              ? "관심 종목 등록"
              : kind === "weather"
                ? "날씨 즐겨찾기 등록"
                : "출근길 즐겨찾기 등록"}
          </h2>
          <button
            type="button"
            className={favoriteModalStyles.close}
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>
        {kind === "stock" ? (
          <>
            <form
              className={favoriteModalStyles.search}
              onSubmit={(event) => {
                event.preventDefault();
                if (query.trim()) onSearchStocks(query.trim());
              }}
            >
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="국내 종목명·코드 또는 해외 티커 검색"
              />
              <Button type="submit" isPending={isSearching}>
                <Search size={16} /> 검색
              </Button>
            </form>
            <div className={favoriteModalStyles.results}>
              {searchResults.map((stock) => (
                <button
                  key={`${stock.market}-${stock.code}`}
                  type="button"
                  className={favoriteModalStyles.result}
                  disabled={isPending}
                  onClick={() => onCreate({ kind: "stock", code: stock.code })}
                >
                  <span>
                    <strong>{stock.name}</strong>
                    <small>{stock.code}</small>
                  </span>
                  <em>{stock.market}</em>
                </button>
              ))}
            </div>
          </>
        ) : kind === "weather" ? (
          <div className={favoriteModalStyles.form}>
            <Input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="즐겨찾기 이름 (예: 집)"
            />
            <Button isPending={isPending} onClick={addWeather}>
              현재 위치 등록
            </Button>
          </div>
        ) : (
          <form
            className={favoriteModalStyles.form}
            onSubmit={(event) => {
              event.preventDefault();
              onCreate({
                kind: "commute",
                label: label.trim() || "출근길",
                originAddress: originAddress.trim(),
                destinationAddress: destinationAddress.trim(),
              });
            }}
          >
            <Input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="경로 이름"
            />
            <Input
              value={originAddress}
              onChange={(event) => setOriginAddress(event.target.value)}
              placeholder="출발지 주소"
              required
            />
            <Input
              value={destinationAddress}
              onChange={(event) => setDestinationAddress(event.target.value)}
              placeholder="도착지 주소"
              required
            />
            <Button type="submit" isPending={isPending}>
              경로 등록
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}
