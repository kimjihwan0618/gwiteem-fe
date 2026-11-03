import type { Metadata, Viewport } from "next";
import { pageMetadata, siteDescription, siteName, siteUrl } from "@/lib/seo";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/components/domain/auth/AuthProvider";
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  ...pageMetadata("Gwiteem | 오늘, 당신의 선택은?", siteDescription, "/"),
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  formatDetection: { telephone: false, address: false, email: false },
  category: "community",
};

export const viewport: Viewport = { themeColor: "#14376d" };

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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
