"use client";
import { useRef, useState } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query-keys";
import { useToast } from "@/components/ui/ToastProvider";
import {
  commentPageSchema,
  commentMutationSchema,
  type CommentAction,
  type CommentsState,
} from "../type/comments";

export function useQuestionComments(
  questionId: number | null,
  userId: string | number | null,
): CommentsState {
  const pending = useRef(new Set<string>());
  const [pendingActions, setPendingActions] = useState<CommentAction[]>([]);
  const [optimisticLikes, setOptimisticLikes] = useState<
    Record<number, { is_liked: boolean; like_count: number }>
  >({});
  const client = useQueryClient();
  const toast = useToast();
  const query = useInfiniteQuery({
    queryKey: queryKeys.choices.comments(questionId, userId),
    initialPageParam: null as number | null,
    queryFn: ({ pageParam }) =>
      apiClient(
        `/api/choices/questions/${questionId}/comments${pageParam ? `?cursor=${pageParam}` : ""}`,
        commentPageSchema,
      ),
    getNextPageParam: (last) => last.data.next_cursor ?? undefined,
    enabled: questionId !== null,
  });
  const mutation = useMutation({
    mutationFn: (input: CommentAction) => {
      const isLike = input.action === "like" || input.action === "unlike";
      const suffix =
        input.action === "reply"
          ? `/${input.id}/replies`
          : input.parentId !== undefined
            ? `/${input.parentId}/replies/${input.id}`
            : input.action === "create"
              ? ""
              : `/${input.id}${isLike ? "/like" : ""}`;
      const path = `/api/choices/questions/${questionId}/comments${suffix}`;
      const method =
        input.action === "create" || input.action === "reply"
          ? "POST"
          : input.action === "edit"
            ? "PATCH"
            : input.action === "like"
              ? "PUT"
              : "DELETE";
      return apiClient(path, commentMutationSchema, {
        method,
        ...(input.content !== undefined
          ? { body: { content: input.content } }
          : {}),
      });
    },
    onSuccess: async (response, input) => {
      if (input.action !== "like" && input.action !== "unlike")
        toast.success(response.message);
      await client.invalidateQueries({ queryKey: queryKeys.choices.all });
    },
    onError: (error) => toast.error(error.message),
  });
  return {
    items:
      query.data?.pages
        .flatMap((page) => page.data.items)
        .map((item) => ({
          ...item,
          ...optimisticLikes[item.id],
        })) ?? [],
    totalCount: query.data?.pages[0]?.data.total_count,
    isLoading: query.isPending,
    isError: query.isError && !query.data,
    pendingActions,
    hasMore: query.hasNextPage,
    isLoadingMore: query.isFetchingNextPage,
    isLoadMoreError: query.isFetchNextPageError,
    isLoggedIn: userId !== null,
    onRetry: () => {
      void query.refetch();
    },
    onLoadMore: () => {
      void query.fetchNextPage();
    },
    onAction: async (action) => {
      const key =
        action.action === "create"
          ? "create"
          : action.parentId !== undefined
            ? `reply-${action.id}`
            : `comment-${action.id}`;
      if (pending.current.has(key)) return false;
      if (userId === null) {
        toast.info("로그인하면 댓글을 작성하고 좋아요를 남길 수 있어요.");
        return false;
      }
      pending.current.add(key);
      setPendingActions((current) => [...current, action]);
      if (action.action === "like" || action.action === "unlike") {
        const comment = query.data?.pages
          .flatMap((page) => page.data.items)
          .find((item) => item.id === action.id);
        if (comment) {
          const isLiked = action.action === "like";
          setOptimisticLikes((current) => ({
            ...current,
            [comment.id]: {
              is_liked: isLiked,
              like_count: Math.max(
                0,
                comment.like_count +
                  (isLiked === comment.is_liked ? 0 : isLiked ? 1 : -1),
              ),
            },
          }));
        }
      }
      try {
        await mutation.mutateAsync(action);
        return true;
      } catch {
        return false;
      } finally {
        if (
          action.id !== undefined &&
          (action.action === "like" || action.action === "unlike")
        ) {
          setOptimisticLikes((current) => {
            const next = { ...current };
            delete next[action.id!];
            return next;
          });
        }
        pending.current.delete(key);
        setPendingActions((current) =>
          current.filter((item) => item !== action),
        );
      }
    },
  };
}
