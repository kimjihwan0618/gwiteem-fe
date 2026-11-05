"use client";

import { useChoiceCategories } from "@/app/(page)/hooks/use-choice-categories";
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

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const router = useRouter();
  const categoryCatalog = useChoiceCategories();
  const catalogFailed = categoryCatalog.isError && !categoryCatalog.data;
  const categoryHashes = new Set(
    categoryCatalog.data?.map((item) => item.code),
  );
  const searchParams = useSearchParams();
  const { user, isReady } = useAuth();
  const toast = useToast();
  const activeCategories = Array.from(
    new Set(
      (searchParams.get("category") ?? "")
        .split(",")
        .filter((category): category is ChoiceCategory =>
          categoryHashes.has(category),
        ),
    ),
  );
  const activeView = searchParams.get("view") === "my" ? "mine" : "questions";
  const [sort, setSort] = useState<ChoiceSort>("popular");
  const { searchQuery, search, changeSearch, submitSearch, resetSearch } =
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
    isReady && Boolean(categoryCatalog.data) && activeView === "questions",
  );
  const detail = useChoiceQuestion(selectedQuestionId);
  const myChoices = useMyChoices(
    isReady &&
      Boolean(categoryCatalog.data) &&
      Boolean(user) &&
      activeView === "mine",
    activeCategories,
    sort,
    search,
    user?.id ?? null,
  );
  const myLikedQuestions = useMyLikedQuestions(
    isReady &&
      Boolean(categoryCatalog.data) &&
      Boolean(user) &&
      activeView === "mine",
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
    // 모달 상태는 서버 페이지 이동 없이 URL과 동기화한다.
    window.history.pushState(null, "", `/?${params.toString()}`);
  }

  function closeQuestion() {
    const params = new URLSearchParams(window.location.search);
    params.delete("question");
    params.delete("tab");
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/?${query}` : "/");
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
      categoryItems={categoryCatalog.data ?? []}
      searchQuery={searchQuery}
      appliedSearch={search}
      onSearchSubmit={submitSearch}
      onSearchReset={resetSearch}
      isSearching={
        activeView === "questions"
          ? questions.isLoading
          : myChoices.isLoading || myLikedQuestions.isLoading
      }
      onSearchQueryChange={changeSearch}
      pagination={{
        hasMore: questions.hasNextPage,
        isLoadingMore: questions.isFetchingNextPage,
        isLoadMoreError: questions.isFetchNextPageError,
        isPaused: questions.isFetching,
        onLoadMore: () => {
          if (!questions.isFetching)
            void questions.fetchNextPage({ cancelRefetch: false });
        },
      }}
      myPagination={{
        hasMore: myChoices.hasNextPage,
        isLoadingMore: myChoices.isFetchingNextPage,
        isLoadMoreError: myChoices.isFetchNextPageError,
        isPaused: myChoices.isFetching,
        onLoadMore: () => {
          if (!myChoices.isFetching)
            void myChoices.fetchNextPage({ cancelRefetch: false });
        },
      }}
      likedPagination={{
        hasMore: myLikedQuestions.hasNextPage,
        isLoadingMore: myLikedQuestions.isFetchingNextPage,
        isLoadMoreError: myLikedQuestions.isFetchNextPageError,
        isPaused: myLikedQuestions.isFetching,
        onLoadMore: () => {
          if (!myLikedQuestions.isFetching)
            void myLikedQuestions.fetchNextPage({ cancelRefetch: false });
        },
      }}
      isMyError={catalogFailed || (myChoices.isError && !myChoices.data)}
      isLikedError={
        catalogFailed || (myLikedQuestions.isError && !myLikedQuestions.data)
      }
      onRetryMine={() => {
        void categoryCatalog.refetch();
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
          ? !catalogFailed && questions.isPending
          : !catalogFailed &&
            Boolean(user) &&
            (myChoices.isPending || myLikedQuestions.isPending))
      }
      isError={(questions.isError && !questions.data) || catalogFailed}
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
      onRetry={() => {
        void categoryCatalog.refetch();
        void questions.refetch();
      }}
    />
  );
}
