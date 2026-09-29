"use client";

import type {
  ChoiceCategory,
  ChoiceOption,
  ChoiceQuestion,
  ChoiceQuestionDetail,
  MyChoice,
} from "@/app/(page)/(home)/type";
import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useMemo } from "react";
import { CategoryTabs } from "./CategoryTabs";
import { ChoiceSkeleton } from "./ChoiceSkeleton";
import { FeaturedQuestion } from "./FeaturedQuestion";
import { MyChoicesView } from "./MyChoicesView";
import { QuestionCard } from "./QuestionCard";
import { QuestionDialog } from "./QuestionDialog";
import { choiceHubStyles } from "./styles";

interface ChoiceHubProps {
  activeCategory: ChoiceCategory | "all";
  activeView: "questions" | "mine";
  sort: "popular" | "latest";
  questions?: ChoiceQuestion[];
  detail?: ChoiceQuestionDetail;
  myChoices?: MyChoice[];
  selectedQuestionId: number | null;
  isLoading: boolean;
  isError: boolean;
  isDetailLoading: boolean;
  isDetailError: boolean;
  isVoting: boolean;
  isLoggedIn: boolean;
  onCategoryChange: (category: ChoiceCategory | "all") => void;
  onSortChange: (sort: "popular" | "latest") => void;
  onOpenQuestion: (questionId: number) => void;
  onCloseQuestion: () => void;
  onVote: (questionId: number, option: ChoiceOption, reasonId: number) => void;
  onRetry: () => void;
}

export function ChoiceHub(props: ChoiceHubProps) {
  const dailyQuestion =
    props.activeCategory === "all"
      ? props.questions?.find((item) => item.is_daily)
      : undefined;
  const gridQuestions = dailyQuestion
    ? props.questions?.filter((item) => item.id !== dailyQuestion.id)
    : props.questions;
  const filteredMyChoices =
    props.activeCategory === "all"
      ? props.myChoices
      : props.myChoices?.filter(
          (item) => item.question.category === props.activeCategory,
        );
  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(new Date()),
    [],
  );

  return (
    <div className={choiceHubStyles.root}>
      <AppHeader />
      <main className={choiceHubStyles.main}>
        {props.activeView === "mine" ? (
          <MyChoicesView
            items={filteredMyChoices}
            activeCategory={props.activeCategory}
            isLoggedIn={props.isLoggedIn}
            isLoading={props.isLoading}
            onCategoryChange={props.onCategoryChange}
            onOpenQuestion={props.onOpenQuestion}
          />
        ) : (
          <>
            <section className={choiceHubStyles.intro}>
              <div>
                <p className={choiceHubStyles.eyebrow}>{dateLabel}</p>
                <h1 className={choiceHubStyles.title}>오늘, 당신의 선택은?</h1>
                <p className={choiceHubStyles.subtitle}>
                  가볍게 고르고 사람들의 생각을 확인해 보세요.
                </p>
              </div>
            </section>
            <CategoryTabs
              activeCategory={props.activeCategory}
              onCategoryChange={props.onCategoryChange}
            />
            {props.isLoading ? (
              <ChoiceSkeleton />
            ) : props.isError ? (
              <div className={choiceHubStyles.state}>
                <div>
                  <p className={choiceHubStyles.stateTitle}>
                    질문을 불러오지 못했어요.
                  </p>
                  <p className={choiceHubStyles.stateDescription}>
                    잠시 후 다시 시도해 주세요.
                  </p>
                  <Button
                    className={choiceHubStyles.retryButton}
                    onClick={props.onRetry}
                  >
                    다시 시도
                  </Button>
                </div>
              </div>
            ) : !props.questions?.length ? (
              <div className={choiceHubStyles.state}>
                <div>
                  <p className={choiceHubStyles.stateTitle}>
                    아직 등록된 질문이 없어요.
                  </p>
                  <p className={choiceHubStyles.stateDescription}>
                    새로운 질문을 준비하고 있습니다.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {dailyQuestion && (
                  <FeaturedQuestion
                    question={dailyQuestion}
                    onOpen={props.onOpenQuestion}
                  />
                )}
                <section>
                  <div className={choiceHubStyles.sectionHeader}>
                    <h2 className={choiceHubStyles.sectionTitle}>
                      지금 많이 고민하는 질문
                    </h2>
                    <div className={choiceHubStyles.sortGroup}>
                      {(["popular", "latest"] as const).map((sort) => (
                        <button
                          key={sort}
                          onClick={() => props.onSortChange(sort)}
                          className={cn(
                            choiceHubStyles.sortButton,
                            props.sort === sort &&
                              choiceHubStyles.sortButtonActive,
                          )}
                        >
                          {sort === "popular" ? "인기순" : "최신순"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={choiceHubStyles.grid}>
                    {gridQuestions?.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        isTight={index === 0 && question.participant_count > 0}
                        onOpen={props.onOpenQuestion}
                      />
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </main>
      <SiteFooter />
      {props.selectedQuestionId !== null && (
        <QuestionDialog
          key={`${props.selectedQuestionId}-${props.detail?.result ? "result" : "choice"}`}
          detail={props.detail}
          isLoading={props.isDetailLoading}
          isError={props.isDetailError}
          isVoting={props.isVoting}
          isLoggedIn={props.isLoggedIn}
          onClose={props.onCloseQuestion}
          onVote={props.onVote}
        />
      )}
    </div>
  );
}
