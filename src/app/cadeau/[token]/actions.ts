"use server";

import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { assignment, db, message, participant, santa, wishlist } from "@/db";
import { messageMail, sendMail } from "@/lib/mail";
import { participantByToken } from "@/lib/queries";
import { hashToken } from "@/lib/tokens";
import { fieldErrors, MAX_THREAD_MESSAGES, messageSchema, wishlistSchema, type FieldErrors } from "@/lib/validation";

export type ActionState = { ok?: string; error?: string; errors?: FieldErrors; at?: number };

/** Records the first time a participant opens their gift (the organizer sees "a ouvert son cadeau"). */
export async function markOpened(token: string): Promise<void> {
  await db()
    .update(participant)
    .set({ openedAt: new Date() })
    .where(and(eq(participant.tokenHash, hashToken(token)), isNull(participant.openedAt)));
}

// Every action re-checks the personal token and that the draw happened.
async function authorize(token: string) {
  const found = await participantByToken(token);
  if (!found || !found.s.drawnAt) throw new Error("Lien invalide");
  return found;
}

export async function saveWishlist(token: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { p } = await authorize(token);
  const parsed = wishlistSchema.safeParse({ content: formData.get("content") ?? "" });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), at: Date.now() };
  await db()
    .insert(wishlist)
    .values({ participantId: p.id, content: parsed.data.content })
    .onConflictDoUpdate({ target: wishlist.participantId, set: { content: parsed.data.content, updatedAt: new Date() } });
  revalidatePath(`/cadeau/${token}`);
  return { ok: "Ta liste est enregistrée. Ton Père Noël secret peut la lire.", at: Date.now() };
}

/**
 * "out": I am the giver and write to the person I drew. "in": I am the receiver and answer my secret Santa.
 * The thread is always keyed by the giver, so the receiver never learns who it is.
 */
export async function sendMessage(token: string, role: "out" | "in", _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { p, s } = await authorize(token);
  const parsed = messageSchema.safeParse({ body: formData.get("body") ?? "" });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), at: Date.now() };

  const fromGiver = role === "out";
  const [a] = await db()
    .select({ giverId: assignment.giverId, receiverId: assignment.receiverId })
    .from(assignment)
    .where(fromGiver ? eq(assignment.giverId, p.id) : eq(assignment.receiverId, p.id))
    .limit(1);
  if (!a) return { error: "Conversation introuvable.", at: Date.now() };

  const [{ count }] = await db().select({ count: sql<number>`count(*)::int` }).from(message).where(eq(message.giverId, a.giverId));
  if (count >= MAX_THREAD_MESSAGES) return { error: "Cette conversation est pleine.", at: Date.now() };

  // Only warn the other side by mail if this side has been quiet for a while (no mail storm during a chat).
  const [last] = await db()
    .select({ createdAt: message.createdAt })
    .from(message)
    .where(and(eq(message.giverId, a.giverId), eq(message.fromGiver, fromGiver)))
    .orderBy(desc(message.createdAt))
    .limit(1);
  const shouldMail = !last || Date.now() - last.createdAt.getTime() > 30 * 60_000;

  await db().insert(message).values({ giverId: a.giverId, fromGiver, body: parsed.data.body });

  if (shouldMail) {
    const [other] = await db()
      .select({ name: participant.name, email: participant.email })
      .from(participant)
      .where(eq(participant.id, fromGiver ? a.receiverId : a.giverId))
      .limit(1);
    if (other) {
      const [ev] = await db().select({ name: santa.name }).from(santa).where(eq(santa.id, s.id)).limit(1);
      try {
        await sendMail({ to: other.email, ...messageMail({ santaName: ev?.name ?? s.name, toName: other.name, fromGiver, senderName: p.name }) });
      } catch (err) {
        console.error("Mail de notification non envoyé", err); // the message itself is saved
      }
    }
  }
  revalidatePath(`/cadeau/${token}`);
  return { ok: "Envoyé.", at: Date.now() };
}
