import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "비밀번호 재설정 | 귀뜸",
  "귀뜸 계정의 비밀번호를 재설정합니다.",
  "/password-reset",
  false,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
