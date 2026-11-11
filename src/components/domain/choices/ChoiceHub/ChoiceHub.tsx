"use client";

import type { ChoiceCategoryItem } from "@/app/(page)/type/choice-categories";
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
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
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
import { QuestionCalendar } from "./QuestionCalendar";
import { editorialStyles } from "./editorial.styles";
import { cn } from "@/lib/cn";

interface ChoiceHubProps {
  categoryItems: ChoiceCategoryItem[];
  isSearching: boolean;
  searchQuery: string;
  appliedSearch: string;
  onSearchQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  pagination: QuestionPagination;
  createdQuestions?: ChoiceQuestion[];
  createdPagination: QuestionPagination;
  isCreatedLoading: boolean;
  isCreatedError: boolean;
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
  dailyQuestion?: ChoiceQuestion;
  isDailyLoading: boolean;
  isDailyError: boolean;
  onRetryDaily: () => void;
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
  const dailyQuestion = props.dailyQuestion;
  const gridQuestions = dailyQuestion
    ? props.questions?.filter((item) => item.id !== dailyQuestion.id)
    : props.questions;
  const today = useMemo(() => {
    const seoul = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Seoul",
    }).format(new Date());
    return new Date(`${seoul}T12:00:00`);
  }, []);

  return (
    <div className={choiceHubStyles.root}>
      <AppHeader />
      <main className={choiceHubStyles.main}>
        {props.activeView === "mine" ? (
          <MyChoicesView
            createdItems={props.createdQuestions}
            createdPagination={props.createdPagination}
            isCreatedLoading={props.isCreatedLoading}
            isCreatedError={props.isCreatedError}
            categoryItems={props.categoryItems}
            appliedSearch={props.appliedSearch}
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
            onSearchSubmit={props.onSearchSubmit}
            onSearchReset={props.onSearchReset}
            likingQuestionId={props.likingQuestionId}
            onToggleLike={props.onToggleLike}
            sort={props.sort}
            onSortChange={props.onSortChange}
          />
        ) : (
          <>
            <nav
              className={editorialStyles.categories}
              aria-label="질문 카테고리"
            >
              <button
                onClick={() => props.onCategoriesChange([])}
                aria-pressed={props.activeCategories.length === 0}
                className={cn(
                  editorialStyles.category,
                  props.activeCategories.length === 0 &&
                    editorialStyles.categoryActive,
                )}
              >
                전체
              </button>
              {props.categoryItems.map((item) => (
                <button
                  key={item.code}
                  aria-pressed={props.activeCategories.includes(item.code)}
                  onClick={() => props.onCategoriesChange([item.code])}
                  className={cn(
                    editorialStyles.category,
                    props.activeCategories.includes(item.code) &&
                      editorialStyles.categoryActive,
                  )}
                >
                  {item.label}
                </button>
              ))}
              <Link
                href="/questions/new"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  editorialStyles.categoryCreate,
                )}
              >
                <Plus size={17} /> 질문 만들기
              </Link>
            </nav>
            <h1 className={choiceHubStyles.pageHeading}>오늘의 질문</h1>
            <section
              className={editorialStyles.hero}
              aria-label="오늘의 대표 질문"
            >
              {dailyQuestion ? (
                <FeaturedQuestion
                  question={dailyQuestion}
                  onOpen={props.onOpenQuestion}
                  isLoggedIn={props.isLoggedIn}
                  isLikePending={props.likingQuestionId === dailyQuestion.id}
                  onToggleLike={props.onToggleLike}
                />
              ) : (
                <div className={choiceHubStyles.featuredEmpty}>
                  <p className={editorialStyles.introTitle}>
                    {props.isDailyLoading
                      ? "오늘의 질문을 펼치고 있어요…"
                      : props.isDailyError
                        ? "대표 질문을 불러오지 못했어요."
                        : "오늘의 대표 질문을 준비하고 있어요."}
                  </p>
                  {props.isDailyError && (
                    <Button
                      className={choiceHubStyles.retryButton}
                      onClick={props.onRetryDaily}
                    >
                      다시 시도
                    </Button>
                  )}
                  <p className={choiceHubStyles.stateDescription}>
                    아래에서 함께 생각해 볼 질문을 만나보세요.
                  </p>
                </div>
              )}
              <QuestionCalendar
                date={today}
                hasTodayQuestion={Boolean(dailyQuestion)}
              />
            </section>
            <div id="questions" className={editorialStyles.listHeader}>
              <h2 className={editorialStyles.listHeading}>
                함께 생각해 볼 질문
              </h2>
            </div>
            <QuestionFilterBar
              categoryItems={props.categoryItems}
              activeCategories={props.activeCategories}
              searchQuery={searchQuery}
              sort={props.sort}
              onCategoriesChange={props.onCategoriesChange}
              onSearchQueryChange={onSearchQueryChange}
              onSearchSubmit={props.onSearchSubmit}
              onSearchReset={props.onSearchReset}
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
                    {props.appliedSearch || props.activeCategories.length
                      ? "검색 결과가 없어요."
                      : "아직 등록된 질문이 없어요."}
                  </p>
                  <p className={choiceHubStyles.stateDescription}>
                    {props.appliedSearch || props.activeCategories.length
                      ? "다른 검색어나 카테고리로 찾아보세요."
                      : "새로운 질문을 준비하고 있습니다."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {Boolean(gridQuestions?.length) && (
                  <section>
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
