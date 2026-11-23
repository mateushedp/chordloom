# AI log

One or two lines per task: what the AI did well, what it got wrong, and what I changed.

- S1-1 (2026-11-11): planned the monorepo scaffold in plan mode, implemented after approval on `feat/monorepo-setup` — npm workspaces, strict shared tsconfig, Vitest smoke test in `packages/theory`, ESLint flat config + Prettier at the root, CI on pull requests. All checks pass locally after a clean `npm ci`.
- S1-3 (2026-11-12): implemented `noteName` in `packages/theory` from the existing tests — EN/PT names, sharp/flat tables, pitch-class normalization; contextual spelling deferred to S1-3b. Tests, lint and typecheck pass.
- S1-4 (2026-11-23): planned first; the agent initially kept `PitchClass` in `notation.ts`, but after I questioned the layering we extracted it to `src/types.ts` (one-line changes in `notation.ts` and `index.ts`). Implemented `chordTones` with a private per-quality interval table, root/quality validation and a fresh result array; added shared `isPitchClass`/`toPitchClass` helpers so validation and normalization live in `src/types.ts`; reformatted the spec test with Prettier and added VS Code format-on-save settings. 211 tests, lint, typecheck and format:check pass.
