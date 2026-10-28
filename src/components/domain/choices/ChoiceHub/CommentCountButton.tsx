import { MessageCircle } from "lucide-react";
import { commentStyles } from "./Comments.styles";

export function CommentCountButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={commentStyles.countButton}
      aria-label={`댓글 ${count}개 보기`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <MessageCircle size={15} />
      {count.toLocaleString()}
    </button>
  );
}
