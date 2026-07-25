import { MapPin, Plus, Sun } from "lucide-react";
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
          <Sun size={24} />
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
                ? `${guestWeather.location} 기준`
                : "브리핑 설정 지역 기준"}
          </p>
        </div>
      </div>
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
