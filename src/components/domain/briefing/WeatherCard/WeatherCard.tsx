import {
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSun,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Snowflake,
  Sun,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Weather } from "@/app/(page)/(home)/type";
import type { Briefing } from "@/app/(page)/(home)/type/briefing";
import { weatherCardStyles } from "./styles";

interface WeatherCardProps {
  weather: Briefing["weather"];
  guestWeather?: Weather;
  isLoading?: boolean;
}

export function WeatherCard({
  weather,
  guestWeather,
  isLoading,
}: WeatherCardProps) {
  const hourlyRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const hasWeatherData = Boolean(guestWeather) || Boolean(weather);

  const updateScrollState = useCallback(() => {
    const container = hourlyRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 1);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    const container = hourlyRef.current;
    if (!container) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(container);
    return () => observer.disconnect();
  }, [guestWeather?.hourly.length, updateScrollState]);

  function scrollHourly(direction: -1 | 1) {
    hourlyRef.current?.scrollBy({
      left: direction * Math.max(hourlyRef.current.clientWidth - 56, 240),
      behavior: "smooth",
    });
  }

  return (
    <Card
      id="weather"
      className={weatherCardStyles.root}
      aria-labelledby="weather-title"
    >
      <CardHeader className={weatherCardStyles.header}>
        <div className={weatherCardStyles.titleGroup}>
          <span className={weatherCardStyles.titleIcon} aria-hidden="true">
            <WeatherIcon
              condition={guestWeather?.condition ?? weather.condition}
              size={19}
            />
          </span>
          <CardTitle id="weather-title" className={weatherCardStyles.title}>
            오늘의 날씨
          </CardTitle>
        </div>
        {isLoading ? (
          <Skeleton className={weatherCardStyles.locationSkeleton} />
        ) : (
          <p className={weatherCardStyles.location}>
            <MapPin size={13} />
            {guestWeather ? guestWeather.location : "브리핑 설정 지역"}
          </p>
        )}
      </CardHeader>
      {isLoading ? (
        <WeatherCardSkeleton />
      ) : hasWeatherData ? (
        <div className={weatherCardStyles.content}>
          <div className={weatherCardStyles.weatherBody}>
            <p className={weatherCardStyles.summary}>
              {guestWeather?.temperature ?? weather.temperature}°C
              <span>{guestWeather?.condition ?? weather.condition}</span>
            </p>
          </div>
          {guestWeather && guestWeather.hourly.length > 0 && (
            <div className={weatherCardStyles.hourlyFrame}>
              <button
                type="button"
                className={weatherCardStyles.hourlyPrevious}
                aria-label="이전 시간대 날씨 보기"
                disabled={!canScrollLeft}
                onClick={() => scrollHourly(-1)}
              >
                <ChevronLeft size={18} />
              </button>
              <div
                ref={hourlyRef}
                className={weatherCardStyles.hourly}
                aria-label="24시간 날씨"
                onScroll={updateScrollState}
              >
                {guestWeather.hourly.slice(0, 24).map((forecast) => (
                  <ForecastItem key={forecast.time} forecast={forecast} />
                ))}
              </div>
              <button
                type="button"
                className={weatherCardStyles.hourlyNext}
                aria-label="다음 시간대 날씨 보기"
                disabled={!canScrollRight}
                onClick={() => scrollHourly(1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );
}

function WeatherCardSkeleton() {
  return (
    <div
      className={weatherCardStyles.skeleton}
      role="status"
      aria-label="날씨 정보 불러오는 중"
    >
      <div className={weatherCardStyles.skeletonSummary}>
        <Skeleton className={weatherCardStyles.temperatureSkeleton} />
        <Skeleton className={weatherCardStyles.conditionSkeleton} />
      </div>
      <div className={weatherCardStyles.hourlySkeleton}>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={weatherCardStyles.hourlySkeletonItem}>
            <Skeleton className={weatherCardStyles.hourSkeletonTime} />
            <Skeleton className={weatherCardStyles.hourSkeletonIcon} />
            <Skeleton className={weatherCardStyles.hourSkeletonTemperature} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ForecastItem({ forecast }: { forecast: Weather["hourly"][number] }) {
  return (
    <div className={weatherCardStyles.hourlyItem}>
      <time className={weatherCardStyles.hourlyTime} dateTime={forecast.time}>
        {formatForecastTime(forecast.time)}
      </time>
      <WeatherIcon condition={forecast.condition} size={21} />
      <strong className={weatherCardStyles.hourlyTemperature}>
        {Math.round(forecast.temperature)}°
      </strong>
      <span className={weatherCardStyles.hourlyCondition}>
        {forecast.condition}
      </span>
    </div>
  );
}

function formatForecastTime(value: string) {
  const forecastDate = new Date(value);
  const isNextDay = forecastDate.toDateString() !== new Date().toDateString();
  const time = `${forecastDate.getHours()}시`;
  return isNextDay ? `내일 ${time}` : time;
}

function WeatherIcon({ condition, size }: { condition: string; size: number }) {
  if (condition.includes("눈"))
    return <Snowflake size={size} className={weatherCardStyles.iconSnow} />;
  if (condition.includes("소나기") || condition === "비")
    return <CloudRain size={size} className={weatherCardStyles.iconRain} />;
  if (condition.includes("빗방울") || condition.includes("강수"))
    return <CloudDrizzle size={size} className={weatherCardStyles.iconRain} />;
  if (condition.includes("흐림"))
    return <Cloud size={size} className={weatherCardStyles.iconCloud} />;
  if (condition.includes("구름"))
    return <CloudSun size={size} className={weatherCardStyles.iconCloud} />;
  if (condition.includes("맑음"))
    return <Sun size={size} className={weatherCardStyles.iconSun} />;
  return <Cloud size={size} className={weatherCardStyles.iconCloud} />;
}
