"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { detailModalStyles } from "./styles";

export function DetailModal({
  title,
  icon,
  isOpen,
  onClose,
  children,
}: {
  title: string;
  icon?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={detailModalStyles.root}>
      <button
        type="button"
        aria-label="모달 닫기"
        className={detailModalStyles.backdrop}
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={detailModalStyles.panel}
      >
        <header className={detailModalStyles.header}>
          <div className={detailModalStyles.titleGroup}>
            {icon && <span className={detailModalStyles.icon}>{icon}</span>}
            <h2 className={detailModalStyles.title}>{title}</h2>
          </div>
          <button
            type="button"
            aria-label="닫기"
            className={detailModalStyles.close}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </header>
        <div className={detailModalStyles.body}>{children}</div>
      </section>
    </div>,
    document.body,
  );
}
