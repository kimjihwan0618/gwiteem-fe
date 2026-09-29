"use client";

import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { toastIconVariants, toastStyles, toastVariants } from "./styles";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type: ToastType };
type ToastContextValue = {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const remove = useCallback(
    (id: number) =>
      setToasts((current) => current.filter((toast) => toast.id !== id)),
    [],
  );
  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => remove(id), 3200);
    },
    [remove],
  );
  const value = useMemo(
    () => ({
      show,
      success: (message: string) => show(message, "success"),
      error: (message: string) => show(message, "error"),
      info: (message: string) => show(message, "info"),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={toastStyles.viewport} aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => remove(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = { success: CheckCircle2, error: CircleAlert, info: Info };
  const Icon = icons[toast.type];
  return (
    <div className={toastVariants({ type: toast.type })}>
      <Icon size={20} className={toastIconVariants({ type: toast.type })} />
      <p className={toastStyles.message}>{toast.message}</p>
      <button
        aria-label="메시지 닫기"
        onClick={onClose}
        className={toastStyles.closeButton}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
