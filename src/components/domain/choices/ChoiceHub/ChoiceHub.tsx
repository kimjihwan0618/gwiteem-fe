"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  LogIn,
  Share2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  ChoiceCategory,
  ChoiceOption,
  ChoiceQuestion,
  ChoiceQuestionDetail,
  MyChoice,
} from "@/app/(page)/(home)/type";
import { AppHeader } from "@/components/layout/AppHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/cn";
import {
  categoryTabVariants,
  choiceHubStyles,
  optionButtonVariants,
} from "./styles";

const categories: Array<{
  value: ChoiceCategory | "all";
  label: string;
}> = [
  { value: "all", label: "전체" },
  { value: "work", label: "직장" },
  { value: "spending", label: "소비" },
  { value: "relationship", label: "관계" },
  { value: "daily", label: "일상" },
];

const categoryLabels: Record<ChoiceCategory, string> = {
  work: "직장",
  spending: "소비",
  relationship: "관계",
  daily: "일상",
};

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
  isVoting: boolean;
  isLoggedIn: boolean;
  onCategoryChange: (category: ChoiceCategory | "all") => void;
  onSortChange: (sort: "popular" | "latest") => void;
  onOpenQuestion: (questionId: number) => void;
  onCloseQuestion: () => void;
  onVote: (
    questionId: number,
    option: ChoiceOption,
    reasonId: number | null,
  ) => void;
  onRetry: () => void;
}

export function ChoiceHub(props: ChoiceHubProps) {
  const dailyQuestion = props.questions?.find((item) => item.is_daily);
  const gridQuestions = props.questions?.filter(
    (item) => item.id !== dailyQuestion?.id,
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
            items={props.myChoices}
            isLoggedIn={props.isLoggedIn}
            isLoading={props.isLoading}
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
            <div className={choiceHubStyles.mobileCategories}>
              {categories.map((category) => (
                <button
                  key={category.value}
                  className={categoryTabVariants({
                    active: props.activeCategory === category.value,
                  })}
                  onClick={() => props.onCategoryChange(category.value)}
                >
                  {category.label}
                </button>
              ))}
            </div>
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
          isVoting={props.isVoting}
          isLoggedIn={props.isLoggedIn}
          onClose={props.onCloseQuestion}
          onVote={props.onVote}
        />
      )}
    </div>
  );
}

function FeaturedQuestion({
  question,
  onOpen,
}: {
  question: ChoiceQuestion;
  onOpen: (id: number) => void;
}) {
  return (
    <section className={choiceHubStyles.featured}>
      <div className={choiceHubStyles.featuredGlow} />
      <div className={choiceHubStyles.featuredContent}>
        <div>
          <div className={choiceHubStyles.badgeRow}>
            <Badge>오늘의 질문 · {categoryLabels[question.category]}</Badge>
            {question.my_choice && <Badge variant="success">참여 완료</Badge>}
          </div>
          <h2 className={choiceHubStyles.featuredTitle}>{question.title}</h2>
          <div className={choiceHubStyles.featuredOptions}>
            <div className={choiceHubStyles.featuredOption}>
              <span className={choiceHubStyles.featuredOptionLabel}>A</span>
              {question.option_a}
            </div>
            <span className={choiceHubStyles.versus}>VS</span>
            <div className={choiceHubStyles.featuredOption}>
              <span className={choiceHubStyles.featuredOptionLabelB}>B</span>
              {question.option_b}
            </div>
          </div>
        </div>
        <div className={choiceHubStyles.featuredAction}>
          <Button size="lg" onClick={() => onOpen(question.id)}>
            {question.my_choice ? "결과 다시 보기" : "선택하러 가기"}
            <ArrowRight size={18} />
          </Button>
          <span className={choiceHubStyles.participant}>
            {question.participant_count.toLocaleString()}회 선택
          </span>
        </div>
      </div>
    </section>
  );
}

