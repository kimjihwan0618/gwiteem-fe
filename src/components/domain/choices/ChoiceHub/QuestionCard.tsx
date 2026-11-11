import type { ChoiceQuestion } from "@/app/(page)/(home)/type";
import { ChevronRight } from "lucide-react";
import { CommentCountButton } from "./CommentCountButton";
import { LikeButton } from "./LikeButton";
import { editorialStyles as styles } from "./editorial.styles";
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
  onOpen,
  isLoggedIn,
  isLikePending,
  onToggleLike,
}: QuestionCardProps) {
  return (
    <article className={styles.row}>
      <span className={styles.rowCategory}>{question.category_label}</span>
      <h3>
        <button
          className={styles.titleLink}
          onClick={() => onOpen(question.id)}
        >
          {question.title}
        </button>
      </h3>
      <div className={styles.rowActions}>
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
        <button
          className={styles.rowOpen}
          onClick={() => onOpen(question.id)}
          aria-label={`${question.title} 질문 보기`}
        >
          {question.my_choice ? "참여 완료" : "질문 보기"}
          <ChevronRight size={16} />
        </button>
      </div>
    </article>
  );
}
