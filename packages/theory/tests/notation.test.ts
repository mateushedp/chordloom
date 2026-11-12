import { describe, it, expect } from "vitest";
import { noteName } from "../src/notation";

// noteName(pc: PitchClass, options: { accidental: "sharp" | "flat"; notation: "en" | "pt" }): string

const SHARP_EN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const FLAT_EN = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

const SHARP_PT = ["Dó", "Dó#", "Ré", "Ré#", "Mi", "Fá", "Fá#", "Sol", "Sol#", "Lá", "Lá#", "Si"];

const FLAT_PT = ["Dó", "Réb", "Ré", "Mib", "Mi", "Fá", "Solb", "Sol", "Láb", "Lá", "Sib", "Si"];

describe("noteName, English with sharps", () => {
	it.each(SHARP_EN.map((name, pc) => [pc, name] as const))("pitch class %i is %s", (pc, expected) => {
		expect(noteName(pc, { accidental: "sharp", notation: "en" })).toBe(expected);
	});
});

describe("noteName, English with flats", () => {
	it.each(FLAT_EN.map((name, pc) => [pc, name] as const))("pitch class %i is %s", (pc, expected) => {
		expect(noteName(pc, { accidental: "flat", notation: "en" })).toBe(expected);
	});
});

describe("noteName, Portuguese with sharps", () => {
	it.each(SHARP_PT.map((name, pc) => [pc, name] as const))("pitch class %i is %s", (pc, expected) => {
		expect(noteName(pc, { accidental: "sharp", notation: "pt" })).toBe(expected);
	});
});

describe("noteName, Portuguese with flats", () => {
	it.each(FLAT_PT.map((name, pc) => [pc, name] as const))("pitch class %i is %s", (pc, expected) => {
		expect(noteName(pc, { accidental: "flat", notation: "pt" })).toBe(expected);
	});
});

it("wraps pitch classes around the 12-note circle", () => {
	expect(noteName(12, { accidental: "sharp", notation: "en" })).toBe("C");
	expect(noteName(13, { accidental: "sharp", notation: "en" })).toBe("C#");
	expect(noteName(-1, { accidental: "sharp", notation: "en" })).toBe("B");
	expect(noteName(-12, { accidental: "sharp", notation: "en" })).toBe("C");
});

it("normalizes pitch classes beyond one octave", () => {
	expect(noteName(-25, { accidental: "sharp", notation: "en" })).toBe("B");
	expect(noteName(25, { accidental: "sharp", notation: "en" })).toBe("C#");

	expect(noteName(13, { accidental: "flat", notation: "pt" })).toBe("Réb");
	expect(noteName(-1, { accidental: "flat", notation: "pt" })).toBe("Si");
});
