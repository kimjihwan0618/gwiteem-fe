import { CommentCountButton } from "./CommentCountButton";
import type { ChoiceQuestion } from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, Users } from "lucide-react";
import {
  categoryLabels,
  getQuestionOptions,
  optionTones,
} from "./choice-utils";
import { QuestionByline } from "./QuestionByline";
import { LikeButton } from "./LikeButton";
import { choiceHubStyles, optionLabelVariants } from "./styles";

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
  return (
    <article
      className={choiceHubStyles.featured}
      role="button"
      tabIndex={0}
      aria-label={`오늘의 질문: ${question.title}`}
      onClick={() => onOpen(question.id)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(question.id);
        }
      }}
    >
      <div className={choiceHubStyles.featuredGlow} />
      <div className={choiceHubStyles.featuredContent}>
        <div>
          <div className={choiceHubStyles.badgeRow}>
            <Badge>오늘의 질문 · {categoryLabels[question.category]}</Badge>
            {question.my_choice && <Badge variant="success">참여 완료</Badge>}
          </div>
          <h2 className={choiceHubStyles.featuredTitle}>{question.title}</h2>
          <div className={choiceHubStyles.featuredMeta}>
            <QuestionByline question={question} />
          </div>
          <div className={choiceHubStyles.featuredOptions}>
            {getQuestionOptions(question).map(({ option, label }) => (
              <div key={option} className={choiceHubStyles.featuredOption}>
                <span
                  className={optionLabelVariants({
                    tone: optionTones[option],
                  })}
                >
                  {option}
                </span>
                {label}
              </div>
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
