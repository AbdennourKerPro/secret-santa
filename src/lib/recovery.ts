import { createHmac, timingSafeEqual } from "node:crypto";

const LIFETIME = 60 * 60 * 1000;

function signature(id: string, expires: string, organizerTokenHash: string) {
  return createHmac("sha256", organizerTokenHash).update(`organizer-recovery:${id}:${expires}`).digest("hex");
}

/** The existing high-entropy credential signs a short-lived, single-use recovery proof. */
export function recoveryProof(id: string, organizerTokenHash: string, now = Date.now()) {
  const expires = String(now + LIFETIME);
  return `${expires}.${signature(id, expires, organizerTokenHash)}`;
}

export function validRecoveryProof(id: string, proof: string, organizerTokenHash: string, now = Date.now()) {
  const match = /^(\d{13})\.([a-f0-9]{64})$/.exec(proof);
  if (!match) return false;
  const [, expires, mac] = match;
  if (Number(expires) <= now || Number(expires) > now + LIFETIME) return false;
  return timingSafeEqual(Buffer.from(mac, "hex"), Buffer.from(signature(id, expires, organizerTokenHash), "hex"));
}
