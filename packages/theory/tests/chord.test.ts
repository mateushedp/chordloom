import { describe, it, expect } from "vitest";
import { chordTones } from "../src/chord";

const MAJOR: [number, number[]][] = [
	[0, [0, 4, 7]],
	[1, [1, 5, 8]],
	[2, [2, 6, 9]],
	[3, [3, 7, 10]],
	[4, [4, 8, 11]],
	[5, [5, 9, 0]],
	[6, [6, 10, 1]],
	[7, [7, 11, 2]],
	[8, [8, 0, 3]],
	[9, [9, 1, 4]],
	[10, [10, 2, 5]],
	[11, [11, 3, 6]],
];

const MINOR: [number, number[]][] = [
	[0, [0, 3, 7]],
	[1, [1, 4, 8]],
	[2, [2, 5, 9]],
	[3, [3, 6, 10]],
	[4, [4, 7, 11]],
	[5, [5, 8, 0]],
	[6, [6, 9, 1]],
	[7, [7, 10, 2]],
	[8, [8, 11, 3]],
	[9, [9, 0, 4]],
	[10, [10, 1, 5]],
	[11, [11, 2, 6]],
];

const DOM7: [number, number[]][] = [
	[0, [0, 4, 7, 10]],
	[1, [1, 5, 8, 11]],
	[2, [2, 6, 9, 0]],
	[3, [3, 7, 10, 1]],
	[4, [4, 8, 11, 2]],
	[5, [5, 9, 0, 3]],
	[6, [6, 10, 1, 4]],
	[7, [7, 11, 2, 5]],
	[8, [8, 0, 3, 6]],
	[9, [9, 1, 4, 7]],
	[10, [10, 2, 5, 8]],
	[11, [11, 3, 6, 9]],
];

describe("chordTones: all 12 roots", () => {
	it.each(MAJOR)("maj, root %i", (root, expected) => {
		expect(chordTones({ root, quality: "maj" })).toEqual(expected);
	});

	it.each(MINOR)("min, root %i", (root, expected) => {
		expect(chordTones({ root, quality: "min" })).toEqual(expected);
	});

	it.each(DOM7)("dom7, root %i", (root, expected) => {
		expect(chordTones({ root, quality: "dom7" })).toEqual(expected);
	});
});

describe("chordTones: structure", () => {
	const cases = [
		{ quality: "maj", size: 3 },
		{ quality: "min", size: 3 },
		{ quality: "dom7", size: 4 },
	] as const;

	describe.each(cases)("$quality", ({ quality, size }) => {
		const roots = Array.from({ length: 12 }, (_, i) => i);

		it.each(roots)("root %i: starts with the root", (root) => {
			expect(chordTones({ root, quality })[0]).toBe(root);
		});

		it.each(roots)("root %i: has the right number of distinct tones", (root) => {
			const tones = chordTones({ root, quality });
			expect(tones).toHaveLength(size);
			expect(new Set(tones).size).toBe(size);
		});

		it.each(roots)("root %i: every tone is a pitch class (0-11)", (root) => {
			for (const tone of chordTones({ root, quality })) {
				expect(Number.isInteger(tone)).toBe(true);
				expect(tone).toBeGreaterThanOrEqual(0);
				expect(tone).toBeLessThanOrEqual(11);
			}
		});
	});

	it("wraps around the octave (B major = B D# F#)", () => {
		expect(chordTones({ root: 11, quality: "maj" })).toEqual([11, 3, 6]);
	});
});

describe("chordTones: purity", () => {
	it("returns a fresh array on every call", () => {
		const a = chordTones({ root: 0, quality: "maj" });
		const b = chordTones({ root: 0, quality: "maj" });
		expect(a).toEqual(b);
		expect(a).not.toBe(b);
	});

	it("is not affected by callers mutating a previous result", () => {
		const first = chordTones({ root: 0, quality: "dom7" });
		first.push(99);
		first.sort((x, y) => y - x);
		first[0] = -1;

		expect(chordTones({ root: 0, quality: "dom7" })).toEqual([0, 4, 7, 10]);
	});

	it("does not mutate the chord it receives", () => {
		const chord = Object.freeze({ root: 7, quality: "min" as const });
		expect(() => chordTones(chord)).not.toThrow();
		expect(chord).toEqual({ root: 7, quality: "min" });
	});
});

describe("chordTones: invalid input", () => {
	it.each([-1, 12, 13, -12, 1.5, NaN, Infinity, -Infinity])("rejects root %s (not an integer in 0-11)", (root) => {
		expect(() => chordTones({ root, quality: "maj" })).toThrow();
	});

	it.each(["xyz", "", "MAJ", "m7"])("rejects unknown quality %j at runtime", (quality) => {
		expect(() => chordTones({ root: 0, quality: quality as never })).toThrow();
	});
});
