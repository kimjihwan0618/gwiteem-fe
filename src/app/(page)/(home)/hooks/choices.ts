"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import {
  choiceMigrationSchema,
  choiceQuestionDetailSchema,
  choiceQuestionsResponseSchema,
  choiceVoteResponseSchema,
  myChoicesSchema,
  type ChoiceCategory,
  type ChoiceOption,
} from "../type";

export function useChoiceQuestions(
  category: ChoiceCategory | "all",
  sort: "popular" | "latest",
) {
  const query = new URLSearchParams({ sort });
  if (category !== "all") query.set("category", category);
  return useQuery({
    queryKey: queryKeys.choices.list(category, sort),
    queryFn: () =>
      apiClient(
        `/api/choices/questions?${query}`,
        choiceQuestionsResponseSchema,
      ),
    select: (response) => response.data.items,
  });
}

export function useChoiceQuestion(questionId: number | null) {
  return useQuery({
    queryKey: queryKeys.choices.detail(questionId),
    queryFn: () =>
      apiClient(
        `/api/choices/questions/${questionId}`,
        choiceQuestionDetailSchema,
      ),
    select: (response) => response.data,
    enabled: questionId !== null,
  });
}

export function useVoteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      selectedOption,
      reasonId,
    }: {
      questionId: number;
      selectedOption: ChoiceOption;
      reasonId: number | null;
    }) =>
      apiClient(
        `/api/choices/questions/${questionId}/votes`,
        choiceVoteResponseSchema,
        {
          method: "POST",
          body: {
            selected_option: selectedOption,
            reason_id: reasonId,
          },
        },
      ),
    onSuccess: async (response, variables) => {
      queryClient.setQueryData(queryKeys.choices.detail(variables.questionId), {
        ...response,
        data: response.data.question,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.choices.all });
    },
  });
}

export function useMyChoices(isEnabled: boolean) {
  return useQuery({
    queryKey: queryKeys.choices.mine(),
    queryFn: () => apiClient("/api/choices/me", myChoicesSchema),
    select: (response) => response.data,
    enabled: isEnabled,
  });
}

export function useMigrateGuestVotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient("/api/choices/votes/migrate", choiceMigrationSchema, {
        method: "POST",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.choices.all });
    },
  });
}
