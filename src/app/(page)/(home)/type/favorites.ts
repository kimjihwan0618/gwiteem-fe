import { z } from "zod";

const weatherFavoriteSchema = z.object({
  favorite: z.object({
    id: z.number(),
    label: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  weather: z.object({
    temp_c: z.number(),
    condition: z.string(),
  }),
});

const stockFavoriteSchema = z.object({
  stock: z.object({
    code: z.string(),
    name: z.string(),
    market: z.string(),
  }),
  related_issue_summary: z.string().nullable(),
  current_price: z.number(),
  change_rate: z.number(),
  change_direction: z.enum(["UP", "DOWN", "FLAT"]),
  sparkline_7d: z.array(z.number()),
});

const commuteFavoriteSchema = z.object({
  favorite: z.object({
    id: z.number(),
    label: z.string(),
    origin_address: z.string(),
    origin_lat: z.number(),
    origin_lng: z.number(),
    destination_address: z.string(),
    destination_lat: z.number(),
    destination_lng: z.number(),
  }),
  commute: z.object({
    estimated_minutes: z.number(),
    delay_minutes: z.number(),
    delay_reason: z.string().nullable(),
  }),
});

export const favoritesSchema = z.object({
  weather: z.array(weatherFavoriteSchema),
  stocks: z.array(stockFavoriteSchema),
  commutes: z.array(commuteFavoriteSchema),
});

export const stockSearchResultsSchema = z.array(
  z.object({
    code: z.string(),
    name: z.string(),
    market: z.string(),
  }),
);

export type Favorites = z.infer<typeof favoritesSchema>;
export type StockSearchResult = z.infer<
  typeof stockSearchResultsSchema
>[number];
export type FavoriteCreatePayload =
  | { kind: "stock"; code: string }
  | {
      kind: "weather";
      label: string;
      latitude: number;
      longitude: number;
    }
  | {
      kind: "commute";
      label: string;
      originAddress: string;
      destinationAddress: string;
    };
