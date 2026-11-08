import { describe, expect, it } from "vitest";
import { drawCycle } from "./draw";

const ids = (n: number) => Array.from({ length: n }, (_, i) => `p${i}`);

describe("drawCycle", () => {
  it("refuse moins de 3 participants", () => {
    expect(() => drawCycle(ids(2))).toThrow();
  });

  it("refuse les doublons", () => {
    expect(() => drawCycle(["a", "b", "a"])).toThrow();
  });

  it("personne ne se tire soi-même, chacun donne et reçoit une fois", () => {
    for (let n = 3; n <= 40; n++) {
      for (let run = 0; run < 50; run++) {
        const list = ids(n);
        const pairs = drawCycle(list);
        expect(pairs).toHaveLength(n);
        for (const p of pairs) expect(p.giverId).not.toBe(p.receiverId);
        expect(new Set(pairs.map((p) => p.giverId))).toEqual(new Set(list));
        expect(new Set(pairs.map((p) => p.receiverId))).toEqual(new Set(list));
      }
    }
  });

  it("forme un seul cycle", () => {
    const pairs = drawCycle(ids(12));
    const next = new Map(pairs.map((p) => [p.giverId, p.receiverId]));
    let cur = pairs[0].giverId;
    let steps = 0;
    do {
      cur = next.get(cur)!;
      steps++;
    } while (cur !== pairs[0].giverId);
    expect(steps).toBe(12);
  });

  it("produit des tirages variés", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      seen.add(drawCycle(ids(6)).map((p) => p.receiverId).join());
    }
    expect(seen.size).toBeGreaterThan(5);
  });
});
