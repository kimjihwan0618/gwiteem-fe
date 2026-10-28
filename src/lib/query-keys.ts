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
    comments: (questionId: number | null, userId: string | number | null) =>
      [...queryKeys.choices.all, "comments", questionId, userId] as const,
    list: (
      category: string,
      sort: string,
      search: string,
      userId: string | number | null,
    ) =>
      [
        ...queryKeys.choices.all,
        "list",
        category,
        sort,
        search,
        userId,
      ] as const,
    detail: (questionId: number | null) =>
      [...queryKeys.choices.all, "detail", questionId] as const,
    mine: (
      category: string,
      sort: string,
      search: string,
      userId: string | number | null,
    ) =>
      [
        ...queryKeys.choices.all,
        "mine",
        category,
        sort,
        search,
        userId,
      ] as const,
    liked: (
      category: string,
      sort: string,
      search: string,
      userId: string | number | null,
    ) =>
      [
        ...queryKeys.choices.all,
        "liked",
        category,
        sort,
        search,
        userId,
      ] as const,
  },
};
