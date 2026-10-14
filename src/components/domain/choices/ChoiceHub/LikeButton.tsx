"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { choiceHubStyles } from "./styles";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  canLike: boolean;
  isPending?: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export function LikeButton({
  isLiked,
  likeCount,
  canLike,
  isPending = false,
  onToggle,
  compact = false,
}: LikeButtonProps) {
  const [isCelebrating, setIsCelebrating] = useState(false);

  return (
    <button
      type="button"
      aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      aria-pressed={isLiked}
      className={cn(
        choiceHubStyles.likeButton,
        isLiked && choiceHubStyles.likeButtonActive,
        compact && choiceHubStyles.likeButtonCompact,
      )}
      disabled={isPending}
      onClick={(event) => {
        event.stopPropagation();
        if (canLike && !isLiked) setIsCelebrating(true);
        onToggle();
      }}
    >
      <span className={choiceHubStyles.likeIconWrap} aria-hidden="true">
        <Heart
          size={compact ? 16 : 18}
          className={cn(
            "like-heart",
            isLiked && "fill-current",
            isCelebrating && "like-heart-pop",
          )}
          onAnimationEnd={() => setIsCelebrating(false)}
        />
        {isCelebrating && (
          <span className="like-particles">
            <i />
            <i />
            <i />
            <i />
          </span>
        )}
      </span>
      <span>{likeCount.toLocaleString()}</span>
    </button>
  );
}
