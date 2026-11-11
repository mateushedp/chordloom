# Backlog and plan (lean)

Capacity: 15-20 h/week. Estimates are in hours and include learning time. If a sprint slips, use the **cut line** instead of extending the week.

## Working agreements

- One task = one branch = one pull request (even solo). Conventional commits (`feat:`, `fix:`, `test:`, `docs:`).
- You write the tests for the theory engine **before** the implementation.
- Nothing is merged unless you can explain every line.
- Keep `docs/ai-log.md`: after each task, one or two lines on what the AI did well, what it got wrong, and what you changed. It becomes README and interview material.

## AI loop for each task

1. Write the task and its acceptance criteria yourself.
2. Write the failing tests (engine) or a short checklist (UI).
3. Ask the agent in **plan mode** for an approach. Read it, push back, approve.
4. Let it implement in small steps; run the tests after each.
5. Review the diff. Ask for explanations, or rewrite it yourself.
6. Commit. Add a line to `docs/ai-log.md`.

## Before Sprint 1 (homework, about 2 h)

- [ ] Install one agent (OpenCode or Cline) with a single stable model; run it on a throwaway task.
- [ ] Write your own list of about 10 chord shapes (strings, frets, fingers). Compare with `02-data-model.md` and fix what is wrong.
- [ ] Pick a project name; create the GitHub repo.

## Sprint 1 (week 1): foundation and theory core, about 18 h

| ID | Task | h | Acceptance |
|---|---|---|---|
| S1-1 | Monorepo (workspaces), TypeScript, Vitest, ESLint/Prettier, GitHub Actions | 3 | CI green |
| S1-2 | `AGENTS.md`, agent configured, first small agent task reviewed | 2 | Task merged; ai-log entry |
| S1-3 | Pitch classes, note names, spelling by key, EN/PT notation | 3 | Spelling tests pass (sharp and flat keys) |
| S1-4 | Chord model: qualities and chord tones | 2 | Tones correct for all 12 roots |
| S1-5 | Keys and the chords of each key (major, natural minor, major V in minor) | 3 | Golden tests for all 24 keys |
| S1-6 | Shape model, seed catalog, shape-validity test | 3 | Every seed shape passes |
| S1-7 | Transposition: shape + root to voicing | 2 | `e-form-maj` at C = `[8,10,10,9,8,8]` |

## Sprint 2 (week 2): the compass and the UI, ship v0.1, about 20 h

| ID | Task | h | Acceptance |
|---|---|---|---|
| S2-1 | Key narrowing (engine) | 3 | Examples in `02-data-model.md` section 3 pass |
| S2-2 | Ordered next-chord lists + merge across possible keys | 3 | Progression fixtures show up in the first suggestions |
| S2-3 | Nearest voicing | 2 | Example in section 6 passes |
| S2-4 | `apps/web`: Next.js, Tailwind, i18n scaffolding (EN/PT-BR) | 3 | Language switch works |
| S2-5 | Chord diagram (SVG) with text alternative | 4 | Open and barre shapes render |
| S2-6 | UI: chord search, possible keys, suggestions, progression builder, notation toggle | 4 | Full flow works at mobile width |
| S2-7 | Deploy v0.1, short README | 1 | Public URL; tag `v0.1.0` |

**Cut line:** if behind, move undo, key lock and local persistence to Sprint 3. Do not cut S2-1 to S2-3: they are the product.

## Sprint 3 (week 3): API foundation, about 16 h

| ID | Task | h | Acceptance |
|---|---|---|---|
| S3-1 | Local persistence, key lock, undo (if cut from Sprint 2) | 2 | Refresh keeps the progression |
| S3-2 | `apps/api` scaffold (D-3), config, health route, error shape | 2 | `/health` works; tests run in CI |
| S3-3 | Prisma + Postgres, schema, migrations | 3 | Migrate from scratch works locally and in CI |
| S3-4 | Auth: register, login, logout, `/me`, hashing, rate limiting (D-2) | 5 | Tests: happy path, wrong password, duplicate email |
| S3-5 | Progression CRUD with Zod validation and ownership checks | 4 | A user cannot touch another user's progression (tested) |

## Sprint 4 (week 4): connect and deploy, v1.0, about 16 h

| ID | Task | h | Acceptance |
|---|---|---|---|
| S4-1 | Deploy API, env vars, CORS/cookies working across both deployments | 3 | Login works in production |
| S4-2 | Login/register UI, auth state, error and loading states | 3 | A sleeping API shows a clear message; core app still works |
| S4-3 | Save, list, open, rename, delete progressions in the UI | 4 | Round trip verified |
| S4-4 | Keep the in-progress progression on login | 2 | Login does not lose work |
| S4-5 | Accessibility pass (keyboard, labels, contrast) | 2 | Manual keyboard run-through |
| S4-6 | i18n review (EN/PT-BR) | 2 | No hard-coded strings |

## Sprint 5 (week 5): polish and portfolio, about 15 h

- Play the suggestions on a real guitar; adjust the ordered lists and the tie rule; note changes in `ai-log.md`
- Test with 3 or 4 guitarists without explaining anything; fix where they get stuck
- README: architecture diagram, run instructions, trade-offs, AI workflow section
- Screenshots and a new `ProjectRow` in the portfolio; tag `v1.0.0`

## Icebox (ordered, not committed)

1. Audio (play the chord or progression)
2. More chord types: m7, maj7, sus2, sus4, add9
3. Capo
4. More voicings per chord (partial shapes, inversions, slash chords)
5. Diminished chords; vii° in major
6. Harmonic and melodic minor, modes
7. "Why this chord" explanations
8. Features that deepen the backend (to be chosen later)
9. Alternate tunings
10. Modal interchange, then jazz harmony
