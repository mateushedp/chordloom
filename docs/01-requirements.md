# Requirements: ChordLoom (working title)

Docs and code in English. UI in EN and PT-BR. Lean version: read it in five minutes.

## 1. What it is

**A key compass for guitarists who want to compose.**

You pick a chord. The app shows which keys it could belong to and suggests 2-3 chords to play next, in the shape closest to your hand. Each chord you add narrows the list of possible keys.

## 2. Who it's for

An intermediate guitar or violão player: knows a handful of open chords and some barre shapes, plays by shape and ear, has little theory, and wants to write songs in a practical way. Not a teaching tool (yet).

## 3. The flow

1. Search and pick a first chord (e.g. C). The app lists the keys it fits.
2. The app suggests 2-3 next chords from those keys, each shown in the nearest voicing (see "see more" for others).
3. Click one. It joins the progression. The list of possible keys shrinks (C then G leaves C major, G major, A minor, E minor).
4. Repeat. When few keys remain, suggestions get more precise.
5. Relative major/minor pairs (C major / A minor) always stay together: they share the same chords, and the user decides which one sounds like "home".

## 4. Scope

| Version | Contents |
|---|---|
| v0.1 (no backend) | Everything in section 5 except accounts |
| v1.0 | Accounts, save/load progressions, API + database, deployed |
| Later | Icebox in `03-backlog.md` (audio, more chord types, capo, explanations...) |

**Out of scope for now:** audio, jazz harmony, alternate tunings, teaching mode, sharing links, tab export, circle-of-fifths drawing, color coding.

## 5. Functional requirements

| ID | Requirement | Ver |
|---|---|---|
| FR-01 | Search and select any chord by root + quality (major, minor, 7) | 0.1 |
| FR-02 | Show an SVG chord diagram for the chosen voicing; cycle through other voicings | 0.1 |
| FR-03 | Show the possible keys for the progression so far; updates as chords change | 0.1 |
| FR-04 | Suggest 2-3 next chords from the possible keys, with a "see more" option | 0.1 |
| FR-05 | Show each suggestion in the voicing closest to the current one | 0.1 |
| FR-06 | Clicking a suggestion adds it; keys and suggestions update | 0.1 |
| FR-07 | Any chord can be added by search. If it fits no key together with the rest, say so and show the keys that fit the most chords | 0.1 |
| FR-08 | Remove a chord, clear all, undo | 0.1 |
| FR-09 | Optionally lock a key manually | 0.1 (should) |
| FR-10 | Toggle notation between C D E and Do Re Mi; remembered | 0.1 |
| FR-11 | UI in EN and PT-BR; all strings externalized | 0.1 |
| FR-12 | Progression survives a refresh (local storage) | 0.1 (should) |
| FR-13 | Register, log in, log out | 1.0 |
| FR-14 | Save a progression with a title; list, open, rename, delete own progressions; the in-progress progression is kept on login | 1.0 |

## 6. Non-functional requirements

- **Offline core:** suggestions and key narrowing run in the browser; no network needed.
- **Pure engine:** `packages/theory` is plain TypeScript, no DOM/DB/framework.
- **Tests:** engine covered by tests written by the author first; API with integration tests.
- **Mobile and accessibility:** mobile-first; keyboard-navigable search; diagrams have text alternatives.
- **i18n:** no hard-coded user-visible strings.
- **Security (v1.0):** password hashing, input validation, rate limiting on auth, httpOnly cookies, no secrets in the repo.
- **Resilience:** if the API is slow or asleep, the core app still works.
- **CI:** lint, typecheck and tests on every pull request.
- **Docs:** README with architecture diagram, how to run, and an "AI workflow" section.

## 7. Definition of done for v0.1

- Picking a chord, then a few suggestions, works and feels right on a real guitar for at least C, G, D, A, E, Am, Em, Dm.
- Key narrowing is correct on the examples in `02-data-model.md`.
- All seed shapes pass the automated "notes belong to the chord" test.
- Notation toggle and language switch work everywhere.
- Deployed, linked from the portfolio, README written.

## 8. Open decisions (decide when you get there)

| ID | Decision |
|---|---|
| D-1 | Project name |
| D-2 | Login strategy (cookie session vs. JWT). Different domains for web and API make cookies tricky |
| D-3 | API framework (Fastify or Express) |
| D-4 | API hosting (check current free-tier limits and cold starts) |
| D-5 | Chord diagrams: custom SVG or a library |
| D-6 | Visual design: reuse the portfolio look or design separately |
