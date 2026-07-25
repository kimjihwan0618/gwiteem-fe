"use client";

import { CloudSun, Plus, Route, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type {
  FavoriteCreatePayload,
  Favorites,
} from "@/app/(page)/(home)/type";
import { favoritesCardStyles } from "./favorites.styles";

type FavoriteKind = FavoriteCreatePayload["kind"];

export function FavoritesCard({
  data,
  isLoading,
  isPending,
  onCreate,
}: {
  data?: Favorites;
  isLoading: boolean;
  isPending: boolean;
  onCreate: (payload: FavoriteCreatePayload) => void;
}) {
  const [openForm, setOpenForm] = useState<FavoriteKind | null>(null);
  const [stockCode, setStockCode] = useState("");
  const [weatherLabel, setWeatherLabel] = useState("현재 위치");
  const [commuteLabel, setCommuteLabel] = useState("출근길");
  const [originAddress, setOriginAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  function addCurrentWeather() {
    navigator.geolocation.getCurrentPosition(({ coords }) =>
      onCreate({
        kind: "weather",
        label: weatherLabel.trim(),
        latitude: coords.latitude,
        longitude: coords.longitude,
      }),
    );
  }

  return (
    <Card className={favoritesCardStyles.root}>
      <CardHeader>
        <CardTitle>내 즐겨찾기</CardTitle>
        <span className={favoritesCardStyles.limit}>항목별 최대 5개 표시</span>
      </CardHeader>
      <div className={favoritesCardStyles.grid}>
        <FavoriteSection
          title="날씨"
          icon={<CloudSun size={17} />}
          isEmpty={!data?.weather.length}
          isLoading={isLoading}
          onAdd={() => setOpenForm(openForm === "weather" ? null : "weather")}
        >
          {data?.weather.map((item) => (
            <div key={item.favorite.id} className={favoritesCardStyles.item}>
              <span>{item.favorite.label}</span>
              <strong>
                {item.weather.temp_c}° · {item.weather.condition}
              </strong>
            </div>
          ))}
          {openForm === "weather" && (
            <div className={favoritesCardStyles.form}>
              <Input
                value={weatherLabel}
                onChange={(event) => setWeatherLabel(event.target.value)}
                placeholder="위치 이름"
              />
              <Button
                size="sm"
                isPending={isPending}
                disabled={!weatherLabel.trim()}
                onClick={addCurrentWeather}
              >
                현재 위치 추가
              </Button>
            </div>
          )}
        </FavoriteSection>
        <FavoriteSection
          title="관심 종목"
          icon={<TrendingUp size={17} />}
          isEmpty={!data?.stocks.length}
          isLoading={isLoading}
          onAdd={() => setOpenForm(openForm === "stock" ? null : "stock")}
        >
          {data?.stocks.map((item) => (
            <div key={item.stock.code} className={favoritesCardStyles.item}>
              <span>
                {item.stock.name} · {item.stock.code}
              </span>
              <strong>
                {item.change_rate > 0 ? "+" : ""}
                {item.change_rate}%
              </strong>
            </div>
          ))}
          {openForm === "stock" && (
            <form
              className={favoritesCardStyles.form}
              onSubmit={(event) => {
                event.preventDefault();
                onCreate({ kind: "stock", code: stockCode.trim() });
              }}
            >
              <Input
                value={stockCode}
                onChange={(event) => setStockCode(event.target.value)}
                placeholder="종목 코드 또는 티커"
                required
              />
              <Button
                type="submit"
                size="sm"
                isPending={isPending}
                disabled={!stockCode.trim()}
              >
                추가
              </Button>
            </form>
          )}
        </FavoriteSection>
        <FavoriteSection
          title="출근길"
          icon={<Route size={17} />}
          isEmpty={!data?.commutes.length}
          isLoading={isLoading}
          onAdd={() => setOpenForm(openForm === "commute" ? null : "commute")}
        >
          {data?.commutes.map((item) => (
            <div
              key={item.favorite.id}
              className={favoritesCardStyles.routeItem}
            >
              <span>{item.favorite.label}</span>
              <strong>{item.commute.estimated_minutes}분</strong>
              <small>
                {item.favorite.origin_address} →{" "}
                {item.favorite.destination_address}
              </small>
            </div>
          ))}
          {openForm === "commute" && (
            <form
              className={favoritesCardStyles.form}
              onSubmit={(event) => {
                event.preventDefault();
                onCreate({
                  kind: "commute",
                  label: commuteLabel.trim(),
                  originAddress: originAddress.trim(),
                  destinationAddress: destinationAddress.trim(),
                });
              }}
            >
              <Input
                value={commuteLabel}
                onChange={(event) => setCommuteLabel(event.target.value)}
                placeholder="경로 이름"
                required
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
              <Button
                type="submit"
                size="sm"
                isPending={isPending}
                disabled={
                  !commuteLabel.trim() ||
                  !originAddress.trim() ||
                  !destinationAddress.trim()
                }
              >
                경로 추가
              </Button>
            </form>
          )}
        </FavoriteSection>
      </div>
    </Card>
  );
}

function FavoriteSection({
  title,
  icon,
  isEmpty,
  isLoading,
  onAdd,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isEmpty: boolean;
  isLoading: boolean;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className={favoritesCardStyles.section}>
      <div className={favoritesCardStyles.sectionHeader}>
        <h3 className={favoritesCardStyles.sectionTitle}>
          {icon} {title}
        </h3>
        <button
          type="button"
          className={favoritesCardStyles.addButton}
          onClick={onAdd}
          aria-label={`${title} 즐겨찾기 추가`}
        >
          <Plus size={16} />
        </button>
      </div>
      <div className={favoritesCardStyles.list}>
        {isLoading ? (
          <p className={favoritesCardStyles.loading}>불러오는 중...</p>
        ) : isEmpty ? (
          <button
            type="button"
            className={favoritesCardStyles.empty}
            onClick={onAdd}
          >
            <Plus size={16} /> 첫 즐겨찾기 추가
          </button>
        ) : null}
        {children}
      </div>
    </section>
  );
}
