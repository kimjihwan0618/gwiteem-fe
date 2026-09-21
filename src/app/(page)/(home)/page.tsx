"use client";

import { useEffect, useRef, useState } from "react";
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

const categoryHashes = new Set([
  "all",
  "work",
  "spending",
  "relationship",
  "daily",
]);

export default function Home() {
  const { user, isReady } = useAuth();
  const toast = useToast();
  const [activeCategory, setActiveCategory] = useState<ChoiceCategory | "all">(
    "all",
  );
  const [activeView, setActiveView] = useState<"questions" | "mine">(
    "questions",
  );
  const [sort, setSort] = useState<"popular" | "latest">("popular");
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  );
  const hasMigrated = useRef(false);
  const questions = useChoiceQuestions(activeCategory, sort);
  const detail = useChoiceQuestion(selectedQuestionId);
  const myChoices = useMyChoices(isReady && Boolean(user));
  const vote = useVoteQuestion();
  const migrate = useMigrateGuestVotes();

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "my") {
        setActiveView("mine");
        return;
      }
      setActiveView("questions");
      if (categoryHashes.has(hash)) {
        setActiveCategory(hash as ChoiceCategory | "all");
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (!isReady || !user || hasMigrated.current) return;
    hasMigrated.current = true;
    migrate.mutate();
  }, [isReady, migrate, user]);

  function changeCategory(category: ChoiceCategory | "all") {
    window.location.hash = category;
    setActiveCategory(category);
    setActiveView("questions");
  }

  function handleVote(
    questionId: number,
    selectedOption: ChoiceOption,
    reasonId: number | null,
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
      activeCategory={activeCategory}
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
      isVoting={vote.isPending}
      isLoggedIn={Boolean(user)}
      onCategoryChange={changeCategory}
      onSortChange={setSort}
      onOpenQuestion={setSelectedQuestionId}
      onCloseQuestion={() => setSelectedQuestionId(null)}
      onVote={handleVote}
      onRetry={() => void questions.refetch()}
    />
  );
}
