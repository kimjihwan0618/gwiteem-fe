"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
  if (isRecord(cached) && Array.isArray(cached.pages)) {
    return {
      ...cached,
      pages: cached.pages.map((page) =>
        updateLikeInCache(page, questionId, isLiked, likeCount),
      ),
    };
  }
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
      },
    };
  }

  return {
    ...cached,
    data: updateQuestionLike(payload, questionId, isLiked, likeCount),
  };
}

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
