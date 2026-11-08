import { randomInt } from "node:crypto";

export type Pairing = { giverId: string; receiverId: string };

/** Fisher-Yates shuffle with a cryptographically secure RNG. */
export function shuffle<T>(items: readonly T[], rand: (max: number) => number = randomInt): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds one big cycle: each person gives to the next one in a random order,
 * the last gives to the first. Nobody can draw themselves, everyone gives and
 * receives exactly once.
 */
export function drawCycle(
  ids: readonly string[],
  rand?: (max: number) => number,
): Pairing[] {
  if (new Set(ids).size !== ids.length) throw new Error("Participants en double");
  if (ids.length < 3) throw new Error("Il faut au moins 3 participants");
  const order = shuffle(ids, rand);
  return order.map((giverId, i) => ({
    giverId,
    receiverId: order[(i + 1) % order.length],
  }));
}
