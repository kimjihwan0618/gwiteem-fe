export const queryKeys = {
  briefing: {
    all: ["briefing"] as const,
    daily: (date: string) =>
      [...queryKeys.briefing.all, "daily", date] as const,
  },
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  guest: {
    weather: (latitude?: number, longitude?: number) =>
      ["guest", "weather", latitude, longitude] as const,
    stocks: (
      market: "domestic" | "overseas",
      duration: "realtime" | "1d" | "1w" | "1mo",
    ) => ["guest", "stocks", market, duration] as const,
  },
  favorites: {
    all: ["favorites"] as const,
    lists: () => [...queryKeys.favorites.all, "lists"] as const,
  },
};
