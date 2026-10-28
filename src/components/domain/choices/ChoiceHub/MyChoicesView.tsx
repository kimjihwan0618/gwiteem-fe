import { CommentCountButton } from "./CommentCountButton";
import type {
  ChoiceCategory,
  ChoiceSort,
  MyChoice,
  MyLikedQuestion,
} from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { QuestionListMore, type QuestionPagination } from "./QuestionListMore";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { ChevronRight, Heart, MousePointerClick, Users } from "lucide-react";
import { useState } from "react";
import { categoryLabels, getSelectedOptionLabel } from "./choice-utils";
import { ChoiceSkeleton } from "./ChoiceSkeleton";
import { SearchLoading } from "./SearchLoading";
import { QuestionFilterBar } from "./QuestionFilterBar";
import { LikeButton } from "./LikeButton";
import { QuestionByline } from "./QuestionByline";
import { choiceHubStyles } from "./styles";

interface MyChoicesViewProps {
  isSearching: boolean;
  pagination: QuestionPagination;
  likedPagination: QuestionPagination;
  isError: boolean;
  isLikedError: boolean;
  onRetry: () => void;
  items?: MyChoice[];
  likedItems?: MyLikedQuestion[];
  activeCategories: ChoiceCategory[];
  isLoggedIn: boolean;
  isLoading: boolean;
  searchQuery: string;
  onCategoriesChange: (categories: ChoiceCategory[]) => void;
  onOpenQuestion: (id: number, tab?: "result" | "comments") => void;
  onSearchQueryChange: (query: string, isComposing?: boolean) => void;
  likingQuestionId: number | null;
  onToggleLike: (question: MyChoice["question"]) => void;
  sort: ChoiceSort;
  onSortChange: (sort: ChoiceSort) => void;
}

