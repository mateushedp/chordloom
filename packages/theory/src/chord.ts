import type { PitchClass } from "./types";

/** The chord qualities supported by the engine. More qualities will be added later. */
export type Quality = "maj" | "min" | "dom7";

/** A chord is a root pitch class plus a quality. */
export interface Chord {
	root: PitchClass;
	quality: Quality;
}

/** Semitone offsets from the root, in root position. Kept private so callers cannot mutate it. */
const QUALITY_INTERVALS: Record<Quality, readonly PitchClass[]> = {
	maj: [0, 4, 7],
	min: [0, 3, 7],
	dom7: [0, 4, 7, 10],
};

/** Returns the chord tones in root position, normalized to pitch classes 0-11. */
export function chordTones(chord: Chord): PitchClass[] {
	const { root, quality } = chord;

	if (!Number.isInteger(root) || root < 0 || root > 11) {
		throw new RangeError(`Invalid root pitch class: ${String(root)}`);
	}

	const intervals = QUALITY_INTERVALS[quality];
	if (!intervals) {
		throw new Error(`Unknown chord quality: ${String(quality)}`);
	}

	return intervals.map((interval) => (root + interval) % 12);
}
