import { queryKeys } from "@/lib/query-keys";

export const questionQueries = {
  queryKey: queryKeys.choices.all,
  predicate: (query: { queryKey: readonly unknown[] }) =>
    ["list", "detail", "mine", "liked", "created"].includes(
      String(query.queryKey[1]),
    ),
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Traverse only question query envelopes, including infinite pages and nested records.
export function updateQuestionInCache(
  cached: unknown,
  questionId: number,
  update: (question: Record<string, unknown>) => Record<string, unknown>,
): unknown {
  if (Array.isArray(cached)) {
    return cached.map((item) =>
      updateQuestionInCache(item, questionId, update),
    );
  }
  if (!isRecord(cached)) return cached;
  if (cached.id === questionId && "participant_count" in cached)
    return update(cached);
  for (const key of ["pages", "data", "items", "question"]) {
    if (key in cached) {
      return {
        ...cached,
        [key]: updateQuestionInCache(cached[key], questionId, update),
      };
    }
  }
  return cached;
}
