"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import type {
  ChoiceComment,
  ChoiceReply,
  CommentsState,
} from "@/app/(page)/(home)/type/comments";
import { LikeButton } from "./LikeButton";
import { CommentMenu } from "./CommentMenu";
import { commentStyles as styles } from "./Comments.styles";

function relativeTime(value: string) {
  const utc = /Z$|[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`;
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(utc).getTime()) / 60000),
  );
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
  return `${Math.floor(minutes / 1440)}일 전`;
}

export function Comments({ state }: { state: CommentsState }) {
  const isCreating = state.pendingActions.some(
    (action) => action.action === "create",
  );
  const [content, setContent] = useState("");
  return (
    <div className={styles.root}>
      <form
        className={styles.composer}
        onSubmit={async (event) => {
          event.preventDefault();
          if (
            content.trim() &&
            (await state.onAction({
              action: "create",
              content: content.trim(),
            }))
          )
            setContent("");
        }}
      >
        <span className={styles.avatar} aria-hidden="true">
          나
        </span>
        <div className={styles.inputArea}>
          <textarea
            aria-label="댓글 내용"
            placeholder={
              state.isLoggedIn
                ? "내 생각을 가볍게 남겨보세요"
                : "로그인 후 댓글을 남길 수 있어요"
            }
            className={styles.input}
            rows={1}
            maxLength={1000}
            value={content}
            disabled={!state.isLoggedIn || isCreating}
            onChange={(e) => setContent(e.target.value)}
          />
          {content.length > 0 && (
            <p className={styles.hint}>{content.length}/1,000</p>
          )}
        </div>
        <Button
          type="submit"
          isPending={isCreating}
          loadingText="처리 중"
          disabled={!state.isLoggedIn || !content.trim()}
        >
          등록
        </Button>
      </form>
      {state.isLoading ? (
        <>
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeleton} />
        </>
      ) : state.isError ? (
        <div className={styles.state}>
          댓글을 불러오지 못했어요.
          <Button variant="ghost" onClick={state.onRetry}>
            다시 시도
          </Button>
        </div>
      ) : !state.items.length ? (
        <p className={styles.state}>
          아직 댓글이 없어요. 첫 생각을 남겨보세요.
        </p>
      ) : (
        <div className={styles.list}>
          {state.items.map((comment) => (
            <CommentRow key={comment.id} comment={comment} state={state} />
          ))}
        </div>
      )}
      {state.isLoadMoreError && (
        <p role="alert" className={styles.hint}>
          댓글을 더 불러오지 못했어요. 다시 시도해 주세요.
        </p>
      )}
      {state.hasMore && (
        <div className={styles.more}>
          <Button
            variant="ghost"
            isPending={state.isLoadingMore}
            onClick={state.onLoadMore}
          >
            댓글 더 보기
          </Button>
        </div>
      )}
    </div>
  );
}

function CommentRow({
  comment,
  state,
  parentId,
}: {
  comment: ChoiceComment | ChoiceReply;
  parentId?: number;
  state: CommentsState;
}) {
  const pendingAction = state.pendingActions.find(
    (action) => action.id === comment.id && action.parentId === parentId,
  );
  const isPending = Boolean(pendingAction);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  return (
    <article className={styles.row}>
      <span className={styles.avatar} aria-hidden="true">
        {comment.avatar_url ? (
          <Image
            src={comment.avatar_url}
            alt=""
            width={32}
            height={32}
            unoptimized
            className={styles.image}
          />
        ) : (
          comment.author_name.slice(0, 1)
        )}
      </span>
      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.author}>{comment.author_name}</span>
          <time className={styles.time} dateTime={comment.created_at}>
            {relativeTime(comment.created_at)}
            {comment.updated_at !== comment.created_at && " · 수정됨"}
          </time>
          <div className={styles.actions}>
            {"replies" in comment && (
              <LikeButton
                compact
                isLiked={comment.is_liked}
                likeCount={comment.like_count}
                canLike={state.isLoggedIn}
                isPending={isPending}
                onToggle={() =>
                  void state.onAction({
                    action: comment.is_liked ? "unlike" : "like",
                    id: comment.id,
                  })
                }
              />
            )}
            {comment.is_mine && (
              <CommentMenu
                isDisabled={isPending}
                onEdit={() => {
                  setDraft(comment.content);
                  setIsEditing(true);
                }}
                onDelete={() => setIsDeleting(true)}
              />
            )}
          </div>
        </div>
        {isEditing ? (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                draft.trim() &&
                (await state.onAction({
                  action: "edit",
                  parentId,
                  id: comment.id,
                  content: draft.trim(),
                }))
              )
                setIsEditing(false);
            }}
          >
            <textarea
              aria-label={parentId !== undefined ? "답글 수정" : "댓글 수정"}
              className={styles.input}
              maxLength={1000}
              value={draft}
              disabled={isPending}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className={styles.editActions}>
              <Button
                variant="ghost"
                disabled={isPending}
                onClick={() => setIsEditing(false)}
              >
                취소
              </Button>
              <Button
                type="submit"
                isPending={pendingAction?.action === "edit"}
                disabled={!draft.trim()}
              >
                저장
              </Button>
            </div>
          </form>
        ) : (
          <p className={styles.content}>{comment.content}</p>
        )}
        {"replies" in comment && <Replies comment={comment} state={state} />}
      </div>
      <ConfirmDialog
        isOpen={isDeleting}
        title={
          parentId !== undefined ? "답글을 삭제할까요?" : "댓글을 삭제할까요?"
        }
        description={
          parentId !== undefined
            ? "삭제한 답글은 복구할 수 없어요."
            : "댓글과 달린 답글이 함께 삭제되며 복구할 수 없어요."
        }
        confirmLabel="삭제"
        destructive
        isPending={pendingAction?.action === "delete"}
        onClose={() => setIsDeleting(false)}
        onConfirm={() => {
          void state
            .onAction({ action: "delete", id: comment.id, parentId })
            .then((ok) => {
              if (ok) setIsDeleting(false);
            });
        }}
      />
    </article>
  );
}

function Replies({
  comment,
  state,
}: {
  comment: ChoiceComment;
  state: CommentsState;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState("");
  const isPending = state.pendingActions.some(
    (action) => action.id === comment.id && action.parentId === undefined,
  );
  const isSubmitting = state.pendingActions.some(
    (action) => action.action === "reply" && action.id === comment.id,
  );
  return (
    <div className={styles.replies}>
      <div className={styles.replyActions}>
        {comment.replies.length > 0 && (
          <button
            type="button"
            className={styles.replyToggle}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "답글 접기" : `답글 ${comment.replies.length}개 보기`}
          </button>
        )}
        <button
          type="button"
          className={styles.replyToggle}
          aria-expanded={isWriting}
          onClick={() => setIsWriting(!isWriting)}
        >
          답글 쓰기
        </button>
      </div>
      {isExpanded && (
        <div className={styles.replyList}>
          {comment.replies.map((reply) => (
            <CommentRow
              key={reply.id}
              comment={reply}
              parentId={comment.id}
              state={state}
            />
          ))}
        </div>
      )}
      {isWriting && (
        <form
          className={styles.replyComposer}
          onSubmit={async (event) => {
            event.preventDefault();
            if (
              content.trim() &&
              (await state.onAction({
                action: "reply",
                id: comment.id,
                content: content.trim(),
              }))
            ) {
              setContent("");
              setIsWriting(false);
              setIsExpanded(true);
            }
          }}
        >
          <label className={styles.replyLabel} htmlFor={`reply-${comment.id}`}>
            {comment.author_name}님에게 답글
          </label>
          <textarea
            id={`reply-${comment.id}`}
            className={styles.input}
            placeholder={
              state.isLoggedIn
                ? "상대방의 생각에 답글을 남겨보세요"
                : "로그인 후 답글을 남길 수 있어요"
            }
            rows={2}
            maxLength={1000}
            disabled={!state.isLoggedIn || isPending}
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <div className={styles.editActions}>
            <span className={styles.hint}>{content.length}/1,000</span>
            <Button
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => setIsWriting(false)}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!state.isLoggedIn || !content.trim() || isPending}
              isPending={isSubmitting}
              loadingText="등록 중"
            >
              답글 등록
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
