import type { ChoiceQuestionDetail } from "@/app/(page)/(home)/type";
import { Users } from "lucide-react";
import { optionTones } from "./choice-utils";
import { choiceHubStyles, resultSegmentVariants } from "./styles";

export function ResultView({ detail }: { detail: ChoiceQuestionDetail }) {
  if (!detail.result) return null;
  const result = detail.result;

  return (
    <section>
      <div className={choiceHubStyles.resultHeader}>
        <h3 className={choiceHubStyles.resultHeading}>
          사람들은 이렇게 선택했어요
        </h3>
        <span className={choiceHubStyles.resultCount}>
          <Users size={14} />총 {result.total_count.toLocaleString()}회 선택
        </span>
      </div>
      <div className={choiceHubStyles.resultBar}>
        {result.options.map((option) => (
          <div
            key={option.option}
            className={resultSegmentVariants({
              tone: optionTones[option.option],
            })}
            style={{ width: `${option.percentage}%` }}
            title={`${option.label} ${option.percentage}%`}
          >
            {option.percentage >= 10 ? `${option.percentage}%` : ""}
          </div>
        ))}
      </div>
      <div className={choiceHubStyles.resultLabels}>
        {result.options.map((option) => (
          <span key={option.option}>
            {option.option} · {option.label} ({option.percentage}%)
          </span>
        ))}
      </div>
      <div className={choiceHubStyles.reasonResults}>
        {result.reasons.map((reason) => (
          <div key={reason.id} className={choiceHubStyles.reasonResult}>
            <div>
              <p className={choiceHubStyles.reasonText}>{reason.label}</p>
              <div className={choiceHubStyles.reasonTrack}>
                <div
                  className={choiceHubStyles.reasonFill}
                  style={{ width: `${reason.percentage}%` }}
                />
              </div>
            </div>
            <span className={choiceHubStyles.reasonPercent}>
              {reason.percentage}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
