import { z } from "zod";

export const choiceCategorySchema = z.enum([
  "work",
  "spending",
  "relationship",
  "daily",
]);
export const choiceOptionSchema = z.enum(["A", "B"]);

export const choiceReasonSchema = z.object({
  id: z.number(),
  label: z.string(),
});

export const choiceQuestionSchema = z.object({
  id: z.number(),
  category: choiceCategorySchema,
  title: z.string(),
  option_a: z.string(),
  option_b: z.string(),
  is_daily: z.boolean(),
  participant_count: z.number(),
  my_choice: choiceOptionSchema.nullable(),
  published_at: z.string(),
});

export const choiceResultSchema = z.object({
  total_count: z.number(),
  option_a_count: z.number(),
  option_b_count: z.number(),
  option_a_percentage: z.number(),
  option_b_percentage: z.number(),
  reasons: z.array(
    choiceReasonSchema.extend({ count: z.number(), percentage: z.number() }),
  ),
});

export const choiceQuestionDetailSchema = choiceQuestionSchema.extend({
  reasons: z.array(choiceReasonSchema),
  my_reason_id: z.number().nullable(),
  result: choiceResultSchema.nullable(),
});

export const choiceQuestionsResponseSchema = z.object({
  items: z.array(choiceQuestionSchema),
});

export const choiceVoteResponseSchema = z.object({
  question: choiceQuestionDetailSchema,
});

export const myChoiceSchema = z.object({
  question: choiceQuestionSchema,
  selected_option: choiceOptionSchema,
  reason: choiceReasonSchema.nullable(),
  voted_at: z.string(),
});

export const myChoicesSchema = z.array(myChoiceSchema);
export const choiceMigrationSchema = z.object({ migrated_count: z.number() });

export type ChoiceCategory = z.infer<typeof choiceCategorySchema>;
export type ChoiceOption = z.infer<typeof choiceOptionSchema>;
export type ChoiceQuestion = z.infer<typeof choiceQuestionSchema>;
export type ChoiceQuestionDetail = z.infer<typeof choiceQuestionDetailSchema>;
export type MyChoice = z.infer<typeof myChoiceSchema>;
