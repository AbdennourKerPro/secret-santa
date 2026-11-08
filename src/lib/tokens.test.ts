import { describe, expect, it } from "vitest";
import { hashToken, newToken, tokenMatches } from "./tokens";

describe("tokens", () => {
  it("génère des jetons uniques et longs", () => {
    const a = newToken();
    expect(a.length).toBeGreaterThanOrEqual(43);
    expect(a).not.toBe(newToken());
  });
  it("vérifie le hash", () => {
    const t = newToken();
    expect(tokenMatches(t, hashToken(t))).toBe(true);
    expect(tokenMatches("autre", hashToken(t))).toBe(false);
  });
});
