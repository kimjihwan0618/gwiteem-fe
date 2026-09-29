import type { ChoiceQuestion } from "@/app/(page)/(home)/type";
import { formatQuestionDate } from "./choice-utils";
import { choiceHubStyles } from "./styles";

export function QuestionByline({ question }: { question: ChoiceQuestion }) {
  return (
    <span className={choiceHubStyles.questionByline}>
      {question.author_name} · {formatQuestionDate(question.created_at)} 등록
    </span>
  );
}
