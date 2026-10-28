"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import { commentStyles as styles } from "./Comments.styles";

export function CommentMenu({
  isDisabled,
  onEdit,
  onDelete,
}: {
  isDisabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (!position) return;
    menu.current?.querySelector("button")?.focus();
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !menu.current?.contains(event.target) &&
        !trigger.current?.contains(event.target)
      )
        setPosition(null);
    };
    const close = () => setPosition(null);
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [position]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-label="내 댓글 관리"
        aria-expanded={Boolean(position)}
        className={styles.icon}
        disabled={isDisabled}
        onClick={() => {
          if (position) {
            setPosition(null);
            return;
          }
          const rect = trigger.current?.getBoundingClientRect();
          if (rect)
            setPosition({
              left: Math.max(
                8,
                Math.min(rect.right - 112, window.innerWidth - 120),
              ),
              top:
                rect.bottom + 104 > window.innerHeight
                  ? Math.max(8, rect.top - 104)
                  : rect.bottom + 4,
            });
        }}
      >
        <MoreVertical size={16} />
      </button>
      {position &&
        createPortal(
          <div
            ref={menu}
            aria-label="댓글 관리 메뉴"
            className={styles.menuPanel}
            style={position}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(event.relatedTarget) &&
                event.relatedTarget !== trigger.current
              )
                setPosition(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                setPosition(null);
                trigger.current?.focus();
              }
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const buttons = Array.from(
                  event.currentTarget.querySelectorAll("button"),
                );
                const index = buttons.findIndex(
                  (button) => button === document.activeElement,
                );
                buttons[
                  (index +
                    (event.key === "ArrowDown" ? 1 : buttons.length - 1)) %
                    buttons.length
                ]?.focus();
              }
            }}
          >
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => {
                setPosition(null);
                trigger.current?.focus();
                onEdit();
              }}
            >
              수정
            </button>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => {
                setPosition(null);
                trigger.current?.focus();
                onDelete();
              }}
            >
              삭제
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
