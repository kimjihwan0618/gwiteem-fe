import type {
  ChoiceCategory,
  ChoiceOption,
  ChoiceQuestion,
} from "@/app/(page)/(home)/type";

export const categories: Array<{
  value: ChoiceCategory | "all";
  label: string;
}> = [
  { value: "all", label: "전체" },
  { value: "work", label: "직장" },
  { value: "spending", label: "소비" },
  { value: "relationship", label: "관계" },
  { value: "daily", label: "일상" },
];

export const categoryLabels: Record<ChoiceCategory, string> = {
  work: "직장",
  spending: "소비",
  relationship: "관계",
  daily: "일상",
};

export const optionTones = {
  A: "a",
  B: "b",
  C: "c",
  D: "d",
} as const;

export function getQuestionOptions(question: ChoiceQuestion) {
  return [
    { option: "A" as const, label: question.option_a },
    { option: "B" as const, label: question.option_b },
    { option: "C" as const, label: question.option_c },
    { option: "D" as const, label: question.option_d },
  ].filter(
    (item): item is { option: ChoiceOption; label: string } =>
      item.label !== null,
  );
}

export function getSelectedOptionLabel(
  question: ChoiceQuestion,
  selectedOption: ChoiceOption,
) {
  return getQuestionOptions(question).find(
    ({ option }) => option === selectedOption,
  )?.label;
}

export function formatQuestionDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));
}
