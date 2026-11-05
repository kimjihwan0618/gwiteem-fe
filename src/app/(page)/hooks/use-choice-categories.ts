"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import { choiceCategoriesSchema } from "../type/choice-categories";

export function useChoiceCategories() {
  return useQuery({
    queryKey: queryKeys.choices.categories,
    queryFn: ({ signal }) =>
      apiClient("/api/choices/categories", choiceCategoriesSchema, { signal }),
    select: (response) => response.data,
    staleTime: 60_000,
  });
}
