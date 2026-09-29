import type { ChoiceQuestion } from "@/app/(page)/(home)/type";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Users } from "lucide-react";
import {
  categoryLabels,
  getQuestionOptions,
  optionTones,
} from "./choice-utils";
import { QuestionByline } from "./QuestionByline";
import { choiceHubStyles, optionLabelVariants } from "./styles";

interface FeaturedQuestionProps {
  question: ChoiceQuestion;
  onOpen: (id: number) => void;
}

export function FeaturedQuestion({ question, onOpen }: FeaturedQuestionProps) {
  return (
    <section className={choiceHubStyles.featured}>
      <div className={choiceHubStyles.featuredGlow} />
      <div className={choiceHubStyles.featuredContent}>
        <div>
          <div className={choiceHubStyles.badgeRow}>
            <Badge>오늘의 질문 · {categoryLabels[question.category]}</Badge>
            {question.my_choice && <Badge variant="success">참여 완료</Badge>}
          </div>
          <h2 className={choiceHubStyles.featuredTitle}>{question.title}</h2>
          <div className={choiceHubStyles.featuredMeta}>
            <QuestionByline question={question} />
            <span className={choiceHubStyles.participantMeta}>
              <Users size={14} />총{" "}
              {question.participant_count.toLocaleString()}회 선택
            </span>
          </div>
          <div className={choiceHubStyles.featuredOptions}>
            {getQuestionOptions(question).map(({ option, label }) => (
              <div key={option} className={choiceHubStyles.featuredOption}>
                <span
                  className={optionLabelVariants({
                    tone: optionTones[option],
                  })}
                >
                  {option}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
        <div className={choiceHubStyles.featuredAction}>
          <Button size="lg" onClick={() => onOpen(question.id)}>
            {question.my_choice ? "결과 다시 보기" : "선택하러 가기"}
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
