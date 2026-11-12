import { describe, expect, it } from "vitest";
import { recoveryProof, validRecoveryProof } from "./recovery";
import { hashToken, newToken } from "./tokens";

describe("organizer recovery proofs", () => {
  const now = 1_800_000_000_000;
  const hash = hashToken(newToken());
  it("accepts a valid proof only for the intended event and credential", () => {
    const proof = recoveryProof("event-a", hash, now);
    expect(validRecoveryProof("event-a", proof, hash, now)).toBe(true);
    expect(validRecoveryProof("event-b", proof, hash, now)).toBe(false);
    expect(validRecoveryProof("event-a", proof, hashToken(newToken()), now)).toBe(false);
  });
  it("expires after one hour and rejects malformed or extended proofs", () => {
    const proof = recoveryProof("event-a", hash, now);
    expect(validRecoveryProof("event-a", proof, hash, now + 3_600_000)).toBe(false);
    expect(validRecoveryProof("event-a", proof, hash, now - 1)).toBe(false);
    for (const malformed of ["", "0.a", `${proof}.extra`, proof.replace(/.$/, "z")]) {
      expect(validRecoveryProof("event-a", malformed, hash, now)).toBe(false);
    }
  });
});
