# AGENTS.md

Context and rules for AI coding agents working in this repository. Read this first, and read `docs/` before proposing designs.

## Project

ChordLoom (working title): **a key compass for guitarists who want to compose.** The user picks a chord; the app lists the keys it could belong to and suggests 2-3 next chords in the voicing closest to the user's hand. Each chord added narrows the possible keys. See `docs/01-requirements.md`, `docs/02-data-model.md`, `docs/03-backlog.md`.

The owner is a developer who is **learning** with this project and wants to stay in control of the code. This is not a "generate everything" project.

## Layout

```
apps/web         Next.js + TypeScript + Tailwind (UI)
apps/api         Node API in TypeScript, Postgres via Prisma (added in Sprint 3)
packages/theory  Pure TypeScript music-theory engine (no DOM, no DB, no framework)
docs/            Requirements, data model, backlog, ai-log
```

npm/pnpm workspaces. Shared types and Zod schemas live in `packages/theory`.

## Commands

Fill these in as the tooling is set up (task S1-1):

```
install:    <to be filled>
test:       <to be filled>   # Vitest
lint:       <to be filled>
typecheck:  <to be filled>
dev (web):  <to be filled>
```

Always run test, lint and typecheck before saying a task is done.

## How to work with me

1. **Plan before editing.** For anything beyond a trivial change, describe your approach and the files you will touch, then wait for my approval.
2. **Small steps.** One task from `docs/03-backlog.md` at a time; small diffs I can review in minutes.
3. **Tests first for the theory engine.** I write the tests. Never edit or weaken a test to make it pass; if you think a test is wrong, tell me why and let me decide.
4. **Explain.** After changing code, summarize what changed and why in plain language. If I ask "why", explain; do not just rewrite.
5. **Ask before adding dependencies.**
6. **No scope creep.** Do not implement icebox items or refactor unrelated code. Mention opportunities instead.
7. **Say when unsure.** Do not invent music-theory facts. If a rule is ambiguous, ask me; I validate on a real guitar.

## Domain rules (do not violate)

- Internal notes are **pitch classes 0-11** (C=0). Names (C/Do, sharps/flats) exist only in the display layer.
- String arrays are always **low to high** (index 0 = 6th string).
- **Tuning is a parameter**, never a hard-coded constant inside logic.
- A key is possible for a progression only if **every chord belongs to it** (filter, not scoring). Relative major/minor pairs are shown together.
- Suggestions come from **ordered lists** per degree; do not introduce numeric weights or scoring formulas.
- The suggested voicing is the one whose **position** (lowest fretted fret) is closest to the current voicing.
- Music rules live in `packages/theory` as pure functions. The UI and API import them; they never reimplement them.
- The shape catalog lives in code and is referenced by `shapeSlug`; the database never stores fingerings.
- No user-visible string hard-coded in components; use the i18n files (EN and PT-BR).

## Code conventions

- TypeScript strict mode; avoid `any`.
- Validate all external input with Zod at the API boundary.
- Conventional commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).
- Docs, code and comments in English.

## Definition of done for a task

- Acceptance criteria in `docs/03-backlog.md` met
- Tests, lint and typecheck pass
- I have reviewed the diff and can explain it
- A line was added to `docs/ai-log.md`
