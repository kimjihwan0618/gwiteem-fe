import { z } from "zod";

export const replySchema = z.object({
  id: z.number(),
  content: z.string(),
  author_name: z.string(),
  avatar_url: z.string().nullable(),
  is_mine: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});
export const commentSchema = replySchema.extend({
  like_count: z.number(),
  is_liked: z.boolean(),
  replies: z.array(replySchema),
});
export const commentPageSchema = z.object({
  items: z.array(commentSchema),
  next_cursor: z.number().nullable(),
  total_count: z.number(),
});
export const commentMutationSchema = z.object({ id: z.number() });
export type ChoiceComment = z.infer<typeof commentSchema>;
export type ChoiceReply = z.infer<typeof replySchema>;
export type CommentAction = {
  action: "create" | "reply" | "edit" | "delete" | "like" | "unlike";
  id?: number;
  parentId?: number;
  content?: string;
};
export interface CommentsState {
  items: ChoiceComment[];
  totalCount?: number;
  isLoading: boolean;
  isError: boolean;
  pendingActions: CommentAction[];
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoadMoreError: boolean;
  isLoggedIn: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
  onAction: (action: CommentAction) => Promise<boolean>;
}