function QuestionCard({
  question,
  isTight,
  onOpen,
}: {
  question: ChoiceQuestion;
  isTight: boolean;
  onOpen: (id: number) => void;
}) {
  return (
    <button
      className={choiceHubStyles.questionCard}
      onClick={() => onOpen(question.id)}
    >
      <div className={choiceHubStyles.cardMeta}>
        <div className={choiceHubStyles.cardBadges}>
          <Badge>{categoryLabels[question.category]}</Badge>
          {isTight && !question.my_choice && (
            <span className={choiceHubStyles.tension}>많이 참여해요</span>
          )}
        </div>
        {question.my_choice && (
          <span className={choiceHubStyles.voted}>
            <Check size={14} /> 참여 완료
          </span>
        )}
      </div>
      <h3 className={choiceHubStyles.cardTitle}>{question.title}</h3>
      <div className={choiceHubStyles.cardOptions}>
        <span className={choiceHubStyles.cardOption}>
          <strong className={choiceHubStyles.cardOptionA}>A</strong>
          {question.option_a}
        </span>
        <span className={choiceHubStyles.cardOption}>
          <strong className={choiceHubStyles.cardOptionB}>B</strong>
          {question.option_b}
        </span>
      </div>
      <div className={choiceHubStyles.cardFooter}>
        <span>
          <Users size={14} className={choiceHubStyles.participantIcon} />
          {question.participant_count.toLocaleString()}회 선택
        </span>
        <ChevronRight size={18} className={choiceHubStyles.arrow} />
      </div>
    </button>
  );
}

