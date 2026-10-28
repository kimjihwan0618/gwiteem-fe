"use client";

import type { CommentsState } from "@/app/(page)/(home)/type/comments";
import type {
  ChoiceCategory,
  ChoiceOption,
  ChoiceQuestion,
  ChoiceQuestionDetail,
  ChoiceSort,
  MyChoice,
  MyLikedQuestion,
} from "@/app/(page)/(home)/type";
import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/Button";
import { useMemo } from "react";
import { QuestionListMore, type QuestionPagination } from "./QuestionListMore";
import { ChoiceSkeleton } from "./ChoiceSkeleton";
import { SearchLoading } from "./SearchLoading";
import { FeaturedQuestion } from "./FeaturedQuestion";
import { MyChoicesView } from "./MyChoicesView";
import { QuestionCard } from "./QuestionCard";
import { QuestionDialog } from "./QuestionDialog";
import { QuestionFilterBar } from "./QuestionFilterBar";
import { choiceHubStyles } from "./styles";

interface ChoiceHubProps {
  isSearching: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string, isComposing?: boolean) => void;
  pagination: QuestionPagination;
  myPagination: QuestionPagination;
  likedPagination: QuestionPagination;
  isMyError: boolean;
  isLikedError: boolean;
  onRetryMine: () => void;
  comments: CommentsState;
  initialTab: "result" | "comments";
  activeCategories: ChoiceCategory[];
  activeView: "questions" | "mine";
  sort: ChoiceSort;
  questions?: ChoiceQuestion[];
  detail?: ChoiceQuestionDetail;
  myChoices?: MyChoice[];
  myLikedQuestions?: MyLikedQuestion[];
  selectedQuestionId: number | null;
  isLoading: boolean;
  isError: boolean;
  isDetailLoading: boolean;
  isDetailError: boolean;
  isVoting: boolean;
  likingQuestionId: number | null;
  isLoggedIn: boolean;
  onCategoriesChange: (categories: ChoiceCategory[]) => void;
  onSortChange: (sort: ChoiceSort) => void;
  onOpenQuestion: (questionId: number, tab?: "result" | "comments") => void;
  onCloseQuestion: () => void;
  onVote: (questionId: number, option: ChoiceOption, reasonId: number) => void;
  onToggleLike: (question: ChoiceQuestion) => void;
  onRetry: () => void;
}

export function ChoiceHub(props: ChoiceHubProps) {
  const { searchQuery, onSearchQueryChange } = props;
  const dailyQuestion =
    props.activeCategories.length === 0
      ? props.questions?.slice(0, 15).find((item) => item.is_daily)
      : undefined;
  const gridQuestions = dailyQuestion
    ? props.questions?.filter((item) => item.id !== dailyQuestion.id)
    : props.questions;
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
            items={props.myChoices}
            likedItems={props.myLikedQuestions}
            pagination={props.myPagination}
            likedPagination={props.likedPagination}
            isError={props.isMyError}
            isLikedError={props.isLikedError}
            onRetry={props.onRetryMine}
            activeCategories={props.activeCategories}
            isLoggedIn={props.isLoggedIn}
            isLoading={props.isLoading}
            isSearching={props.isSearching}
            searchQuery={searchQuery}
            onCategoriesChange={props.onCategoriesChange}
            onOpenQuestion={props.onOpenQuestion}
            onSearchQueryChange={onSearchQueryChange}
            likingQuestionId={props.likingQuestionId}
            onToggleLike={props.onToggleLike}
            sort={props.sort}
            onSortChange={props.onSortChange}
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
            <QuestionFilterBar
              activeCategories={props.activeCategories}
              searchQuery={searchQuery}
              sort={props.sort}
              onCategoriesChange={props.onCategoriesChange}
              onSearchQueryChange={onSearchQueryChange}
              onSortChange={props.onSortChange}
            />
            {props.isSearching ? (
              <SearchLoading />
            ) : props.isLoading ? (
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
                    {searchQuery.trim() || props.activeCategories.length
                      ? "검색 결과가 없어요."
                      : "아직 등록된 질문이 없어요."}
                  </p>
                  <p className={choiceHubStyles.stateDescription}>
                    {searchQuery.trim() || props.activeCategories.length
                      ? "다른 검색어나 카테고리로 찾아보세요."
                      : "새로운 질문을 준비하고 있습니다."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {dailyQuestion && (
                  <FeaturedQuestion
                    question={dailyQuestion}
                    onOpen={props.onOpenQuestion}
                    isLoggedIn={props.isLoggedIn}
                    isLikePending={props.likingQuestionId === dailyQuestion.id}
                    onToggleLike={props.onToggleLike}
                  />
                )}
                {Boolean(gridQuestions?.length) && (
                  <section>
                    <div className={choiceHubStyles.sectionHeader}>
                      <h2 className={choiceHubStyles.sectionTitle}>
                        지금 많이 고민하는 질문
                      </h2>
                    </div>
                    <div className={choiceHubStyles.grid}>
                      {gridQuestions?.map((question, index) => (
                        <QuestionCard
                          key={question.id}
                          question={question}
                          isTight={
                            index === 0 && question.participant_count > 0
                          }
                          onOpen={props.onOpenQuestion}
                          isLoggedIn={props.isLoggedIn}
                          isLikePending={props.likingQuestionId === question.id}
                          onToggleLike={props.onToggleLike}
                        />
                      ))}
                    </div>
                  </section>
                )}
                <QuestionListMore pagination={props.pagination} />
              </>
            )}
          </>
        )}
      </main>
      <SiteFooter />
      {props.selectedQuestionId !== null && (
        <QuestionDialog
          key={`${props.selectedQuestionId}-${props.detail?.result ? "result" : "choice"}`}
          comments={props.comments}
          initialTab={props.initialTab}
          detail={props.detail}
          isLoading={props.isDetailLoading}
          isError={props.isDetailError}
          isVoting={props.isVoting}
          isLoggedIn={props.isLoggedIn}
          onClose={props.onCloseQuestion}
          onVote={props.onVote}
          isLikePending={props.likingQuestionId === props.selectedQuestionId}
          onToggleLike={props.onToggleLike}
        />
      )}
    </div>
  );
}
