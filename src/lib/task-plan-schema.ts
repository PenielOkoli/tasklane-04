import { z } from 'zod';

export const LocalizedContentSchema = z.object({
  locale: z.string().min(2).max(20),
  content: z.string().trim().min(1).max(320),
}).strict();

const TaskSuggestionSchema = z.object({
  id: z.string().min(1).max(32),
  title: LocalizedContentSchema,
  detail: LocalizedContentSchema,
  priority: z.enum(['low', 'medium', 'high']),
}).strict();

export const TaskPlanSchema = z.object({
  locale: z.string().min(2).max(20),
  response: LocalizedContentSchema,
  planTitle: LocalizedContentSchema,
  planSummary: LocalizedContentSchema,
  suggestions: z.array(TaskSuggestionSchema).min(2).max(4),
  checklist: z.array(LocalizedContentSchema).min(2).max(5),
}).strict();

export const TaskPlanRequestSchema = z.object({
  prompt: z.string().trim().min(3).max(1200),
  locale: z.string().trim().min(2).max(20).default('en-NG'),
}).strict();

export type TaskPlan = z.infer<typeof TaskPlanSchema>;

export type TaskPlanParseResult =
  | { ok: true; data: TaskPlan }
  | { ok: false; message: string; invalidFields: string[] };

/** Re-validate provider and browser-storage data at the rendering boundary. */
export function parseTaskPlan(value: unknown): TaskPlanParseResult {
  const parsed = TaskPlanSchema.safeParse(value);
  if (parsed.success) return { ok: true, data: parsed.data };
  const invalidFields = [...new Set(parsed.error.issues.map(issue => issue.path.join('.').split('.')[0] || 'response'))];
  return {
    ok: false,
    message: 'This plan did not match Tasklane’s expected format. Your task board is unchanged.',
    invalidFields,
  };
}
