"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { confirmDialogStyles } from "./styles";

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "취소",
  isPending = false,
  destructive = false,
  onConfirm,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, isPending, onClose]);

  if (!isOpen) return null;
  return createPortal(
    <div className={confirmDialogStyles.root}>
      <button
        type="button"
        className={confirmDialogStyles.backdrop}
        aria-label="확인창 닫기"
        disabled={isPending}
        onClick={onClose}
      />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className={confirmDialogStyles.panel}
      >
        {destructive && (
          <span className={confirmDialogStyles.icon} aria-hidden="true">
            <AlertTriangle size={21} />
          </span>
        )}
        <h2
          id="confirm-dialog-title"
          className={
            destructive
              ? confirmDialogStyles.titleWithIcon
              : confirmDialogStyles.title
          }
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-description"
          className={confirmDialogStyles.description}
        >
          {description}
        </p>
        <div className={confirmDialogStyles.actions}>
          <Button variant="secondary" disabled={isPending} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            isPending={isPending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
