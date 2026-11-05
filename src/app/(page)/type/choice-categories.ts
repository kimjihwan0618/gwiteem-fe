import { z } from "zod";

export const choiceCategoriesSchema = z.array(
  z.object({
    code: z.string().min(1),
    label: z.string().min(1),
    enabled: z.boolean(),
  }),
);
export type ChoiceCategoryItem = z.infer<typeof choiceCategoriesSchema>[number];
