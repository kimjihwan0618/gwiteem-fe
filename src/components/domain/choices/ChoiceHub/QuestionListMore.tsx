"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { choiceHubStyles as styles } from "./styles";

export interface QuestionPagination {
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoadMoreError: boolean;
  isPaused: boolean;
  onLoadMore: () => void;
}

export function QuestionListMore({
  pagination,
}: {
  pagination: QuestionPagination;
}) {
  const sentinel = useRef<HTMLDivElement>(null);
  const { hasMore, isLoadingMore, isLoadMoreError, isPaused, onLoadMore } =
    pagination;

  useEffect(() => {
    const target = sentinel.current;
    if (!target || !hasMore || isLoadingMore || isLoadMoreError || isPaused)
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "300px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoadMoreError, isPaused, onLoadMore]);

  if (!hasMore) return null;
  return (
    <div ref={sentinel} className={styles.loadMore} aria-live="polite">
      {isLoadMoreError && (
        <p role="alert">질문을 더 불러오지 못했어요. 다시 시도해 주세요.</p>
      )}
      <Button
        variant="ghost"
        isPending={isLoadingMore}
        loadingText="질문을 불러오는 중"
        disabled={isPaused}
        onClick={onLoadMore}
      >
        {isLoadMoreError ? "다시 시도" : "질문 더 보기"}
      </Button>
    </div>
  );
}