function QuestionDialog({
  detail,
  isLoading,
  isVoting,
  isLoggedIn,
  onClose,
  onVote,
}: {
  detail?: ChoiceQuestionDetail;
  isLoading: boolean;
  isVoting: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onVote: (id: number, option: ChoiceOption, reasonId: number | null) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<ChoiceOption | null>(
    detail?.my_choice ?? null,
  );
  const [reasonId, setReasonId] = useState<number | null>(
    detail?.my_reason_id ?? null,
  );
  const [isEditing, setIsEditing] = useState(!detail?.result);
  const toast = useToast();

  async function shareResult() {
    const text = detail
      ? `${detail.title} 저는 ${detail.my_choice === "A" ? detail.option_a : detail.option_b}를 선택했어요.`
      : "";
    if (navigator.share) {
      await navigator.share({ title: "Gwiteem 나의 선택", text });
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      toast.success("공유 문구를 복사했습니다.");
    }
  }

  return (
    <div className={choiceHubStyles.modalLayer} role="dialog" aria-modal="true">
      <button
        aria-label="질문 닫기"
        className={choiceHubStyles.backdrop}
        onClick={onClose}
      />
      <section className={choiceHubStyles.modal}>
        <header className={choiceHubStyles.modalHeader}>
          <span className={choiceHubStyles.modalHeading}>오늘의 선택</span>
          <button
            aria-label="닫기"
            className={choiceHubStyles.closeButton}
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </header>
        {isLoading || !detail ? (
          <div className={choiceHubStyles.modalBody}>
            <Skeleton className={choiceHubStyles.modalSkeletonBadge} />
            <Skeleton className={choiceHubStyles.modalSkeletonTitle} />
            <Skeleton className={choiceHubStyles.modalSkeletonOptions} />
          </div>
        ) : (
          <div className={choiceHubStyles.modalBody}>
            <Badge>{categoryLabels[detail.category]}</Badge>
            <h2 className={choiceHubStyles.modalQuestion}>{detail.title}</h2>
            <p className={choiceHubStyles.modalHint}>
              선택하면 전체 결과를 확인할 수 있어요.
            </p>

            {detail.result && !isEditing ? (
              <ResultView detail={detail} />
            ) : (
              <>
                <div className={choiceHubStyles.optionGrid}>
                  <button
                    className={optionButtonVariants({
                      tone: "a",
                      selected: selectedOption === "A",
                    })}
                    onClick={() => setSelectedOption("A")}
                  >
                    <span className={choiceHubStyles.optionLetter}>A</span>
                    <span className={choiceHubStyles.optionText}>
                      {detail.option_a}
                    </span>
                  </button>
                  <button
                    className={optionButtonVariants({
                      tone: "b",
                      selected: selectedOption === "B",
                    })}
                    onClick={() => setSelectedOption("B")}
                  >
                    <span className={choiceHubStyles.optionLetterB}>B</span>
                    <span className={choiceHubStyles.optionText}>
                      {detail.option_b}
                    </span>
                  </button>
                </div>
                {selectedOption && (
                  <div className={choiceHubStyles.reasonPanel}>
                    <label
                      htmlFor="choice-reason"
                      className={choiceHubStyles.reasonLabel}
                    >
                      왜 이 선택을 했나요?{" "}
                      <span className={choiceHubStyles.optionalLabel}>
                        (선택)
                      </span>
                    </label>
                    <select
                      id="choice-reason"
                      value={reasonId ?? ""}
                      onChange={(event) =>
                        setReasonId(
                          event.target.value
                            ? Number(event.target.value)
                            : null,
                        )
                      }
                      className={choiceHubStyles.select}
                    >
                      <option value="">가장 가까운 이유를 선택해 주세요</option>
                      {detail.reasons.map((reason) => (
                        <option key={reason.id} value={reason.id}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                    <div className={choiceHubStyles.submitRow}>
                      {detail.result && (
                        <Button
                          variant="ghost"
                          onClick={() => setIsEditing(false)}
                        >
                          취소
                        </Button>
                      )}
                      <Button
                        isPending={isVoting}
                        loadingText="반영 중"
                        onClick={() =>
                          selectedOption &&
                          onVote(detail.id, selectedOption, reasonId)
                        }
                      >
                        결과 보기
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {detail.result && !isEditing && (
              <>
                <div className={choiceHubStyles.resultActions}>
                  <Button
                    variant="secondary"
                    onClick={() => void shareResult()}
                  >
                    <Share2 size={17} /> 내 결과 공유
                  </Button>
                  {isLoggedIn ? (
                    <div className={choiceHubStyles.saved}>
                      <CheckCircle2 size={17} /> 나의 선택에 저장됨
                    </div>
                  ) : (
                    <Link href="/login" className={buttonVariants()}>
                      <LogIn size={17} /> 로그인하고 선택 저장
                    </Link>
                  )}
                </div>
                <div className={choiceHubStyles.submitRow}>
                  <Button variant="ghost" onClick={() => setIsEditing(true)}>
                    선택 바꾸기
                  </Button>
                </div>
                {!isLoggedIn && (
                  <p className={choiceHubStyles.loginNote}>
                    지금 선택은 이 브라우저에 유지됩니다. 로그인하면 다른
                    기기에서도 기록을 확인할 수 있어요.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function ResultView({ detail }: { detail: ChoiceQuestionDetail }) {
  if (!detail.result) return null;
  const result = detail.result;
  return (
    <section>
      <h3 className={choiceHubStyles.resultHeading}>
        사람들은 이렇게 선택했어요
      </h3>
      <div className={choiceHubStyles.resultBar}>
        <div
          className={choiceHubStyles.resultA}
          style={{ width: `${result.option_a_percentage}%` }}
        >
          {result.option_a_percentage}%
        </div>
        <div
          className={choiceHubStyles.resultB}
          style={{ width: `${result.option_b_percentage}%` }}
        >
          {result.option_b_percentage}%
        </div>
      </div>
      <div className={choiceHubStyles.resultLabels}>
        <span>A · {detail.option_a}</span>
        <span className={choiceHubStyles.resultLabelB}>
          B · {detail.option_b}
        </span>
      </div>
      <p className={choiceHubStyles.participant}>
        총 {result.total_count.toLocaleString()}회 선택
      </p>
      <div className={choiceHubStyles.reasonResults}>
        {result.reasons.map((reason) => (
          <div key={reason.id} className={choiceHubStyles.reasonResult}>
            <div>
              <p className={choiceHubStyles.reasonText}>{reason.label}</p>
              <div className={choiceHubStyles.reasonTrack}>
                <div
                  className={choiceHubStyles.reasonFill}
                  style={{ width: `${reason.percentage}%` }}
                />
              </div>
            </div>
            <span className={choiceHubStyles.reasonPercent}>
              {reason.percentage}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MyChoicesView({
  items,
  isLoggedIn,
  isLoading,
  onOpenQuestion,
}: {
  items?: MyChoice[];
  isLoggedIn: boolean;
  isLoading: boolean;
  onOpenQuestion: (id: number) => void;
}) {
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
      {!items?.length ? (
        <div className={choiceHubStyles.state}>
          <div>
            <p className={choiceHubStyles.stateTitle}>저장된 선택이 없어요.</p>
            <p className={choiceHubStyles.stateDescription}>
              오늘의 질문에 답하면 여기에 기록됩니다.
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
                {item.selected_option === "A"
                  ? item.question.option_a
                  : item.question.option_b}
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

function ChoiceSkeleton() {
  return (
    <>
      <Skeleton className={choiceHubStyles.skeletonFeatured} />
      <div className={choiceHubStyles.skeletonGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className={choiceHubStyles.skeletonCard} />
        ))}
      </div>
    </>
  );
}
