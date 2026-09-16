"use client";

import { MapPin, Search, X } from "lucide-react";
import Script from "next/script";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import type {
  FavoriteCreatePayload,
  CommuteFavoriteUpdatePayload,
  Favorites,
  Stock,
  StockMarket,
  StockSearchResult,
} from "@/app/(page)/(home)/type";
import {
  favoriteMarketTabVariants,
  favoriteModalStyles,
} from "./favorites.styles";

export type FavoriteModalKind = "weather" | "stock" | "commute" | null;

export function FavoriteAddModal({
  kind,
  isPending,
  searchResults,
  isSearching,
  onSearchStocks,
  topStocks,
  isTopStocksLoading,
  stockMarket,
  onStockMarketChange,
  onCreate,
  editingCommute,
  onUpdateCommute,
  onClose,
}: {
  kind: FavoriteModalKind;
  isPending: boolean;
  searchResults: StockSearchResult[];
  isSearching: boolean;
  onSearchStocks: (query: string) => void;
  topStocks: Stock[];
  isTopStocksLoading: boolean;
  stockMarket: StockMarket;
  onStockMarketChange: (market: StockMarket) => void;
  onCreate: (payload: FavoriteCreatePayload) => void;
  editingCommute?: Favorites["commutes"][number] | null;
  onUpdateCommute: (payload: CommuteFavoriteUpdatePayload) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [label, setLabel] = useState(editingCommute?.favorite.label ?? "");
  const [originAddress, setOriginAddress] = useState(
    editingCommute?.favorite.origin_address ?? "",
  );
  const [destinationAddress, setDestinationAddress] = useState(
    editingCommute?.favorite.destination_address ?? "",
  );
  const [hasSearchedStocks, setHasSearchedStocks] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{
    code: string;
    name: string;
  } | null>(null);
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

  function searchAddress(target: "origin" | "destination") {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: (addressData) => {
        const address =
          addressData.roadAddress ||
          addressData.address ||
          addressData.jibunAddress;
        if (target === "origin") setOriginAddress(address);
        else setDestinationAddress(address);
      },
    }).open();
  }

  return (
    <div className={favoriteModalStyles.layer}>
      {kind === "commute" && (
        <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      )}
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
                : editingCommute
                  ? "즐겨찾기 경로 수정"
                  : "경로 즐겨찾기 등록"}
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
                if (query.trim()) {
                  setHasSearchedStocks(true);
                  onSearchStocks(query.trim());
                }
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
            <div className={favoriteModalStyles.stockSections}>
              {searchResults.length > 0 && (
                <StockChoices
                  title="검색 결과"
                  stocks={searchResults.map((stock) => ({
                    code: stock.code,
                    name: stock.name,
                    market: stock.market,
                  }))}
                  isPending={isPending}
                  onSelect={setSelectedStock}
                />
              )}
              {hasSearchedStocks &&
                !isSearching &&
                searchResults.length === 0 && (
                  <p className={favoriteModalStyles.searchEmpty}>
                    일치하는 종목이 없습니다. 종목명이나 코드를 다시 확인해
                    주세요.
                  </p>
                )}
              <section>
                <div className={favoriteModalStyles.sectionHeader}>
                  <h3 className={favoriteModalStyles.sectionTitle}>
                    인기 종목 Top10
                  </h3>
                  <div className={favoriteModalStyles.marketTabs}>
                    {(["domestic", "overseas"] as const).map((market) => (
                      <button
                        key={market}
                        type="button"
                        className={favoriteMarketTabVariants({
                          isActive: stockMarket === market,
                        })}
                        aria-pressed={stockMarket === market}
                        onClick={() => onStockMarketChange(market)}
                      >
                        {market === "domestic" ? "국내" : "해외"}
                      </button>
                    ))}
                  </div>
                </div>
                {isTopStocksLoading ? (
                  <div className={favoriteModalStyles.results} role="status">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Skeleton
                        key={index}
                        className={favoriteModalStyles.resultSkeleton}
                      />
                    ))}
                  </div>
                ) : (
                  <StockChoices
                    stocks={topStocks.map((stock) => ({
                      code: stock.symbol,
                      name: stock.name,
                      market: stockMarket,
                    }))}
                    isPending={isPending}
                    onSelect={setSelectedStock}
                  />
                )}
              </section>
            </div>
            <ConfirmDialog
              isOpen={Boolean(selectedStock)}
              title="관심 종목 등록"
              description={`${selectedStock?.name ?? "선택한 종목"}을(를) 관심 종목으로 등록하시겠습니까?`}
              confirmLabel="등록"
              isPending={isPending}
              onClose={() => setSelectedStock(null)}
              onConfirm={() => {
                if (selectedStock)
                  onCreate({ kind: "stock", code: selectedStock.code });
              }}
            />
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
              const commutePayload = {
                label: label.trim() || "이동 경로",
                originAddress: originAddress.trim(),
                destinationAddress: destinationAddress.trim(),
              };
              if (editingCommute)
                onUpdateCommute({
                  id: editingCommute.favorite.id,
                  ...commutePayload,
                });
              else onCreate({ kind: "commute", ...commutePayload });
            }}
          >
            <Input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="경로 이름"
            />
            <AddressPicker
              label="출발지"
              value={originAddress}
              onSearch={() => searchAddress("origin")}
            />
            <AddressPicker
              label="도착지"
              value={destinationAddress}
              onSearch={() => searchAddress("destination")}
            />
            <Button
              type="submit"
              disabled={!originAddress || !destinationAddress}
              isPending={isPending}
            >
              {editingCommute ? "경로 수정" : "경로 등록"}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}

function StockChoices({
  title,
  stocks,
  isPending,
  onSelect,
}: {
  title?: string;
  stocks: Array<{ code: string; name: string; market: string }>;
  isPending: boolean;
  onSelect: (stock: { code: string; name: string }) => void;
}) {
  return (
    <section>
      {title && <h3 className={favoriteModalStyles.sectionTitle}>{title}</h3>}
      <div className={favoriteModalStyles.results}>
        {stocks.map((stock, index) => (
          <button
            key={`${stock.market}-${stock.code}`}
            type="button"
            className={favoriteModalStyles.result}
            disabled={isPending}
            onClick={() => onSelect({ code: stock.code, name: stock.name })}
          >
            <span className={favoriteModalStyles.resultIdentity}>
              <b className={favoriteModalStyles.rank}>{index + 1}</b>
              <span>
                <strong>{stock.name}</strong>
                <small>{stock.code}</small>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function AddressPicker({
  label,
  value,
  onSearch,
}: {
  label: string;
  value: string;
  onSearch: () => void;
}) {
  return (
    <label className={favoriteModalStyles.addressField}>
      <span className={favoriteModalStyles.addressLabel}>{label}</span>
      <button
        type="button"
        className={favoriteModalStyles.addressPicker}
        onClick={onSearch}
      >
        <span>{value || `${label} 주소를 검색하세요`}</span>
        {value ? <MapPin size={16} /> : <Search size={16} />}
      </button>
    </label>
  );
}
