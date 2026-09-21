import { z } from "zod";

export const stockCardItemSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  price: z.string(),
  change: z.number(),
  changeDirection: z.enum(["UP", "DOWN", "FLAT"]).optional(),
  priceHistory: z.array(z.number()).optional(),
  priceChart: z
    .array(
      z.object({
        timestamp: z.string(),
        open: z.number(),
        high: z.number(),
        low: z.number(),
        close: z.number(),
        volume: z.number(),
      }),
    )
    .optional(),
});

export type StockCardItem = z.infer<typeof stockCardItemSchema>;
