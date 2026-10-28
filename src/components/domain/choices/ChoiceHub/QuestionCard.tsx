import { CommentCountButton } from "./CommentCountButton";
import type { ChoiceQuestion } from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { Check, ChevronRight, Users } from "lucide-react";
import { categoryLabels, getQuestionOptions } from "./choice-utils";
import { QuestionByline } from "./QuestionByline";
import { LikeButton } from "./LikeButton";
import { choiceHubStyles } from "./styles";

interface QuestionCardProps {
  question: ChoiceQuestion;
  isTight: boolean;
  onOpen: (id: number, tab?: "result" | "comments") => void;
  isLoggedIn: boolean;
  isLikePending: boolean;
  onToggleLike: (question: ChoiceQuestion) => void;
}

export function QuestionCard({
  question,
  isTight,
  onOpen,
  isLoggedIn,
  isLikePending,
  onToggleLike,
}: QuestionCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      className={choiceHubStyles.questionCard}
      onClick={() => onOpen(question.id)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(question.id);
        }
      }}
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
      <QuestionByline question={question} />
      <div className={choiceHubStyles.cardOptions}>
        {getQuestionOptions(question).map(({ option, label }) => (
          <span key={option} className={choiceHubStyles.cardOption}>
            <strong className={choiceHubStyles.cardOptionKey}>{option}</strong>
            {label}
          </span>
        ))}
      </div>
      <div className={choiceHubStyles.cardFooter}>
        <span>
          <Users size={14} className={choiceHubStyles.participantIcon} />
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
          <ChevronRight size={18} className={choiceHubStyles.arrow} />
        </span>
      </div>
    </article>
  );
}
