import { describe, expect, it } from "vitest";

import { ENGINE_NAME } from "../src/index";

// S1-1 smoke test: proves the toolchain (Vitest, tsc, module resolution)
// works end to end. Replaced by real engine tests from S1-3 on.
describe("toolchain", () => {
  it("runs Vitest against TypeScript from src", () => {
    expect(ENGINE_NAME).toBe("chordloom-theory");
  });
});
