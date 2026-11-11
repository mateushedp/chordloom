# Data model and engine design (lean)

Two layers: the **theory engine** (`packages/theory`, pure TypeScript) and the **persistence layer** (`apps/api`, Postgres via Prisma). Music rules live in code and are tested. The database stores only user data.

## 1. Core types

```ts
/** 0-11, C=0. All internal logic uses pitch classes; names are a display concern. */
export type PitchClass = number;

export type Mode = "major" | "minor";        // natural minor
export type Quality = "maj" | "min" | "dom7"; // more qualities later

export interface Chord { root: PitchClass; quality: Quality }
export interface Key   { tonic: PitchClass; mode: Mode }

/** Open-string pitch classes, lowest string first. Standard = E A D G B E. */
export type Tuning = readonly PitchClass[];
export const STANDARD_TUNING: Tuning = [4, 9, 2, 7, 11, 4];
```

Chord tones: `maj [0,4,7]`, `min [0,3,7]`, `dom7 [0,4,7,10]`.

### Notation is a display layer

- Letters: `C D E F G A B` or `Do Re Mi Fa Sol La Si`.
- Sharp or flat spelling follows the key: G, D, A, E, B, F# spell with sharps; F, Bb, Eb, Ab, Db, Gb with flats; minor keys follow their relative major.
- Suffixes are the same in both notations (`Am` / `Lam`, `G7` / `Sol7`).

## 2. Keys and chords in a key

A key contains these chords:

- **Major key:** I, ii, iii, IV, V, vi (the diminished vii° joins when diminished chords are added). V also exists as dom7.
- **Minor key (natural):** i, III, iv, v, VI, VII, plus a **major V** and its dom7 (borrowed from harmonic minor), because the major V is extremely common in practice (e.g. Am with E or E7).

## 3. Key narrowing (the compass)

Given a progression, **a key is possible if every chord belongs to it.** Collect all 24 keys that pass.

- One chord: about 7 keys. A single C major chord fits C major, G major, F major, A minor, E minor, D minor, and F minor (as V).
- C then G: C major, G major, A minor, E minor.
- C, G, F: C major and A minor.
- If no key contains every chord (an out-of-key chord was added), show the keys that contain the **most** chords and say that something is outside.

No scoring needed. It is a filter. Relative pairs (C major / A minor) are displayed together.

## 4. Suggestions

For each degree, an **ordered list** of what usually comes next, written from harmonic function (movement away from and back to the tonic). Only the order matters; there are no numbers.

**Major key**

| From | Next, in order |
|---|---|
| I | IV, V, vi, ii, iii |
| ii | V, IV, I |
| iii | vi, IV, ii, I |
| IV | V, I, ii, vi |
| V | I, vi, IV |
| vi | IV, V, ii, I, iii |

**Minor key**

| From | Next, in order |
|---|---|
| i | VII, VI, iv, V, III, v |
| III | VII, VI, iv, i |
| iv | i, V, VII, VI |
| v | i, VI |
| V | i, VI |
| VI | VII, III, V, iv, i |
| VII | III, i, VI |

These are a starting point. Review them with your ear and change anything that sounds wrong.

**Merging across possible keys.** The current chord has a position in each possible key. Take each key's next-chord list and merge them: a chord that appears early in a list ranks higher; if two chords tie, the one offered by more keys ranks higher. Show the first 2-3, with "see more" for the rest. When V is suggested, offer its 7 version as an alternative.

**Test fixtures** (each step should appear among the first suggestions of the previous chord): I-V-vi-IV, I-IV-V, I-vi-IV-V, vi-IV-I-V, ii-V-I; in minor: i-VI-III-VII, i-VII-VI-V, i-iv-V.

## 5. Shapes and voicings

String order is always **low to high** (index 0 = 6th string).

```ts
export interface Shape {
  slug: string;                    // e.g. "open-c-maj", "e-form-min"
  quality: Quality;
  movable: boolean;                // false = open shape, frets absolute
  rootString: number;              // string index carrying the root
  frets: (number | null)[];        // null = muted; movable: relative to baseFret
  fingers: (number | null)[];      // 0 = open, 1-4 = finger, null = muted
  barre?: { fromString: number; toString: number };
}

export interface Voicing {         // a shape placed on the neck
  shapeSlug: string;
  chord: Chord;
  frets: (number | null)[];        // absolute
  fingers: (number | null)[];
  hasBarre: boolean;
}
```

### Transposition

```
baseFret = (root - tuning[shape.rootString]) mod 12
absoluteFret[i] = baseFret + shape.frets[i]       (null stays null)
```

Movable shapes are generated only for `baseFret >= 1` (0 is the open shape). Example: E-form major at C gives `[8,10,10,9,8,8]`.

### Seed shapes (verify every one on your guitar)

You are the domain expert. Play each, fix what is wrong. The automated test also catches wrong notes.

