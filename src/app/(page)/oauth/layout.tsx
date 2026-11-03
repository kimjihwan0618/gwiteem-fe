import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "로그인 연결 | Gwiteem",
  "Gwiteem 로그인 연결을 처리합니다.",
  "/oauth",
  false,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
