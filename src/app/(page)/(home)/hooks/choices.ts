"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { questionQueries, updateQuestionInCache } from "./question-cache";
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

export function useChoiceQuestions(
  categories: ChoiceCategory[],
  sort: ChoiceSort,
  search: string,
  userId: string | number | null,
  isEnabled: boolean,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.choices.list(
      [...categories].sort().join(","),
      sort,
      search,
      userId,
    ),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      apiClient(
        `/api/choices/questions?${questionParams(categories, sort, search, pageParam)}`,
        choiceQuestionsResponseSchema,
        { signal },
      ),
    getNextPageParam: (last) => last.data.next_cursor ?? undefined,
    select: (response) =>
      Array.from(
        new Map(
          response.pages
            .flatMap((page) => page.data.items)
            .map((item) => [item.id, item]),
        ).values(),
      ),
    enabled: isEnabled,
  });
}

function questionParams(
  categories: ChoiceCategory[],
  sort: ChoiceSort,
  search: string,
  cursor: string | null,
) {
  const query = new URLSearchParams({ sort, q: search, limit: "15" });
  [...categories]
    .sort()
    .forEach((category) => query.append("category", category));
  if (cursor) query.set("cursor", cursor);
  return query;
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
      queryClient.setQueriesData(questionQueries, (cached) =>
        updateQuestionInCache(cached, variables.questionId, (question) => ({
          ...question,
          ...response.data.question,
        })),
      );
      await queryClient.invalidateQueries({
        queryKey: queryKeys.choices.mineAll,
      });
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
      await queryClient.cancelQueries(questionQueries);
      const previous = queryClient.getQueriesData(questionQueries);
      queryClient.setQueriesData(questionQueries, (cached) =>
        updateQuestionInCache(cached, variables.questionId, (question) => ({
          ...question,
          is_liked: variables.isLiked,
          like_count: Math.max(
            0,
            Number(question.like_count) +
              (question.is_liked === variables.isLiked
                ? 0
                : variables.isLiked
                  ? 1
                  : -1),
          ),
        })),
      );
      return { previous };
    },
    onError: (_error, variables, context) => {
      context?.previous.forEach(([queryKey, cached]) => {
        updateQuestionInCache(cached, variables.questionId, (previous) => {
          queryClient.setQueryData(queryKey, (current: unknown) =>
            updateQuestionInCache(
              current,
              variables.questionId,
              (question) => ({
                ...question,
                is_liked: previous.is_liked,
                like_count: previous.like_count,
              }),
            ),
          );
          return previous;
        });
      });
    },
    onSuccess: (response, variables) => {
      queryClient.setQueriesData(questionQueries, (cached) =>
        updateQuestionInCache(cached, variables.questionId, (question) => ({
          ...question,
          is_liked: response.data.is_liked,
          like_count: response.data.like_count,
        })),
      );
    },
    onSettled: async () => {
      // Only collection membership and liked_at need to be fetched again.
      await queryClient.invalidateQueries({
        queryKey: queryKeys.choices.likedAll,
      });
    },
  });
}

export function useMyChoices(
  isEnabled: boolean,
  categories: ChoiceCategory[],
  sort: ChoiceSort,
  search: string,
  userId: string | number | null,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.choices.mine(
      [...categories].sort().join(","),
      sort,
      search,
      userId,
    ),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      apiClient(
        `/api/choices/me?${questionParams(categories, sort, search, pageParam)}`,
        myChoicesSchema,
        { signal },
      ),
    getNextPageParam: (last) => last.data.next_cursor ?? undefined,
    select: (response) =>
      Array.from(
        new Map(
          response.pages
            .flatMap((page) => page.data.items)
            .map((item) => [item.question.id, item]),
        ).values(),
      ),
    enabled: isEnabled,
  });
}

export function useMyLikedQuestions(
  isEnabled: boolean,
  categories: ChoiceCategory[],
  sort: ChoiceSort,
  search: string,
  userId: string | number | null,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.choices.liked(
      [...categories].sort().join(","),
      sort,
      search,
      userId,
    ),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      apiClient(
        `/api/choices/me/likes?${questionParams(categories, sort, search, pageParam)}`,
        myLikedQuestionsSchema,
        { signal },
      ),
    getNextPageParam: (last) => last.data.next_cursor ?? undefined,
    select: (response) =>
      Array.from(
        new Map(
          response.pages
            .flatMap((page) => page.data.items)
            .map((item) => [item.question.id, item]),
        ).values(),
      ),
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

export function useMyCreatedQuestions(
  categories: ChoiceCategory[],
  sort: ChoiceSort,
  search: string,
  userId: string | number | null,
  isEnabled: boolean,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.choices.created(
      [...categories].sort().join(","),
      sort,
      search,
      userId,
    ),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      apiClient(
        `/api/choices/me/questions?${questionParams(categories, sort, search, pageParam)}`,
        choiceQuestionsResponseSchema,
        { signal },
      ),
    getNextPageParam: (last) => last.data.next_cursor ?? undefined,
    select: (response) =>
      Array.from(
        new Map(
          response.pages
            .flatMap((page) => page.data.items)
            .map((item) => [item.id, item]),
        ).values(),
      ),
    enabled: isEnabled,
  });
}
