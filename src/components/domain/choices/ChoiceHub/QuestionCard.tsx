import type { ChoiceQuestion } from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { Check, ChevronRight, Users } from "lucide-react";
import { categoryLabels, getQuestionOptions } from "./choice-utils";
import { QuestionByline } from "./QuestionByline";
import { choiceHubStyles } from "./styles";

interface QuestionCardProps {
  question: ChoiceQuestion;
  isTight: boolean;
  onOpen: (id: number) => void;
}

export function QuestionCard({ question, isTight, onOpen }: QuestionCardProps) {
  return (
    <button
      className={choiceHubStyles.questionCard}
      onClick={() => onOpen(question.id)}
    >
      <div className={choiceHubStyles.cardMeta}>
        <div className={choiceHubStyles.cardBadges}>
          <Badge>{categoryLabels[question.category]}</Badge>
          {isTight && !question.my_choice && (
            <span className={choiceHubStyles.tension}>많이 참여해요</span>
          )}
        </div>
        {question.my_choice && (
          <span className={choiceHubStyles.voted}>
            <Check size={14} /> 참여 완료
          </span>
        )}
      </div>
      <h3 className={choiceHubStyles.cardTitle}>{question.title}</h3>
      <QuestionByline question={question} />
      <div className={choiceHubStyles.cardOptions}>
        {getQuestionOptions(question).map(({ option, label }) => (
          <span key={option} className={choiceHubStyles.cardOption}>
            <strong className={choiceHubStyles.cardOptionKey}>{option}</strong>
            {label}
          </span>
        ))}
      </div>
      <div className={choiceHubStyles.cardFooter}>
        <span>
          <Users size={14} className={choiceHubStyles.participantIcon} />
          {question.participant_count.toLocaleString()}회 선택
        </span>
        <ChevronRight size={18} className={choiceHubStyles.arrow} />
      </div>
    </button>
  );
}
