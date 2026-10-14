import type {
  ChoiceCategory,
  ChoiceSort,
  MyChoice,
  MyLikedQuestion,
} from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { ChevronRight, Heart, MousePointerClick, Users } from "lucide-react";
import { useState } from "react";
import { categoryLabels, getSelectedOptionLabel } from "./choice-utils";
import { ChoiceSkeleton } from "./ChoiceSkeleton";
import { QuestionFilterBar } from "./QuestionFilterBar";
import { LikeButton } from "./LikeButton";
import { QuestionByline } from "./QuestionByline";
import { choiceHubStyles } from "./styles";

interface MyChoicesViewProps {
  items?: MyChoice[];
  likedItems?: MyLikedQuestion[];
  activeCategories: ChoiceCategory[];
  isLoggedIn: boolean;
  isLoading: boolean;
  searchQuery: string;
  onCategoriesChange: (categories: ChoiceCategory[]) => void;
  onOpenQuestion: (id: number) => void;
  onSearchQueryChange: (query: string) => void;
  likingQuestionId: number | null;
  onToggleLike: (question: MyChoice["question"]) => void;
  sort: ChoiceSort;
  onSortChange: (sort: ChoiceSort) => void;
}

export function MyChoicesView({
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

  if (isLoading) return <ChoiceSkeleton />;

  return (
    <section>
      <div className={choiceHubStyles.mineHeader}>
        <div>
          <p className={choiceHubStyles.eyebrow}>나의 기록</p>
          <h1 className={choiceHubStyles.title}>내 선택</h1>
        </div>
        <Badge variant="outline">{visibleCount}개</Badge>
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
      {visibleCount === 0 ? (
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
                    <ChevronRight size={18} className={choiceHubStyles.arrow} />
                  </span>
                </div>
              </article>
            ))}
        </div>
      )}
    </section>
  );
}
