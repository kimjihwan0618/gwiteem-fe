"use client";

import type {
  ChoiceOption,
  ChoiceQuestionDetail,
} from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { LogIn, Share2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  categoryLabels,
  getQuestionOptions,
  optionTones,
} from "./choice-utils";
import { ResultView } from "./ResultView";
import {
  choiceHubStyles,
  optionButtonVariants,
  optionLabelVariants,
} from "./styles";

interface QuestionDialogProps {
  detail?: ChoiceQuestionDetail;
  isLoading: boolean;
  isError: boolean;
  isVoting: boolean;
  isLoggedIn: boolean;
  onClose: () => void;
  onVote: (id: number, option: ChoiceOption, reasonId: number) => void;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("클립보드 복사에 실패했습니다.");
}

export function QuestionDialog({
  detail,
  isLoading,
  isError,
  isVoting,
  isLoggedIn,
  onClose,
  onVote,
}: QuestionDialogProps) {
  const [selectedOption, setSelectedOption] = useState<ChoiceOption | null>(
    detail?.my_choice ?? null,
  );
  const [reasonId, setReasonId] = useState<number | null>(
    detail?.my_reason_id ?? null,
  );
  const [isEditing, setIsEditing] = useState(!detail?.result);
  const toast = useToast();

  async function shareQuestion() {
    if (!detail) return;
    const optionText = getQuestionOptions(detail)
      .map(({ option, label }) => `${option}. ${label}`)
      .join("\n");
    const text = `${detail.title}\n${optionText}`;
    const url = `${window.location.origin}/?question=${detail.id}`;
    const shareData: ShareData = { title: "Gwiteem 질문", text, url };
    const canUseSystemShare =
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" ||
        navigator.canShare(shareData));

    try {
      if (canUseSystemShare) {
        await navigator.share(shareData);
        return;
      }
      await copyText(url);
      toast.success("질문 링크를 복사했습니다.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("질문 링크를 공유하지 못했습니다.");
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
          <div className={choiceHubStyles.modalHeaderActions}>
            {detail && !isError && (
              <button
                type="button"
                aria-label="질문 공유하기"
                title="질문 공유하기"
                className={choiceHubStyles.shareIconButton}
                onClick={() => void shareQuestion()}
              >
                <Share2 size={18} />
              </button>
            )}
            <button
              aria-label="닫기"
              className={choiceHubStyles.closeButton}
              onClick={onClose}
            >
              <X size={21} />
            </button>
          </div>
        </header>
        {isError ? (
          <div className={choiceHubStyles.modalBody}>
            <div className={choiceHubStyles.state}>
              <div>
                <p className={choiceHubStyles.stateTitle}>
                  질문을 불러오지 못했어요.
                </p>
                <p className={choiceHubStyles.stateDescription}>
                  삭제되었거나 올바르지 않은 질문 링크입니다.
                </p>
                <Button
                  className={choiceHubStyles.retryButton}
                  onClick={onClose}
                >
                  질문 목록으로 돌아가기
                </Button>
              </div>
            </div>
          </div>
        ) : isLoading || !detail ? (
          <div className={choiceHubStyles.modalBody}>
            <Skeleton className={choiceHubStyles.modalSkeletonBadge} />
            <Skeleton className={choiceHubStyles.modalSkeletonTitle} />
            <Skeleton className={choiceHubStyles.modalSkeletonOptions} />
          </div>
        ) : (
          <div className={choiceHubStyles.modalBody}>
            <Badge>{categoryLabels[detail.category]}</Badge>
            <h2 className={choiceHubStyles.modalQuestion}>{detail.title}</h2>
            {detail.result && !isEditing ? (
              <ResultView detail={detail} />
            ) : (
              <>
                <div className={choiceHubStyles.optionGrid}>
                  {getQuestionOptions(detail).map(({ option, label }) => (
                    <button
                      key={option}
                      className={optionButtonVariants({
                        tone: optionTones[option],
                        selected: selectedOption === option,
                      })}
                      onClick={() => setSelectedOption(option)}
                    >
                      <span
                        className={optionLabelVariants({
                          tone: optionTones[option],
                        })}
                      >
                        {option}
                      </span>
                      <span className={choiceHubStyles.optionText}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedOption && (
                  <div className={choiceHubStyles.reasonPanel}>
                    <label
                      htmlFor="choice-reason"
                      className={choiceHubStyles.reasonLabel}
                    >
                      왜 이 선택을 했나요?{" "}
                      <span className={choiceHubStyles.requiredLabel}>
                        (필수)
                      </span>
                    </label>
                    <select
                      id="choice-reason"
                      required
                      aria-required="true"
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
                        onClick={() => {
                          if (!reasonId) {
                            toast.error("선택한 이유를 골라주세요.");
                            return;
                          }
                          onVote(detail.id, selectedOption, reasonId);
                        }}
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
                {!isLoggedIn && (
                  <div className={choiceHubStyles.resultActions}>
                    <Link href="/login" className={buttonVariants()}>
                      <LogIn size={17} /> 로그인하고 선택 저장
                    </Link>
                  </div>
                )}
                <div className={choiceHubStyles.submitRow}>
                  <Button variant="ghost" onClick={() => setIsEditing(true)}>
                    선택 바꾸기
                  </Button>
                  <Button variant="secondary" onClick={onClose}>
                    다른 질문 보기
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
