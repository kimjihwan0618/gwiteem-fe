"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import {
  choiceLikeResponseSchema,
  choiceMigrationSchema,
  choiceQuestionDetailSchema,
  choiceQuestionsResponseSchema,
  choiceVoteResponseSchema,
  myChoicesSchema,
  myLikedQuestionsSchema,
  type ChoiceCategory,
  type ChoiceOption,
  type ChoiceSort,
} from "../type";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function updateQuestionLike(
  value: unknown,
  questionId: number,
  isLiked: boolean,
  likeCount?: number,
): unknown {
  if (!isRecord(value) || value.id !== questionId) return value;
  const currentCount =
    typeof value.like_count === "number" ? value.like_count : 0;
  return {
    ...value,
    is_liked: isLiked,
    like_count: likeCount ?? Math.max(0, currentCount + (isLiked ? 1 : -1)),
  };
}

function updateLikeInCache(
  cached: unknown,
  questionId: number,
  isLiked: boolean,
  likeCount?: number,
): unknown {
  if (!isRecord(cached) || !("data" in cached)) return cached;
  const payload = cached.data;

  if (Array.isArray(payload)) {
    return {
      ...cached,
      data: payload.map((item) =>
        isRecord(item) && "question" in item
          ? {
              ...item,
              question: updateQuestionLike(
                item.question,
                questionId,
                isLiked,
                likeCount,
              ),
            }
          : updateQuestionLike(item, questionId, isLiked, likeCount),
      ),
    };
  }

  if (isRecord(payload) && Array.isArray(payload.items)) {
    return {
      ...cached,
      data: {
        ...payload,
        items: payload.items.map((item) =>
          updateQuestionLike(item, questionId, isLiked, likeCount),
        ),
      },
    };
  }

  return {
    ...cached,
    data: updateQuestionLike(payload, questionId, isLiked, likeCount),
  };
}

export function useChoiceQuestions(
  category: ChoiceCategory | "all",
  sort: ChoiceSort,
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
      reasonId: number;
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

export function useToggleQuestionLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questionId,
      isLiked,
    }: {
      questionId: number;
      isLiked: boolean;
    }) =>
      apiClient(
        `/api/choices/questions/${questionId}/like`,
        choiceLikeResponseSchema,
        { method: isLiked ? "PUT" : "DELETE" },
      ),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.choices.all });
      const previous = queryClient.getQueriesData({
        queryKey: queryKeys.choices.all,
      });
      queryClient.setQueriesData(
        { queryKey: queryKeys.choices.all },
        (cached) =>
          updateLikeInCache(cached, variables.questionId, variables.isLiked),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, cached]) => {
        queryClient.setQueryData(queryKey, cached);
      });
    },
    onSuccess: (response, variables) => {
      queryClient.setQueriesData(
        { queryKey: queryKeys.choices.all },
        (cached) =>
          updateLikeInCache(
            cached,
            variables.questionId,
            response.data.is_liked,
            response.data.like_count,
          ),
      );
    },
    onSettled: async () => {
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

export function useMyLikedQuestions(isEnabled: boolean) {
  return useQuery({
    queryKey: queryKeys.choices.liked(),
    queryFn: () => apiClient("/api/choices/me/likes", myLikedQuestionsSchema),
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
