# Tasklane — deliverable 4 plan

## Acceptance criteria

- Continue the Tasklane board and streaming chat from submission 3 in a new repository and Vercel project.
- Define a strict Zod schema for a natural-language note, task suggestions, priorities, and a checklist.
- Return machine-readable planning data separately from ordinary conversational text.
- Render valid model output into typed suggestion cards and checklist UI.
- Validate output again at the server boundary and immediately before rendering.
- Show a visible retryable fallback for invalid, incomplete, missing, or unexpected fields.
- Carry locale metadata beside each localized content value, with English (en-NG) implemented now.
- Add rendering and schema edge-case tests.
- Keep suggestions as previews and preserve the task board unless a later milestone implements an approved action flow.

## Boundaries

Structured plans do not write to task state. Chat remains streamed free text on `/api/chat`; typed planning uses `/api/plan` and returns a schema-validated JSON object. Provider credentials stay server-side. Browser history is untrusted and validated at the rendering boundary.
