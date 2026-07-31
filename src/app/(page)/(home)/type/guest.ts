import { z } from "zod";

const numericValue = z.union([z.number(), z.string()]).transform(Number);
const stockChartPointSchema = z.object({
  timestamp: z.string(),
  open: numericValue,
  high: numericValue,
  low: numericValue,
  close: numericValue,
  volume: numericValue,
});

export const weatherSchema = z
  .object({
    temperature: numericValue.optional(),
    temp: numericValue.optional(),
    condition: z.string().optional(),
    weather: z
      .union([
        z.string(),
        z.object({
          temp_c: numericValue,
          condition: z.string(),
        }),
      ])
      .optional(),
    location: z
      .union([
        z.string(),
        z.object({
          label: z.string().nullable().optional(),
          lat: numericValue,
          lng: numericValue,
        }),
      ])
      .optional(),
    city: z.string().optional(),
    region: z.string().optional(),
    address: z.string().optional(),
    hourly: z
      .array(
        z.object({
          time: z.string(),
          temp_c: numericValue,
          condition: z.string(),
        }),
      )
      .default([]),
  })
  .transform((value) => {
    const weather =
      typeof value.weather === "object" ? value.weather : undefined;
    const location =
      typeof value.location === "object" ? value.location : undefined;
    const locationLabel =
      location?.label ??
      (location
        ? `위도 ${location.lat.toFixed(4)}, 경도 ${location.lng.toFixed(4)}`
        : undefined);

    return {
      temperature: value.temperature ?? value.temp ?? weather?.temp_c ?? 0,
      condition:
        value.condition ??
        (typeof value.weather === "string"
          ? value.weather
          : value.weather?.condition) ??
        "날씨 정보",
      location:
        (typeof value.location === "string" ? value.location : locationLabel) ??
        value.city ??
        value.region ??
        value.address ??
        "현재 위치",
      hourly: value.hourly.map((forecast) => ({
        time: forecast.time,
        temperature: forecast.temp_c,
        condition: forecast.condition,
      })),
    };
  });

export const stockSchema = z
  .object({
    symbol: z.string().optional(),
    code: z.string().optional(),
    name: z.string().optional(),
    stock_name: z.string().optional(),
    current_price: numericValue.optional(),
    price: numericValue.optional(),
    change_rate: numericValue.optional(),
    change_percent: numericValue.optional(),
    change_direction: z.enum(["UP", "DOWN", "FLAT"]).optional(),
    price_history_7d: z.array(numericValue).default([]),
    price_chart: z.array(stockChartPointSchema).default([]),
    related_issues: z
      .array(
        z.object({
          id: z.number(),
          title: z.string(),
        }),
      )
      .default([]),
  })
  .transform((value) => {
    const changeRate = value.change_rate ?? value.change_percent ?? 0;
    return {
      symbol: value.symbol ?? value.code ?? value.name ?? "stock",
      name: value.name ?? value.stock_name ?? value.symbol ?? "종목",
      price: value.current_price ?? value.price ?? 0,
      changeRate,
      changeDirection:
        value.change_direction ??
        (changeRate > 0 ? "UP" : changeRate < 0 ? "DOWN" : "FLAT"),
      priceHistory: value.price_history_7d,
      priceChart: value.price_chart,
      relatedIssues: value.related_issues,
    };
  });

export const stocksSchema = z.array(stockSchema);

export const commuteSchema = z
  .object({
    origin: z
      .object({
        label: z.string().nullable(),
        lat: numericValue,
        lng: numericValue,
      })
      .optional(),
    destination: z
      .object({
        label: z.string().nullable(),
        lat: numericValue,
        lng: numericValue,
      })
      .optional(),
    duration_minutes: numericValue.optional(),
    duration: numericValue.optional(),
    eta_minutes: numericValue.optional(),
    estimated_minutes: numericValue.optional(),
    delay_minutes: numericValue.optional(),
    delay: numericValue.optional(),
    delay_reason: z.string().nullable().optional(),
    recommended_departure_time: z.string().nullable().optional(),
    route_polyline: z
      .array(
        z.object({
          lat: numericValue,
          lng: numericValue,
        }),
      )
      .default([]),
    message: z.string().optional(),
  })
  .passthrough()
  .transform((value) => ({
    durationMinutes:
      value.duration_minutes ??
      value.estimated_minutes ??
      value.eta_minutes ??
      value.duration ??
      null,
    delayMinutes: value.delay_minutes ?? value.delay ?? null,
    delayReason: value.delay_reason ?? null,
    recommendedDepartureTime: value.recommended_departure_time ?? null,
    message: value.message ?? null,
    origin: value.origin,
    destination: value.destination,
    routePolyline: value.route_polyline,
  }));

export type Weather = z.infer<typeof weatherSchema>;
export type Stock = z.infer<typeof stockSchema>;
export type Commute = z.infer<typeof commuteSchema>;
export type StockMarket = "domestic" | "overseas";
export type StockDuration = "1d" | "1w" | "1mo" | "1y";
