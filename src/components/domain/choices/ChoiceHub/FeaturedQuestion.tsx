import { CommentCountButton } from "./CommentCountButton";
import type { ChoiceQuestion } from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, Users } from "lucide-react";
import { getQuestionOptions } from "./choice-utils";
import { QuestionByline } from "./QuestionByline";
import { LikeButton } from "./LikeButton";
import { choiceHubStyles } from "./styles";
import { cn } from "@/lib/cn";

interface FeaturedQuestionProps {
  question: ChoiceQuestion;
  onOpen: (id: number, tab?: "result" | "comments") => void;
  isLoggedIn: boolean;
  isLikePending: boolean;
  onToggleLike: (question: ChoiceQuestion) => void;
}

export function FeaturedQuestion({
  question,
  onOpen,
  isLoggedIn,
  isLikePending,
  onToggleLike,
}: FeaturedQuestionProps) {
  const options = getQuestionOptions(question);
  return (
    <article
      className={choiceHubStyles.featured}
      aria-label={`오늘의 질문: ${question.title}`}
    >
      <div className={choiceHubStyles.featuredGlow} />
      <div className={choiceHubStyles.featuredContent}>
        <div>
          <div className={choiceHubStyles.badgeRow}>
            <Badge>오늘의 질문 · {question.category_label}</Badge>
            {question.my_choice && <Badge variant="success">참여 완료</Badge>}
          </div>
          <h2 className={choiceHubStyles.featuredTitle}>
            <button
              className={choiceHubStyles.featuredOpen}
              onClick={() => onOpen(question.id)}
            >
              {question.title}
            </button>
          </h2>
          <div className={choiceHubStyles.featuredMeta}>
            <QuestionByline question={question} />
          </div>
          <div
            className={cn(
              choiceHubStyles.featuredOptions,
              options.some((item) => item.label.length > 48) &&
                choiceHubStyles.featuredOptionsStacked,
            )}
          >
            {options.map(({ option, label }) => (
              <button
                type="button"
                key={option}
                className={choiceHubStyles.featuredOption}
                onClick={() => onOpen(question.id)}
                aria-label={`${label}, 질문 참여하기`}
              >
                <span className={choiceHubStyles.featuredLetter}>{option}</span>
                <span className={choiceHubStyles.featuredOptionText}>
                  {label}
                </span>
              </button>
            ))}
          </div>
          <div className={choiceHubStyles.featuredEngagement}>
            <span className={choiceHubStyles.participantMeta}>
              <Users size={14} />총{" "}
              {question.participant_count.toLocaleString()}회 선택
            </span>
            <span className={choiceHubStyles.cardFooterActions}>
              <LikeButton
                compact
                isLiked={question.is_liked}
                likeCount={question.like_count}
                canLike={isLoggedIn}
                isPending={isLikePending}
                onToggle={() => onToggleLike(question)}
              />
              <CommentCountButton
                count={question.comment_count}
                onClick={() => onOpen(question.id, "comments")}
              />
              <ChevronRight
                size={18}
                className={choiceHubStyles.arrow}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
