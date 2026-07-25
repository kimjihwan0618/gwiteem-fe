import { ChevronRight, Info, LoaderCircle, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Briefing } from "@/app/(page)/(home)/type/briefing";
import type { StockDuration, StockMarket } from "@/app/(page)/(home)/type";
import {
  stockChangeVariants,
  stockDurationIndicatorVariants,
  stockImpactCardStyles,
  stockTabIndicatorVariants,
} from "./styles";

const durationOptions = [
  { value: "realtime", label: "실시간" },
  { value: "1d", label: "일별" },
  { value: "1w", label: "주별" },
  { value: "1mo", label: "월별" },
] as const;

export function StockImpactCard({
  stocks,
  market,
  duration,
  onMarketChange,
  onDurationChange,
  isLoading,
  hasFavorites,
  onAddFavorite,
}: {
  stocks: Briefing["stocks"];
  market?: StockMarket;
  duration?: StockDuration;
  onMarketChange?: (market: StockMarket) => void;
  onDurationChange?: (duration: StockDuration) => void;
  isLoading?: boolean;
  hasFavorites?: boolean;
  onAddFavorite?: () => void;
}) {
  const durationLabel =
    durationOptions.find(({ value }) => value === duration)?.label ?? "실시간";

  return (
    <Card id="stocks" className={stockImpactCardStyles.root}>
      <CardHeader className={stockImpactCardStyles.header}>
        <CardTitle>
          {market ? `${durationLabel} 인기 종목 Top 5` : "관심 종목 영향"}
        </CardTitle>
        {market && onMarketChange ? (
          <div className={stockImpactCardStyles.controls}>
            <div className={stockImpactCardStyles.tabs}>
              <span
                aria-hidden="true"
                className={stockTabIndicatorVariants({ market })}
              />
              {(["domestic", "overseas"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={
                    market === value
                      ? stockImpactCardStyles.activeTab
                      : stockImpactCardStyles.tab
                  }
                  onClick={() => onMarketChange(value)}
                >
                  {value === "domestic" ? "국내" : "해외"}
                </button>
              ))}
            </div>
            {duration && onDurationChange && (
              <div className={stockImpactCardStyles.durationTabs}>
                <span
                  aria-hidden="true"
                  className={stockDurationIndicatorVariants({ duration })}
                />
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={
                      duration === option.value
                        ? stockImpactCardStyles.activeDurationTab
                        : stockImpactCardStyles.durationTab
                    }
                    onClick={() => onDurationChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <button
            aria-label="관심 종목 전체 보기"
            className={stockImpactCardStyles.moreButton}
          >
            <ChevronRight size={19} />
          </button>
        )}
      </CardHeader>
      <div
        key={`${market ?? "watchlist"}-${duration ?? "default"}`}
        className={stockImpactCardStyles.list}
      >
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
          <div className={stockImpactCardStyles.loading}>
            <LoaderCircle size={18} className={stockImpactCardStyles.loader} />
            실시간 시세를 불러오는 중입니다.
          </div>
        ) : (
          stocks.map((stock) => (
            <div key={stock.symbol} className={stockImpactCardStyles.item}>
              <div>
                <div className={stockImpactCardStyles.identity}>
                  <p className={stockImpactCardStyles.name}>{stock.name}</p>
                  <span className={stockImpactCardStyles.symbol}>
                    {stock.symbol}
                  </span>
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
                        stock.change > 0
                          ? "up"
                          : stock.change < 0
                            ? "down"
                            : "flat",
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
            </div>
          ))
        )}
      </div>
      <p className={stockImpactCardStyles.disclaimer}>
        <Info size={13} /> 시세 정보이며 투자 권유가 아닙니다.
      </p>
    </Card>
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
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = 3 + (index / (values.length - 1)) * 100;
      const y = 25 - ((value - min) / range) * 22;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

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
        className={
          direction === "UP"
            ? stockImpactCardStyles.sparklineUp
            : direction === "DOWN"
              ? stockImpactCardStyles.sparklineDown
              : stockImpactCardStyles.sparklineFlat
        }
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
