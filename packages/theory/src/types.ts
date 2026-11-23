/** 0-11, C=0. All internal logic uses pitch classes; names are a display concern. */
export type PitchClass = number;

/** Returns true when value is a canonical pitch class (integer 0-11). */
export function isPitchClass(value: number): value is PitchClass {
	return Number.isInteger(value) && value >= 0 && value <= 11;
}

/** Wraps any integer into the canonical 0-11 range for display. */
export function toPitchClass(value: number): PitchClass {
	return ((value % 12) + 12) % 12;
}
