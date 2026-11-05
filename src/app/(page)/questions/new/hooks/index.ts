"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import { choiceQuestionDetailSchema } from "@/app/(page)/(home)/type";
import type { CreateQuestionRequest } from "../type";

export function useCreateQuestion() {
  const cache = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateQuestionRequest) =>
      apiClient("/api/choices/questions", choiceQuestionDetailSchema, {
        method: "POST",
        body,
      }),
    onSuccess: (response) => {
      cache.setQueryData(queryKeys.choices.detail(response.data.id), response);
      void cache.invalidateQueries({
        queryKey: [...queryKeys.choices.all, "list"],
      });
    },
  });
}
