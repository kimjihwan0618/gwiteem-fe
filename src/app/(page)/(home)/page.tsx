"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useChoiceQuestion,
  useChoiceQuestions,
  useMigrateGuestVotes,
  useMyChoices,
  useVoteQuestion,
} from "./hooks";
import type { ChoiceCategory, ChoiceOption } from "./type";
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
  const [sort, setSort] = useState<"popular" | "latest">("popular");
  const questionParam = searchParams.get("question");
  const parsedQuestionId = questionParam ? Number(questionParam) : null;
  const selectedQuestionId =
    parsedQuestionId &&
    Number.isInteger(parsedQuestionId) &&
    parsedQuestionId > 0
      ? parsedQuestionId
      : null;
  const hasMigrated = useRef(false);
  const questions = useChoiceQuestions("all", sort);
  const detail = useChoiceQuestion(selectedQuestionId);
  const myChoices = useMyChoices(isReady && Boolean(user));
  const vote = useVoteQuestion();
  const migrate = useMigrateGuestVotes();

  useEffect(() => {
    if (!isReady || !user || hasMigrated.current) return;
    hasMigrated.current = true;
    migrate.mutate();
  }, [isReady, migrate, user]);

  function changeCategories(categories: ChoiceCategory[]) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("question");
    if (categories.length) {
      params.set("category", categories.join(","));
    } else {
      params.delete("category");
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/", { scroll: false });
  }

  function openQuestion(questionId: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("question", String(questionId));
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  function closeQuestion() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("question");
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

  return (
    <ChoiceHub
      activeCategories={activeCategories}
      activeView={activeView}
      sort={sort}
      questions={questions.data}
      detail={detail.data}
      myChoices={myChoices.data}
      selectedQuestionId={selectedQuestionId}
      isLoading={
        !isReady ||
        (activeView === "questions" ? questions.isPending : myChoices.isPending)
      }
      isError={questions.isError}
      isDetailLoading={detail.isPending}
      isDetailError={detail.isError}
      isVoting={vote.isPending}
      isLoggedIn={Boolean(user)}
      onCategoriesChange={changeCategories}
      onSortChange={setSort}
      onOpenQuestion={openQuestion}
      onCloseQuestion={closeQuestion}
      onVote={handleVote}
      onRetry={() => void questions.refetch()}
    />
  );
}
