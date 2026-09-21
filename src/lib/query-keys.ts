export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },
  guest: {
    weather: (latitude?: number, longitude?: number) =>
      ["guest", "weather", latitude, longitude] as const,
    stocks: (
      market: "domestic" | "overseas",
      duration: "1d" | "1w" | "1mo" | "1y",
    ) => ["guest", "stocks", market, duration] as const,
  },
  favorites: {
    all: ["favorites"] as const,
    lists: () => [...queryKeys.favorites.all, "lists"] as const,
  },
  choices: {
    all: ["choices"] as const,
    list: (category: string, sort: string) =>
      [...queryKeys.choices.all, "list", category, sort] as const,
    detail: (questionId: number | null) =>
      [...queryKeys.choices.all, "detail", questionId] as const,
    mine: () => [...queryKeys.choices.all, "mine"] as const,
  },
};
