import { z } from "zod";

const unique = (values: string[]) =>
  new Set(values.map((value) => value.toLowerCase())).size === values.length;
export const createQuestionSchema = z
  .object({
    category: z.string().trim().min(1, "카테고리를 선택해 주세요."),
    title: z
      .string()
      .trim()
      .min(2, "질문을 2자 이상 입력해 주세요.")
      .max(200, "질문은 200자까지 입력할 수 있어요."),
    options: z
      .array(
        z
          .string()
          .trim()
          .min(1, "선택지를 입력해 주세요.")
          .max(100, "선택지는 100자까지 입력할 수 있어요."),
      )
      .min(2)
      .max(4)
      .refine(unique, "선택지는 서로 다르게 입력해 주세요."),
    reasons: z
      .array(
        z
          .string()
          .trim()
          .min(1, "선택 이유를 입력해 주세요.")
          .max(120, "선택 이유는 120자까지 입력할 수 있어요."),
      )
      .min(2)
      .max(6)
      .refine(unique, "선택 이유는 서로 다르게 입력해 주세요."),
  })
  .strict();
export type CreateQuestionRequest = z.infer<typeof createQuestionSchema>;
