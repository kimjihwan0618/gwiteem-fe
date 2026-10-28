"use client";

import { useQuestionComments } from "./hooks/comments";
import { useQuestionSearch } from "./hooks/use-question-search";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useChoiceQuestion,
  useChoiceQuestions,
  useMigrateGuestVotes,
  useMyChoices,
  useMyLikedQuestions,
  useToggleQuestionLike,
  useVoteQuestion,
} from "./hooks";
import type {
  ChoiceCategory,
  ChoiceOption,
  ChoiceQuestion,
  ChoiceSort,
} from "./type";
import { useAuth } from "@/components/domain/auth/AuthProvider";
import { ChoiceHub } from "@/components/domain/choices/ChoiceHub";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError } from "@/lib/api/response";

const categoryHashes = new Set<ChoiceCategory>([
  "work",
  "spending",
  "relationship",
  "daily",
]);

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isReady } = useAuth();
  const toast = useToast();
  const activeCategories = Array.from(
    new Set(
      (searchParams.get("category") ?? "")
        .split(",")
        .filter((category): category is ChoiceCategory =>
          categoryHashes.has(category as ChoiceCategory),
        ),
    ),
  );
  const activeView = searchParams.get("view") === "my" ? "mine" : "questions";
  const [sort, setSort] = useState<ChoiceSort>("popular");
  const { searchQuery, search, changeSearch, isSearchPending } =
    useQuestionSearch();
  const questionParam = searchParams.get("question");
  const parsedQuestionId = questionParam ? Number(questionParam) : null;
  const selectedQuestionId =
    parsedQuestionId &&
    Number.isInteger(parsedQuestionId) &&
    parsedQuestionId > 0
      ? parsedQuestionId
      : null;
  const comments = useQuestionComments(selectedQuestionId, user?.id ?? null);
  const hasMigrated = useRef(false);
  const questions = useChoiceQuestions(
    activeCategories,
    sort,
    search,
    user?.id ?? null,
    isReady && activeView === "questions",
  );
  const detail = useChoiceQuestion(selectedQuestionId);
  const myChoices = useMyChoices(
    isReady && Boolean(user) && activeView === "mine",
    activeCategories,
    sort,
    search,
    user?.id ?? null,
  );
  const myLikedQuestions = useMyLikedQuestions(
    isReady && Boolean(user) && activeView === "mine",
    activeCategories,
    sort,
    search,
    user?.id ?? null,
  );
  const vote = useVoteQuestion();
  const toggleLike = useToggleQuestionLike();
  const migrate = useMigrateGuestVotes();

  useEffect(() => {
    if (!isReady || !user || hasMigrated.current) return;
    hasMigrated.current = true;
    migrate.mutate();
  }, [isReady, migrate, user]);

  function changeCategories(categories: ChoiceCategory[]) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("question");
    params.delete("tab");
    if (categories.length) {
      params.set("category", categories.join(","));
    } else {
      params.delete("category");
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/", { scroll: false });
  }

  function openQuestion(
    questionId: number,
    tab: "result" | "comments" = "result",
  ) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("question", String(questionId));
    params.set("tab", tab);
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  function closeQuestion() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("question");
    params.delete("tab");
    const query = params.toString();
    router.push(query ? `/?${query}` : "/", { scroll: false });
  }

  function handleVote(
    questionId: number,
    selectedOption: ChoiceOption,
    reasonId: number,
  ) {
    vote.mutate(
      { questionId, selectedOption, reasonId },
      {
        onSuccess: () => toast.success("선택이 반영되었습니다."),
        onError: (error) =>
          toast.error(
            error instanceof ApiError
              ? error.message
              : "선택을 반영하지 못했습니다.",
          ),
      },
    );
  }

  function handleToggleLike(question: ChoiceQuestion) {
    if (!user) {
      toast.info("로그인하면 질문에 좋아요를 남길 수 있어요.");
      return;
    }
    toggleLike.mutate(
      { questionId: question.id, isLiked: !question.is_liked },
      {
        onError: (error) =>
          toast.error(
            error instanceof ApiError
              ? error.message
              : "좋아요를 반영하지 못했습니다.",
          ),
      },
    );
  }

  return (
    <ChoiceHub
      searchQuery={searchQuery}
      isSearching={
        isSearchPending ||
        (activeView === "questions"
          ? questions.isFetching && !questions.isFetchingNextPage
          : (myChoices.isFetching && !myChoices.isFetchingNextPage) ||
            (myLikedQuestions.isFetching &&
              !myLikedQuestions.isFetchingNextPage))
      }
      onSearchQueryChange={changeSearch}
      pagination={{
        hasMore: questions.hasNextPage,
        isLoadingMore: questions.isFetchingNextPage,
        isLoadMoreError: questions.isFetchNextPageError,
        isPaused: isSearchPending || questions.isFetching,
        onLoadMore: () => {
          if (!questions.isFetching)
            void questions.fetchNextPage({ cancelRefetch: false });
        },
      }}
      myPagination={{
        hasMore: myChoices.hasNextPage,
        isLoadingMore: myChoices.isFetchingNextPage,
        isLoadMoreError: myChoices.isFetchNextPageError,
        isPaused: isSearchPending || myChoices.isFetching,
        onLoadMore: () => {
          if (!myChoices.isFetching)
            void myChoices.fetchNextPage({ cancelRefetch: false });
        },
      }}
      likedPagination={{
        hasMore: myLikedQuestions.hasNextPage,
        isLoadingMore: myLikedQuestions.isFetchingNextPage,
        isLoadMoreError: myLikedQuestions.isFetchNextPageError,
        isPaused: isSearchPending || myLikedQuestions.isFetching,
        onLoadMore: () => {
          if (!myLikedQuestions.isFetching)
            void myLikedQuestions.fetchNextPage({ cancelRefetch: false });
        },
      }}
      isMyError={myChoices.isError && !myChoices.data}
      isLikedError={myLikedQuestions.isError && !myLikedQuestions.data}
      onRetryMine={() => {
        void myChoices.refetch();
        void myLikedQuestions.refetch();
      }}
      comments={comments}
      initialTab={
        searchParams.get("tab") === "comments" ? "comments" : "result"
      }
      activeCategories={activeCategories}
      activeView={activeView}
      sort={sort}
      questions={questions.data}
      detail={detail.data}
      myChoices={myChoices.data}
      myLikedQuestions={myLikedQuestions.data}
      selectedQuestionId={selectedQuestionId}
      isLoading={
        !isReady ||
        (activeView === "questions"
          ? questions.isPending
          : Boolean(user) &&
            (myChoices.isPending || myLikedQuestions.isPending))
      }
      isError={questions.isError && !questions.data}
      isDetailLoading={detail.isPending}
      isDetailError={detail.isError}
      isVoting={vote.isPending}
      likingQuestionId={
        toggleLike.isPending ? toggleLike.variables.questionId : null
      }
      isLoggedIn={Boolean(user)}
      onCategoriesChange={changeCategories}
      onSortChange={setSort}
      onOpenQuestion={openQuestion}
      onCloseQuestion={closeQuestion}
      onVote={handleVote}
      onToggleLike={handleToggleLike}
      onRetry={() => void questions.refetch()}
    />
  );
}
