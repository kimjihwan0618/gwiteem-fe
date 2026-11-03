import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "로그인 | Gwiteem",
  "Gwiteem에 로그인하고 내 선택과 좋아요한 질문을 모아보세요. 직장·소비·관계·일상의 고민에 참여하고 댓글로 생각을 나눠보세요.",
  "/login",
  true,
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