export function MyChoicesView({
  isSearching,
  pagination,
  likedPagination,
  isError,
  isLikedError,
  onRetry,
  items,
  likedItems,
  activeCategories,
  isLoggedIn,
  isLoading,
  searchQuery,
  onCategoriesChange,
  onOpenQuestion,
  onSearchQueryChange,
  likingQuestionId,
  onToggleLike,
  sort,
  onSortChange,
}: MyChoicesViewProps) {
  const [activeRecord, setActiveRecord] = useState<"participated" | "liked">(
    "participated",
  );
  const visibleCount =
    activeRecord === "participated"
      ? (items?.length ?? 0)
      : (likedItems?.length ?? 0);
  if (!isLoggedIn) {
    return (
      <div className={choiceHubStyles.state}>
        <div>
          <p className={choiceHubStyles.stateTitle}>
            로그인하면 선택 기록을 모아볼 수 있어요.
          </p>
          <p className={choiceHubStyles.stateDescription}>
            비로그인 상태에서도 질문 참여와 결과 확인은 가능합니다.
          </p>
          <Link
            href="/login"
            className={cn(buttonVariants(), choiceHubStyles.loginLink)}
          >
            로그인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className={choiceHubStyles.mineHeader}>
        <div>
          <p className={choiceHubStyles.eyebrow}>나의 기록</p>
          <h1 className={choiceHubStyles.title}>내 선택</h1>
        </div>
      </div>
      <div
        className={choiceHubStyles.mineTabs}
        role="tablist"
        aria-label="내 기록 구분"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeRecord === "participated"}
          className={cn(
            choiceHubStyles.mineTab,
            activeRecord === "participated" && choiceHubStyles.mineTabActive,
          )}
          onClick={() => setActiveRecord("participated")}
        >
          <MousePointerClick size={16} /> 참여한 질문
          <span className={choiceHubStyles.mineTabCount}>
            {items?.length ?? 0}
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeRecord === "liked"}
          className={cn(
            choiceHubStyles.mineTab,
            activeRecord === "liked" && choiceHubStyles.mineTabActive,
          )}
          onClick={() => setActiveRecord("liked")}
        >
          <Heart size={16} /> 좋아요한 질문
          <span className={choiceHubStyles.mineTabCount}>
            {likedItems?.length ?? 0}
          </span>
        </button>
      </div>
      <QuestionFilterBar
        activeCategories={activeCategories}
        searchQuery={searchQuery}
        onCategoriesChange={onCategoriesChange}
        onSearchQueryChange={onSearchQueryChange}
        sort={sort}
        onSortChange={onSortChange}
      />
      {isSearching ? (
        <SearchLoading />
      ) : isLoading ? (
        <ChoiceSkeleton />
      ) : (activeRecord === "participated" ? isError : isLikedError) ? (
        <div className={choiceHubStyles.state} role="alert">
          질문을 불러오지 못했어요.
          <Button variant="ghost" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      ) : visibleCount === 0 ? (
        <div className={choiceHubStyles.state}>
          <div>
            <p className={choiceHubStyles.stateTitle}>
              {searchQuery.trim()
                ? "검색 결과가 없어요."
                : activeCategories.length === 0
                  ? activeRecord === "participated"
                    ? "참여한 질문이 없어요."
                    : "좋아요한 질문이 없어요."
                  : "이 카테고리에 해당하는 질문이 없어요."}
            </p>
            <p className={choiceHubStyles.stateDescription}>
              {searchQuery.trim()
                ? "다른 검색어나 카테고리로 찾아보세요."
                : activeRecord === "participated"
                  ? "질문에 답하면 참여한 질문으로 기록됩니다."
                  : "마음에 드는 질문의 하트를 눌러보세요."}
            </p>
          </div>
        </div>
      ) : (
        <div className={choiceHubStyles.mineList}>
          {activeRecord === "participated" &&
            items?.map((item) => (
              <article
                role="button"
                tabIndex={0}
                key={item.question.id}
                className={choiceHubStyles.questionCard}
                onClick={() => onOpenQuestion(item.question.id)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenQuestion(item.question.id);
                  }
                }}
              >
                <div className={choiceHubStyles.cardMeta}>
                  <Badge>{categoryLabels[item.question.category]}</Badge>
                </div>
                <h3 className={choiceHubStyles.cardTitle}>
                  {item.question.title}
                </h3>
                <QuestionByline question={item.question} />
                <div className={choiceHubStyles.mineSelection}>
                  <p className={choiceHubStyles.mineAnswer}>
                    {item.selected_option} ·{" "}
                    {getSelectedOptionLabel(
                      item.question,
                      item.selected_option,
                    )}
                  </p>
                  {item.reason && (
                    <p className={choiceHubStyles.mineReason}>
                      {item.reason.label}
                    </p>
                  )}
                </div>
                <div className={choiceHubStyles.cardFooter}>
                  <span>
                    <Users
                      size={14}
                      className={choiceHubStyles.participantIcon}
                    />
                    {item.question.participant_count.toLocaleString()}회 선택
                  </span>
                  <span className={choiceHubStyles.cardFooterActions}>
                    <LikeButton
                      compact
                      isLiked={item.question.is_liked}
                      likeCount={item.question.like_count}
                      canLike
                      isPending={likingQuestionId === item.question.id}
                      onToggle={() => onToggleLike(item.question)}
                    />
                    <CommentCountButton
                      count={item.question.comment_count}
                      onClick={() =>
                        onOpenQuestion(item.question.id, "comments")
                      }
                    />
                    <ChevronRight size={18} className={choiceHubStyles.arrow} />
                  </span>
                </div>
              </article>
            ))}
          {activeRecord === "liked" &&
            likedItems?.map((item) => (
              <article
                role="button"
                tabIndex={0}
                key={item.question.id}
                className={choiceHubStyles.questionCard}
                onClick={() => onOpenQuestion(item.question.id)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenQuestion(item.question.id);
                  }
                }}
              >
                <div className={choiceHubStyles.cardMeta}>
                  <Badge>{categoryLabels[item.question.category]}</Badge>
                </div>
                <h3 className={choiceHubStyles.cardTitle}>
                  {item.question.title}
                </h3>
                <QuestionByline question={item.question} />
                <div className={choiceHubStyles.cardFooter}>
                  <span>
                    <Users
                      size={14}
                      className={choiceHubStyles.participantIcon}
                    />
                    {item.question.participant_count.toLocaleString()}회 선택
                  </span>
                  <span className={choiceHubStyles.cardFooterActions}>
                    <LikeButton
                      compact
                      isLiked={item.question.is_liked}
                      likeCount={item.question.like_count}
                      canLike
                      isPending={likingQuestionId === item.question.id}
                      onToggle={() => onToggleLike(item.question)}
                    />
                    <CommentCountButton
                      count={item.question.comment_count}
                      onClick={() =>
                        onOpenQuestion(item.question.id, "comments")
                      }
                    />
                    <ChevronRight size={18} className={choiceHubStyles.arrow} />
                  </span>
                </div>
              </article>
            ))}
        </div>
      )}
      {!isSearching && !isLoading && visibleCount > 0 && (
        <QuestionListMore
          pagination={
            activeRecord === "participated" ? pagination : likedPagination
          }
        />
      )}
    </section>
  );
}
