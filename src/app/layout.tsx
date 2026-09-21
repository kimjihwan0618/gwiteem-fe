import type { Metadata } from "next";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/components/domain/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gwiteem | 오늘, 당신의 선택은?",
  description: "가볍게 선택하고 사람들의 생각을 확인하는 일상 선택 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
