import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "회원가입 | 귀뜸",
  "귀뜸 계정을 만들고 일상의 선택을 함께 나눠보세요.",
  "/register",
  false,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
