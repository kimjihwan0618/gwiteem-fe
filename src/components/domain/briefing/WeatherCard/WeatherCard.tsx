import {
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSun,
  MapPin,
  Plus,
  Snowflake,
  Sun,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Weather } from "@/app/(page)/(home)/type";
import type { Briefing } from "@/app/(page)/(home)/type/briefing";
import { weatherCardStyles } from "./styles";

interface WeatherCardProps {
  weather: Briefing["weather"];
  guestWeather?: Weather;
  isLoading?: boolean;
  hasFavorites?: boolean;
  favoriteLabels?: string[];
  onAddFavorite?: () => void;
}

export function WeatherCard({
  weather,
  guestWeather,
  isLoading,
  hasFavorites,
  favoriteLabels,
  onAddFavorite,
}: WeatherCardProps) {
  return (
    <Card
      id="weather"
      className={weatherCardStyles.root}
      aria-labelledby="weather-title"
    >
      <CardHeader>
        <CardTitle id="weather-title">오늘의 날씨</CardTitle>
      </CardHeader>
      <div className={weatherCardStyles.weatherBody}>
        <div className={weatherCardStyles.icon}>
          <WeatherIcon
            condition={guestWeather?.condition ?? weather.condition}
            size={24}
          />
        </div>
        <div className={weatherCardStyles.content}>
          {isLoading ? (
            <p className={weatherCardStyles.loading}>현재 위치 날씨 확인 중</p>
          ) : (
            <p className={weatherCardStyles.summary}>
              {guestWeather?.temperature ?? weather.temperature}°C
              <span>{guestWeather?.condition ?? weather.condition}</span>
            </p>
          )}
          <p className={weatherCardStyles.location}>
            <MapPin size={13} />
            {isLoading
              ? "위치 확인 중"
              : guestWeather
                ? guestWeather.location
                : "브리핑 설정 지역"}
          </p>
        </div>
      </div>
      {guestWeather && guestWeather.hourly.length > 0 && (
        <div className={weatherCardStyles.hourly} aria-label="시간대별 날씨">
          {guestWeather.hourly.slice(0, 8).map((forecast) => (
            <div key={forecast.time} className={weatherCardStyles.hourlyItem}>
              <time
                className={weatherCardStyles.hourlyTime}
                dateTime={forecast.time}
              >
                {formatForecastTime(forecast.time)}
              </time>
              <WeatherIcon condition={forecast.condition} size={19} />
              <strong className={weatherCardStyles.hourlyTemperature}>
                {Math.round(forecast.temperature)}°
              </strong>
              <span className={weatherCardStyles.hourlyCondition}>
                {forecast.condition}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className={weatherCardStyles.favorites}>
        {hasFavorites === false && onAddFavorite && (
          <button
            type="button"
            className={weatherCardStyles.favoritePrompt}
            onClick={onAddFavorite}
          >
            <Plus size={15} /> 즐겨찾기 날씨 지역을 등록하세요
          </button>
        )}
        {favoriteLabels && favoriteLabels.length > 0 && (
          <div className={weatherCardStyles.favoriteList}>
            {favoriteLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function formatForecastTime(value: string) {
  const forecastDate = new Date(value);
  const isNextDay = forecastDate.toDateString() !== new Date().toDateString();
  const time = new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    hour12: true,
  }).format(forecastDate);
  return isNextDay ? `내일 ${time}` : time;
}

function WeatherIcon({ condition, size }: { condition: string; size: number }) {
  if (condition.includes("눈")) return <Snowflake size={size} />;
  if (condition.includes("소나기") || condition === "비")
    return <CloudRain size={size} />;
  if (condition.includes("빗방울") || condition.includes("강수"))
    return <CloudDrizzle size={size} />;
  if (condition.includes("흐림")) return <Cloud size={size} />;
  if (condition.includes("구름")) return <CloudSun size={size} />;
  return <Sun size={size} />;
}
