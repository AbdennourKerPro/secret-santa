import { and, eq } from "drizzle-orm";
import { assignment, db, message, participant, santa, wishlist } from "@/db";
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
  const [r] = await db().select({ id: participant.id, name: participant.name }).from(participant).where(eq(participant.id, a.receiverId)).limit(1);
  return r ?? null;
}

/** The giver whose assignment points at this participant. Only ever used to route messages, never shown. */
export async function giverOf(receiverId: string) {
  const [a] = await db().select({ giverId: assignment.giverId }).from(assignment).where(eq(assignment.receiverId, receiverId)).limit(1);
  return a?.giverId ?? null;
}

export async function wishlistOf(participantId: string): Promise<string> {
  const [w] = await db().select({ content: wishlist.content }).from(wishlist).where(eq(wishlist.participantId, participantId)).limit(1);
  return w?.content ?? "";
}

/** Messages carry no sender identity beyond which side wrote them. */
export async function threadMessages(giverId: string) {
  return db()
    .select({ id: message.id, fromGiver: message.fromGiver, body: message.body, createdAt: message.createdAt })
    .from(message)
    .where(eq(message.giverId, giverId))
    .orderBy(message.createdAt);
}

export { and, eq };
