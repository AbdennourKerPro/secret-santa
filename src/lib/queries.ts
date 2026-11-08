import { and, eq } from "drizzle-orm";
import { assignment, db, participant, santa } from "@/db";
import { hashToken } from "./tokens";

export async function santaByOrganizerToken(token: string) {
  const [row] = await db().select().from(santa).where(eq(santa.organizerTokenHash, hashToken(token))).limit(1);
  return row ?? null;
}

export async function participantsOf(santaId: string) {
  return db().select().from(participant).where(eq(participant.santaId, santaId)).orderBy(participant.createdAt);
}

export async function participantByToken(token: string) {
  const [row] = await db()
    .select({ p: participant, s: santa })
    .from(participant)
    .innerJoin(santa, eq(santa.id, participant.santaId))
    .where(eq(participant.tokenHash, hashToken(token)))
    .limit(1);
  return row ?? null;
}

export async function receiverOf(giverId: string) {
  const [a] = await db().select({ receiverId: assignment.receiverId }).from(assignment).where(eq(assignment.giverId, giverId)).limit(1);
  if (!a) return null;
  const [r] = await db().select({ name: participant.name }).from(participant).where(eq(participant.id, a.receiverId)).limit(1);
  return r ?? null;
}

export { and, eq };
