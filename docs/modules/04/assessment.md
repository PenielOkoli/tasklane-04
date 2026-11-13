# Deliverable 4 assessment mapping

| Requirement | Evidence |
|---|---|
| Define a structured response schema | `src/lib/task-plan-schema.ts` (strict Zod response and request schemas) |
| Separate natural language from machine-readable UI data | `response.content` and separate `planTitle`, `planSummary`, `suggestions`, and `checklist` fields |
| Render typed components | `src/components/structured-task-plan.tsx` renders suggested task cards, priority labels, and a checklist |
| Handle invalid, partial, missing, and unexpected fields | `parseTaskPlan()` safe parsing and retryable `PlanFallback`; server revalidates model output |
| Provide a visible schema-failure fallback | `PlanFallback` states the board is unchanged and offers retry |
| Add edge-case tests | `tests/structured-plan.test.tsx` covers schema validation, valid component rendering, fallback rendering, and locale metadata |
| Carry language and locale separately | `LocalizedContentSchema` stores `{ locale, content }`; current generation uses `en-NG` |
| Continue Tasklane without executing model suggestions | Plan cards are previews; no plan endpoint or component mutates board tasks |

## Reviewer walkthrough

Open `/copilot`, choose **Structured plan**, and submit a short request. Review the separate note, suggested tasks, priorities, checklist, and `en-NG` metadata. In the test suite, remove a required field or add an unexpected property to confirm the component replaces the card UI with its safe fallback.
