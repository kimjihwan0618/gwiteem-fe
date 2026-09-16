"use client";

import {
  ArrowLeft,
  ChartNoAxesCombined,
  ChevronRight,
  Info,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Briefing } from "@/app/(page)/(home)/type/briefing";
import type { StockDuration, StockMarket } from "@/app/(page)/(home)/type";
import { DetailModal } from "../DetailModal";
import {
  stockChangeVariants,
  stockFavoriteChipVariants,
  stockImpactCardStyles,
} from "./styles";

const durationOptions = [
  { value: "1d", label: "일" },
  { value: "1w", label: "주" },
  { value: "1mo", label: "월" },
  { value: "1y", label: "년" },
] as const;

export function StockImpactCard({
  stocks,
  market,
  duration,
  onMarketChange,
  isLoading,
  isError,
  hasFavorites,
  onAddFavorite,
  favoriteOptions,
  selectedFavoriteId,
  onFavoriteSelect,
  isFavoriteList,
  modalStocks,
  modalMarket,
  modalDuration,
  onModalMarketChange,
  onModalDurationChange,
  isModalLoading,
  isModalError,
}: {
  stocks: Briefing["stocks"];
  market?: StockMarket;
  duration?: StockDuration;
  onMarketChange?: (market: StockMarket) => void;
  isLoading?: boolean;
  isError?: boolean;
  hasFavorites?: boolean;
  onAddFavorite?: () => void;
  favoriteOptions?: Array<{ id: string; label: string }>;
  selectedFavoriteId?: string;
  onFavoriteSelect?: (id: string) => void;
  isFavoriteList?: boolean;
  modalStocks?: Briefing["stocks"];
  modalMarket?: StockMarket;
  modalDuration?: StockDuration;
  onModalMarketChange?: (market: StockMarket) => void;
  onModalDurationChange?: (duration: StockDuration) => void;
  isModalLoading?: boolean;
  isModalError?: boolean;
}) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const effectiveModalStocks = modalStocks ?? stocks;
  const selectedStock =
    [...stocks, ...effectiveModalStocks].find(
      ({ symbol }) => symbol === selectedSymbol,
    ) ?? null;

  return (
    <Card id="stocks" className={stockImpactCardStyles.root}>
      <CardHeader className={stockImpactCardStyles.header}>
        <div className={stockImpactCardStyles.titleGroup}>
          <span className={stockImpactCardStyles.titleIcon} aria-hidden="true">
            <ChartNoAxesCombined size={19} />
          </span>
          <CardTitle className={stockImpactCardStyles.title}>
            {market ? "시장 요약" : "관심 종목 영향"}
          </CardTitle>
        </div>
        {market ? (
          <button
            type="button"
            className={stockImpactCardStyles.expandButton}
            aria-haspopup="dialog"
            onClick={() => {
              setSelectedSymbol(null);
              setIsModalOpen(true);
            }}
          >
            Top10 전체 보기
            <ChevronRight size={16} />
          </button>
        ) : isFavoriteList ? (
          <button
            type="button"
            className={stockImpactCardStyles.headerAddButton}
            onClick={onAddFavorite}
          >
            <Plus size={15} /> 종목 추가
          </button>
        ) : (
          <button
            aria-label="관심 종목 전체 보기"
            className={stockImpactCardStyles.moreButton}
          >
            <ChevronRight size={19} />
          </button>
        )}
      </CardHeader>
      {market && onMarketChange && (
        <div
          className={stockImpactCardStyles.summaryMarketTabs}
          aria-label="시장 요약 국가 선택"
        >
          {(["domestic", "overseas"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={
                market === value
                  ? stockImpactCardStyles.activeSummaryMarketTab
                  : stockImpactCardStyles.summaryMarketTab
              }
              aria-pressed={market === value}
              disabled={isLoading}
              onClick={() => onMarketChange(value)}
            >
              {value === "domestic" ? "국내" : "해외"}
            </button>
          ))}
        </div>
      )}
      <div className={stockImpactCardStyles.body}>
        <div className={stockImpactCardStyles.list}>
          {hasFavorites === false && onAddFavorite ? (
            <button
              type="button"
              className={stockImpactCardStyles.emptyFavorite}
              onClick={onAddFavorite}
            >
              <Plus size={17} />
              관심 종목을 등록하세요
            </button>
          ) : isLoading ? (
            <StockRowsSkeleton count={3} />
          ) : isError ? (
            <div className={stockImpactCardStyles.error} role="alert">
              <Info size={17} />
              <span>주식 데이터를 불러오지 못했습니다.</span>
            </div>
          ) : stocks.length === 0 ? (
            <div className={stockImpactCardStyles.empty}>
              표시할 주식 데이터가 없습니다.
            </div>
          ) : (
            <>
              {stocks
                .slice(0, isFavoriteList ? stocks.length : 3)
                .map((stock, index) => (
                  <div key={stock.symbol}>
                    <StockRow
                      stock={stock}
                      rank={index + 1}
                      showRank={!isFavoriteList}
                      onSelect={() => {
                        setSelectedSymbol(stock.symbol);
                        setIsModalOpen(true);
                      }}
                    />
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
      {favoriteOptions && favoriteOptions.length > 0 && (
        <div className={stockImpactCardStyles.favoriteList}>
          {favoriteOptions.map((favorite) => (
            <button
              key={favorite.id}
              type="button"
              className={stockFavoriteChipVariants({
                isActive: favorite.id === selectedFavoriteId,
              })}
              aria-pressed={favorite.id === selectedFavoriteId}
              onClick={() => onFavoriteSelect?.(favorite.id)}
            >
              {favorite.label}
            </button>
          ))}
          {onAddFavorite && (
            <button
              type="button"
              className={stockImpactCardStyles.favoriteAddButton}
              onClick={onAddFavorite}
            >
              <Plus size={13} /> 종목 추가
            </button>
          )}
        </div>
      )}
      <DetailModal
        title="주식 종목 Top10"
        icon={<ChartNoAxesCombined size={19} />}
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedSymbol(null);
          setIsModalOpen(false);
        }}
      >
        {modalMarket && onModalMarketChange && (
          <div className={stockImpactCardStyles.controls}>
            <div className={stockImpactCardStyles.tabs}>
              {(["domestic", "overseas"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={
                    modalMarket === value
                      ? stockImpactCardStyles.activeTab
                      : stockImpactCardStyles.tab
                  }
                  aria-pressed={modalMarket === value}
                  disabled={isModalLoading}
                  onClick={() => {
                    if (modalMarket === value) return;
                    setSelectedSymbol(null);
                    onModalMarketChange(value);
                  }}
                >
                  {value === "domestic" ? "국내" : "해외"}
                </button>
              ))}
            </div>
            {modalDuration && onModalDurationChange && (
              <div className={stockImpactCardStyles.durationTabs}>
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      modalDuration === option.value
                        ? stockImpactCardStyles.activeDurationTab
                        : stockImpactCardStyles.durationTab
                    }
                    aria-pressed={modalDuration === option.value}
                    disabled={isModalLoading}
                    onClick={() => {
                      if (modalDuration === option.value) return;
                      setSelectedSymbol(null);
                      onModalDurationChange(option.value);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {selectedStock ? (
          <StockChart
            id={`stock-chart-${selectedStock.symbol}`}
            stock={selectedStock}
            rank={
              effectiveModalStocks.findIndex(
                ({ symbol }) => symbol === selectedStock.symbol,
              ) + 1
            }
            duration={modalDuration ?? duration ?? "1d"}
            onBack={() => setSelectedSymbol(null)}
          />
        ) : (isModalLoading ?? isLoading) ? (
          <StockRowsSkeleton count={8} isModal />
        ) : (isModalError ?? isError) ? (
          <div className={stockImpactCardStyles.modalError} role="alert">
            <Info size={18} />
            <span>주식 데이터를 불러오지 못했습니다.</span>
          </div>
        ) : effectiveModalStocks.length === 0 ? (
          <div className={stockImpactCardStyles.modalState}>
            선택한 조건에 표시할 주식 데이터가 없습니다.
          </div>
        ) : (
          <div className={stockImpactCardStyles.modalList}>
            {effectiveModalStocks.map((stock, index) => (
              <div key={stock.symbol}>
                <StockRow
                  stock={stock}
                  rank={index + 1}
                  onSelect={() => setSelectedSymbol(stock.symbol)}
                />
              </div>
            ))}
          </div>
        )}
        <p className={stockImpactCardStyles.disclaimer}>
          <Info size={13} /> 시세 정보이며 투자 권유가 아닙니다.
        </p>
      </DetailModal>
    </Card>
  );
}

function StockRowsSkeleton({
  count,
  isModal = false,
}: {
  count: number;
  isModal?: boolean;
}) {
  return (
    <div
      className={
        isModal
          ? stockImpactCardStyles.modalSkeletonList
          : stockImpactCardStyles.skeletonList
      }
      role="status"
      aria-label="주식 데이터 불러오는 중"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={stockImpactCardStyles.skeletonRow}>
          <Skeleton className={stockImpactCardStyles.rankSkeleton} />
          <div className={stockImpactCardStyles.identitySkeleton}>
            <Skeleton className={stockImpactCardStyles.nameSkeleton} />
            <Skeleton className={stockImpactCardStyles.symbolSkeleton} />
          </div>
          <Skeleton className={stockImpactCardStyles.chartSkeleton} />
          <div className={stockImpactCardStyles.priceSkeletonGroup}>
            <Skeleton className={stockImpactCardStyles.priceSkeleton} />
            <Skeleton className={stockImpactCardStyles.changeSkeleton} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StockRow({
  stock,
  rank,
  onSelect,
  showRank = true,
}: {
  stock: Briefing["stocks"][number];
  rank: number;
  onSelect: () => void;
  showRank?: boolean;
}) {
  return (
    <button
      type="button"
      className={
        showRank
          ? stockImpactCardStyles.item
          : stockImpactCardStyles.favoriteItem
      }
      aria-expanded="false"
      aria-controls={`stock-chart-${stock.symbol}`}
      onClick={onSelect}
    >
      {showRank && (
        <span className={stockImpactCardStyles.rank} aria-label={`${rank}위`}>
          {rank}
        </span>
      )}
      <div className={stockImpactCardStyles.stockSummary}>
        <div className={stockImpactCardStyles.identity}>
          <p className={stockImpactCardStyles.name}>{stock.name}</p>
          <span className={stockImpactCardStyles.symbol}>{stock.symbol}</span>
        </div>
        {stock.issue && (
          <p className={stockImpactCardStyles.issue}>
            {stock.issue}
            {stock.relatedIssues && stock.relatedIssues.length > 1
              ? ` 외 ${stock.relatedIssues.length - 1}건`
              : ""}
          </p>
        )}
      </div>
      <div className={stockImpactCardStyles.metrics}>
        {stock.priceHistory && stock.priceHistory.length > 1 && (
          <Sparkline
            values={stock.priceHistory}
            direction={stock.changeDirection}
          />
        )}
        <div className={stockImpactCardStyles.priceGroup}>
          <p className={stockImpactCardStyles.price}>{stock.price}</p>
          <p
            className={stockChangeVariants({
              direction:
                stock.change > 0 ? "up" : stock.change < 0 ? "down" : "flat",
            })}
          >
            {stock.change > 0 ? "+" : ""}
            {stock.change}%
            <span className={stockImpactCardStyles.directionLabel}>
              {getDirectionLabel(stock.changeDirection, stock.change)}
            </span>
          </p>
        </div>
      </div>
    </button>
  );
}

function StockChart({
  id,
  stock,
  rank,
  duration,
  onBack,
}: {
  id: string;
  stock: Briefing["stocks"][number];
  rank: number;
  duration: StockDuration;
  onBack: () => void;
}) {
  const chart = stock.priceChart ?? [];
  const closeValues = chart.map(({ close }) => close);
  const hasChart = chart.length > 1;

  const min = hasChart ? Math.min(...chart.map(({ low }) => low)) : 0;
  const max = hasChart ? Math.max(...chart.map(({ high }) => high)) : 0;
  const middle = (min + max) / 2;
  const maxVolume = hasChart
    ? Math.max(...chart.map(({ volume }) => volume), 1)
    : 1;
  const candleWidth = Math.max(1, Math.min(8, 220 / chart.length));
  const labelIndexes = hasChart ? getAxisLabelIndexes(chart.length) : [];
  const ma5 = calculateMovingAverage(closeValues, 5);
  const ma20 = calculateMovingAverage(closeValues, 20);

  return (
    <div id={id} className={stockImpactCardStyles.chartOverlay}>
      <div className={stockImpactCardStyles.chartHeader}>
        <div>
          <div className={stockImpactCardStyles.chartIdentity}>
            <span className={stockImpactCardStyles.chartRank}>{rank}</span>
            <p className={stockImpactCardStyles.chartTitle}>{stock.name}</p>
            <span className={stockImpactCardStyles.symbol}>{stock.symbol}</span>
          </div>
          <p className={stockImpactCardStyles.chartPeriod}>
            {getChartPeriodLabel(duration)} · 캔들/거래량
          </p>
        </div>
        <button
          type="button"
          className={stockImpactCardStyles.backButton}
          onClick={onBack}
        >
          <ArrowLeft size={15} />
          목록으로
        </button>
      </div>
      {hasChart ? (
        <svg
          viewBox="0 0 360 236"
          className={stockImpactCardStyles.chart}
          role="img"
          aria-label={`${stock.name} ${getChartPeriodLabel(duration)} 캔들 차트`}
        >
          <rect
            x="0"
            y="0"
            width="52"
            height="200"
            className={stockImpactCardStyles.chartAxisGutter}
          />
          <rect
            x="52"
            y="200"
            width="296"
            height="36"
            className={stockImpactCardStyles.chartAxisGutter}
          />
          <line
            x1="52"
            y1="0"
            x2="52"
            y2="200"
            className={stockImpactCardStyles.chartSectionDivider}
          />
          <line
            x1="52"
            y1="160"
            x2="348"
            y2="160"
            className={stockImpactCardStyles.chartSectionDivider}
          />
          <line
            x1="52"
            y1="200"
            x2="348"
            y2="200"
            className={stockImpactCardStyles.chartSectionDivider}
          />
          {[max, middle, min].map((price, index) => {
            const y = 20 + index * 65;
            return (
              <g key={`${price}-${index}`}>
                <line
                  x1="54"
                  y1={y}
                  x2="346"
                  y2={y}
                  className={stockImpactCardStyles.chartGuide}
                />
                <text
                  x="48"
                  y={y + 3}
                  textAnchor="end"
                  className={stockImpactCardStyles.chartAxisText}
                >
                  {formatAxisPrice(price)}
                </text>
              </g>
            );
          })}
          {labelIndexes.map((index) => {
            const timestamp = chart[index].timestamp;
            const x = 54 + (index / (chart.length - 1)) * 292;
            return (
              <text
                key={timestamp}
                x={x}
                y="214"
                textAnchor="middle"
                className={stockImpactCardStyles.chartAxisText}
              >
                {formatAxisTime(timestamp, duration)}
              </text>
            );
          })}
          <text x="12" y="13" className={stockImpactCardStyles.chartAxisTitle}>
            가격
          </text>
          <text
            x="200"
            y="232"
            textAnchor="middle"
            className={stockImpactCardStyles.chartTimeTitle}
          >
            시간
          </text>
          {chart.map((candle, index) => {
            const x = 54 + (index / (chart.length - 1)) * 292;
            const highY = getPriceY(candle.high, min, max);
            const lowY = getPriceY(candle.low, min, max);
            const openY = getPriceY(candle.open, min, max);
            const closeY = getPriceY(candle.close, min, max);
            const isUp = candle.close >= candle.open;
            const bodyY = Math.min(openY, closeY);
            const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));
            const volumeHeight = (candle.volume / maxVolume) * 32;

            return (
              <g key={candle.timestamp}>
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  className={
                    isUp
                      ? stockImpactCardStyles.candleUp
                      : stockImpactCardStyles.candleDown
                  }
                />
                <rect
                  x={x - candleWidth / 2}
                  y={bodyY}
                  width={candleWidth}
                  height={bodyHeight}
                  className={
                    isUp
                      ? stockImpactCardStyles.candleUp
                      : stockImpactCardStyles.candleDown
                  }
                />
                <rect
                  x={x - candleWidth / 2}
                  y={198 - volumeHeight}
                  width={candleWidth}
                  height={volumeHeight}
                  className={
                    isUp
                      ? stockImpactCardStyles.volumeUp
                      : stockImpactCardStyles.volumeDown
                  }
                />
              </g>
            );
          })}
          <polyline
            points={getMovingAveragePoints(ma5, min, max)}
            fill="none"
            className={stockImpactCardStyles.movingAverage5}
            strokeWidth="1.5"
          />
          <polyline
            points={getMovingAveragePoints(ma20, min, max)}
            fill="none"
            className={stockImpactCardStyles.movingAverage20}
            strokeWidth="1.5"
          />
          <text
            x="58"
            y="158"
            className={stockImpactCardStyles.movingAverage5Label}
          >
            MA5
          </text>
          <text
            x="86"
            y="158"
            className={stockImpactCardStyles.movingAverage20Label}
          >
            MA20
          </text>
          <text x="12" y="178" className={stockImpactCardStyles.chartAxisTitle}>
            거래량
          </text>
        </svg>
      ) : (
        <div className={stockImpactCardStyles.chartEmpty}>
          차트 데이터를 불러올 수 없습니다.
        </div>
      )}
    </div>
  );
}

function getDirectionLabel(
  direction: "UP" | "DOWN" | "FLAT" | undefined,
  change: number,
) {
  const resolvedDirection =
    direction ?? (change > 0 ? "UP" : change < 0 ? "DOWN" : "FLAT");
  if (resolvedDirection === "UP") return "상승";
  if (resolvedDirection === "DOWN") return "하락";
  return "보합";
}

function Sparkline({
  values,
  direction,
}: {
  values: number[];
  direction?: "UP" | "DOWN" | "FLAT";
}) {
  const points = getChartPoints(values, 106, 28, 3, 3, 3, 3);

  return (
    <svg
      viewBox="0 0 106 28"
      className={stockImpactCardStyles.sparkline}
      role="img"
      aria-label="최근 7일 종가 추이"
    >
      <polyline
        points={points}
        fill="none"
        className={getChartLineClass(direction)}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getChartPoints(
  values: number[],
  width: number,
  height: number,
  top: number,
  right: number,
  left: number,
  bottom: number,
) {
  return getChartCoordinates(values, width, height, top, right, left, bottom)
    .map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
}

function getChartCoordinates(
  values: number[],
  width: number,
  height: number,
  top: number,
  right: number,
  left: number,
  bottom: number,
) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values.map((value, index) => {
    const x = left + (index / (values.length - 1)) * (width - left - right);
    const y =
      height - bottom - ((value - min) / range) * (height - top - bottom);
    return { x, y };
  });
}

function getChartLineClass(direction?: "UP" | "DOWN" | "FLAT") {
  if (direction === "UP") return stockImpactCardStyles.sparklineUp;
  if (direction === "DOWN") return stockImpactCardStyles.sparklineDown;
  return stockImpactCardStyles.sparklineFlat;
}

function formatAxisPrice(price: number) {
  return new Intl.NumberFormat("ko-KR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(price);
}

function formatAxisTime(timestamp: string, duration: StockDuration) {
  const options: Intl.DateTimeFormatOptions =
    duration === "1d"
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : { month: "numeric", day: "numeric" };
  return new Intl.DateTimeFormat("ko-KR", options).format(new Date(timestamp));
}

function getChartPeriodLabel(duration: StockDuration) {
  if (duration === "1d") return "당일 1분봉";
  if (duration === "1w") return "최근 1주 일봉";
  if (duration === "1mo") return "최근 1개월 일봉";
  return "최근 1년 일봉";
}

function getAxisLabelIndexes(length: number) {
  return Array.from(new Set([0, Math.round((length - 1) / 2), length - 1]));
}

function getPriceY(price: number, min: number, max: number) {
  const range = max - min || 1;
  return 150 - ((price - min) / range) * 130;
}

function calculateMovingAverage(values: number[], period: number) {
  return values.map((_, index) => {
    if (index < period - 1) return null;
    const window = values.slice(index - period + 1, index + 1);
    return window.reduce((sum, value) => sum + value, 0) / period;
  });
}

function getMovingAveragePoints(
  values: Array<number | null>,
  min: number,
  max: number,
) {
  const available = values
    .map((value, index) => ({ value, index }))
    .filter(
      (point): point is { value: number; index: number } =>
        point.value !== null,
    );
  if (available.length < 2) return "";

  return available
    .map(({ value, index }) => {
      const x = 54 + (index / (values.length - 1)) * 292;
      return `${x.toFixed(1)},${getPriceY(value, min, max).toFixed(1)}`;
    })
    .join(" ");
}
