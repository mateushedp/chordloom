/**
 * Public entry point of the theory engine.
 */
export const ENGINE_NAME = "chordloom-theory";

export { noteName } from "./notation";
export { chordTones } from "./chord";
export { isPitchClass, toPitchClass } from "./types";
export type { Accidental, Notation } from "./notation";
export type { Chord, Quality } from "./chord";
export type { PitchClass } from "./types";
