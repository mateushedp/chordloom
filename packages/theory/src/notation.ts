/**
 * Display names for pitch classes.
 *
 * Pitch classes are internal (0-11, C=0); names only exist at the display
 * layer. Each pitch class maps to one fixed name per notation/accidental pair.
 * Context-aware enharmonic spelling is deferred to S1-3b.
 */

export type PitchClass = number;
export type Accidental = "sharp" | "flat";
export type Notation = "en" | "pt";

const NOTE_NAMES: Record<Notation, Record<Accidental, readonly string[]>> = {
	en: {
		sharp: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
		flat: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
	},
	pt: {
		sharp: ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"],
		flat: ["Dó", "Réb", "Ré", "Mib", "Mi", "Fá", "Solb", "Sol", "Láb", "Lá", "Sib", "Si"],
	},
};

export function noteName(pc: PitchClass, options: { accidental: Accidental; notation: Notation }): string {
	const index = ((pc % 12) + 12) % 12;
	return NOTE_NAMES[options.notation][options.accidental][index];
}
