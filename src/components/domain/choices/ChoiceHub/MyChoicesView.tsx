import type { ChoiceCategory, MyChoice } from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { categoryLabels, getSelectedOptionLabel } from "./choice-utils";
import { ChoiceSkeleton } from "./ChoiceSkeleton";
import { QuestionFilterBar } from "./QuestionFilterBar";
import { choiceHubStyles } from "./styles";

interface MyChoicesViewProps {
  items?: MyChoice[];
  activeCategories: ChoiceCategory[];
  isLoggedIn: boolean;
  isLoading: boolean;
  searchQuery: string;
  onCategoriesChange: (categories: ChoiceCategory[]) => void;
  onOpenQuestion: (id: number) => void;
  onSearchQueryChange: (query: string) => void;
}

export function MyChoicesView({
  items,
  activeCategories,
  isLoggedIn,
  isLoading,
  searchQuery,
  onCategoriesChange,
  onOpenQuestion,
  onSearchQueryChange,
}: MyChoicesViewProps) {
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
        <Badge variant="outline">{items?.length ?? 0}개의 선택</Badge>
      </div>
      <QuestionFilterBar
        activeCategories={activeCategories}
        searchQuery={searchQuery}
        onCategoriesChange={onCategoriesChange}
        onSearchQueryChange={onSearchQueryChange}
      />
      {!items?.length ? (
        <div className={choiceHubStyles.state}>
          <div>
            <p className={choiceHubStyles.stateTitle}>
              {searchQuery.trim()
                ? "검색 결과가 없어요."
                : activeCategories.length === 0
                  ? "저장된 선택이 없어요."
                  : "이 카테고리에 저장된 선택이 없어요."}
            </p>
            <p className={choiceHubStyles.stateDescription}>
              {searchQuery.trim()
                ? "다른 검색어나 카테고리로 찾아보세요."
                : "오늘의 질문에 답하면 여기에 기록됩니다."}
            </p>
          </div>
        </div>
      ) : (
        <div className={choiceHubStyles.mineList}>
          {items.map((item) => (
            <button
              key={item.question.id}
              className={choiceHubStyles.mineItem}
              onClick={() => onOpenQuestion(item.question.id)}
            >
              <div className={choiceHubStyles.mineMeta}>
                <Badge>{categoryLabels[item.question.category]}</Badge>
                <span className={choiceHubStyles.mineDate}>
                  {new Intl.DateTimeFormat("ko-KR").format(
                    new Date(item.voted_at),
                  )}
                </span>
              </div>
              <p className={choiceHubStyles.mineQuestion}>
                {item.question.title}
              </p>
              <p className={choiceHubStyles.mineAnswer}>
                {item.selected_option} ·{" "}
                {getSelectedOptionLabel(item.question, item.selected_option)}
              </p>
              {item.reason && (
                <p className={choiceHubStyles.mineReason}>
                  {item.reason.label}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