| slug | quality | movable | rootString | frets | fingers |
|---|---|---|---|---|---|
| open-c-maj | maj | no | 1 | `[null,3,2,0,1,0]` | `[null,3,2,0,1,0]` |
| open-a-maj | maj | no | 1 | `[null,0,2,2,2,0]` | `[null,0,1,2,3,0]` |
| open-g-maj | maj | no | 0 | `[3,2,0,0,0,3]` | `[2,1,0,0,0,3]` |
| open-e-maj | maj | no | 0 | `[0,2,2,1,0,0]` | `[0,2,3,1,0,0]` |
| open-d-maj | maj | no | 2 | `[null,null,0,2,3,2]` | `[null,null,0,1,3,2]` |
| open-a-min | min | no | 1 | `[null,0,2,2,1,0]` | `[null,0,2,3,1,0]` |
| open-e-min | min | no | 0 | `[0,2,2,0,0,0]` | `[0,2,3,0,0,0]` |
| open-d-min | min | no | 2 | `[null,null,0,2,3,1]` | `[null,null,0,2,3,1]` |
| open-e-dom7 | dom7 | no | 0 | `[0,2,0,1,0,0]` | `[0,2,0,1,0,0]` |
| open-a-dom7 | dom7 | no | 1 | `[null,0,2,0,2,0]` | `[null,0,2,0,3,0]` |
| open-d-dom7 | dom7 | no | 2 | `[null,null,0,2,1,2]` | `[null,null,0,2,1,3]` |
| open-g-dom7 | dom7 | no | 0 | `[3,2,0,0,0,1]` | `[3,2,0,0,0,1]` |
| open-c-dom7 | dom7 | no | 1 | `[null,3,2,3,1,0]` | `[null,3,2,4,1,0]` |
| e-form-maj | maj | yes | 0 | `[0,2,2,1,0,0]` | `[1,3,4,2,1,1]` + barre 0-5 |
| e-form-min | min | yes | 0 | `[0,2,2,0,0,0]` | `[1,3,4,1,1,1]` + barre 0-5 |
| e-form-dom7 | dom7 | yes | 0 | `[0,2,0,1,0,0]` | `[1,3,1,2,1,1]` + barre 0-5 |
| a-form-maj | maj | yes | 1 | `[null,0,2,2,2,0]` | `[null,1,2,3,4,1]` + barre 1-5 |
| a-form-min | min | yes | 1 | `[null,0,2,2,1,0]` | `[null,1,3,4,2,1]` + barre 1-5 |
| a-form-dom7 | dom7 | yes | 1 | `[null,0,2,0,2,0]` | `[null,1,3,1,4,1]` + barre 1-5 |

## 6. Nearest voicing (no formula)

A voicing's **position** is its lowest fretted fret (ignoring open strings; 0 if none).

To suggest a chord, take all its voicings and pick the one whose position is **closest to the current voicing's position**. Examples:

- Current: C with barre at the 3rd fret (position 3). Candidates for Am: open (position 1, distance 2), E-form at the 5th (distance 2), A-form at the 12th (distance 9). The far one is never chosen.
- Tie rule (starting point): prefer a voicing of the same kind (barre to barre, open to open); otherwise follow catalog order. The user can cycle to others with a click.

Revisit this rule by playing it; change it only if it feels wrong in your hands.

## 7. Test strategy for the engine

1. **Shape validity (generated):** for every shape and root, each sounded string's pitch class belongs to the chord, and the lowest sounded string is the root. This checks your handwritten fingerings.
2. **Transposition:** `e-form-maj` at C = `[8,10,10,9,8,8]`.
3. **Chords of each key:** golden tests for all 24 keys (you write them from a reference you trust).
4. **Notation:** F# major vs. Gb major; PT and EN names.
5. **Key narrowing:** the examples in section 3.
6. **Nearest voicing:** the example in section 6.
7. **Suggestion fixtures:** the progressions in section 4.

## 8. Persistence (v1.0)

The shape catalog stays in code. The database references shapes by `shapeSlug`, so changing the catalog never needs a data migration.

```prisma
model User {
  id           String        @id @default(cuid())
  email        String        @unique
  passwordHash String
  createdAt    DateTime      @default(now())
  progressions Progression[]
}

model Progression {
  id        String             @id @default(cuid())
  title     String
  userId    String
  user      User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  chords    ProgressionChord[]
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt

  @@index([userId])
}

model ProgressionChord {
  id            String      @id @default(cuid())
  progressionId String
  progression   Progression @relation(fields: [progressionId], references: [id], onDelete: Cascade)
  position      Int
  root          Int         // pitch class
  quality       String      // validated by a Zod schema exported from packages/theory
  shapeSlug     String?     // chosen voicing, optional
  baseFret      Int?

  @@unique([progressionId, position])
}
```

### API sketch

| Method | Route | Notes |
|---|---|---|
| POST | /auth/register | validate, hash, create |
| POST | /auth/login | sets httpOnly cookie |
| POST | /auth/logout | clears cookie |
| GET | /me | current user |
| GET | /progressions | own only |
| POST | /progressions | |
| GET | /progressions/:id | ownership check |
| PUT | /progressions/:id | replaces title + chords in one transaction |
| DELETE | /progressions/:id | |
| GET | /health | monitoring |

Every route: input validation, consistent error shape, ownership checks, integration tests.
