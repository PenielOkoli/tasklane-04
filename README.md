# Tasklane — structured plans

FlexiSAF deliverable 4: Structured Outputs and AI-Driven UI Rendering.

Live app: https://tasklane-structured.vercel.app  
Repository: https://github.com/PenielOkoli/tasklane-04

This is a new Tasklane milestone repository continuing the task board and streaming chat from [submission 3](https://github.com/PenielOkoli/tasklane-03). It adds a structured planning mode that renders validated task suggestions and checklist items. The model does not change the board.

## Evidence

- [Assessment mapping](docs/modules/04/assessment.md)
- [Implementation plan](docs/modules/04/plan.md)
- [Verification record](docs/modules/04/verification.md)
- [Zod response schema](src/lib/task-plan-schema.ts)
- [Structured plan renderer and fallback](src/components/structured-task-plan.tsx)
- [Server route](src/app/api/plan/route.ts)
- [Rendering edge-case tests](tests/structured-plan.test.tsx)
- [Architecture notes](src/app/guide/page.tsx)

## Run locally

Requires Node 22. Run `npm ci`, set the server-only `GROQ_API_KEY` in `.env.local`, then run `npm run dev`. Run `npm run check` for typecheck, rendering tests, and production build. Do not commit secrets or use `NEXT_PUBLIC_` for provider keys.

## Localization

Every localized string keeps `locale` metadata beside its `content`, using `en-NG` for this implementation. The structure can add supported locales without guessing a language from free text.
