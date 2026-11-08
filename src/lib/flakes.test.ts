import { describe, expect, it } from "vitest";
import { FLAKE_PATHS } from "./flakes";

describe("FLAKE_PATHS", () => {
  it("draws three six-fold variants that stay inside the unit circle", () => {
    expect(FLAKE_PATHS).toHaveLength(3);
    for (const d of FLAKE_PATHS) {
      const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
      expect(nums.length % 4).toBe(0);
      for (let i = 0; i < nums.length; i += 2) expect(Math.hypot(nums[i], nums[i + 1])).toBeLessThanOrEqual(1.0001);
      expect((d.match(/M/g) ?? []).length % 6).toBe(0);
    }
  });
});
