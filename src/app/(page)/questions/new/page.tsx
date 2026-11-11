import { pageMetadata } from "@/lib/seo";
import NewQuestionPage from "./NewQuestionPage";

export const metadata = pageMetadata(
  "질문 만들기 | 귀뜸",
  "일상의 고민을 질문으로 만들고 다른 사람들의 선택과 이유를 들어보세요.",
  "/questions/new",
  false,
);

export default function Page() {
  return <NewQuestionPage />;
}
