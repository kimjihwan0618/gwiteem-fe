import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { pageMetadata, siteDescription, siteName, siteUrl } from "@/lib/seo";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/components/domain/auth/AuthProvider";
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  ...pageMetadata("귀뜸 | 오늘, 당신의 선택은?", siteDescription, "/"),
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  formatDetection: { telephone: false, address: false, email: false },
  category: "community",
};

export const viewport: Viewport = { themeColor: "#f6f2e9" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
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
