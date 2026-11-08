"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { assignment, db, participant, santa } from "@/db";
import { drawCycle } from "@/lib/draw";
import { appUrl, participantMail, sendMail } from "@/lib/mail";
import { participantsOf, santaByOrganizerToken } from "@/lib/queries";
import { hashToken, newToken } from "@/lib/tokens";
import { eventSchema, fieldErrors, MAX_PARTICIPANTS, participantSchema, type FieldErrors } from "@/lib/validation";

export type ActionState = { ok?: string; error?: string; errors?: FieldErrors; values?: Record<string, string> };

// Every action re-checks the organizer token: pages being private is not enough.
async function authorize(token: string) {
  const s = await santaByOrganizerToken(token);
  if (!s) throw new Error("Lien invalide");
  return s;
}

function mailFor(s: typeof santa.$inferSelect, p: { name: string }, playerToken: string) {
  return participantMail({
    santaName: s.name, participantName: p.name, organizerName: s.organizerName, exchangeDate: s.exchangeDate,
    budget: s.budget, currency: s.currency, message: s.message, url: `${appUrl()}/cadeau/${playerToken}`,
  });
}

/** Name, date, budget and message stay editable after the draw: participants read them live on their page. */
export async function updateEvent(token: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const s = await authorize(token);
  const input = {
    name: String(formData.get("name") ?? ""),
    exchangeDate: String(formData.get("exchangeDate") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: input }; // React resets the form: send back what was typed
  await db().update(santa).set(parsed.data).where(eq(santa.id, s.id));
  revalidatePath(`/orga/${token}`);
  return { ok: "Informations mises à jour." };
}

export async function addParticipant(token: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const s = await authorize(token);
  if (s.drawnAt) return { error: "Le tirage est déjà fait : on ne peut plus ajouter de participants." };
  const parsed = participantSchema.safeParse({ name: formData.get("name") ?? "", email: formData.get("email") ?? "" });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };
  const existing = await participantsOf(s.id);
  if (existing.length >= MAX_PARTICIPANTS) return { error: `${MAX_PARTICIPANTS} participants maximum.` };
  if (existing.some((p) => p.email === parsed.data.email)) return { errors: { email: ["Cette adresse est déjà dans la liste."] } };
  await db().insert(participant).values({ santaId: s.id, ...parsed.data });
  revalidatePath(`/orga/${token}`);
  return { ok: `${parsed.data.name} ajouté(e).` };
}

export async function removeParticipant(token: string, participantId: string): Promise<void> {
  const s = await authorize(token);
  if (s.drawnAt) throw new Error("Tirage déjà fait");
  await db().delete(participant).where(and(eq(participant.id, participantId), eq(participant.santaId, s.id)));
  revalidatePath(`/orga/${token}`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature required by useActionState
export async function runDraw(token: string, _prev: ActionState): Promise<ActionState> {
  const s = await authorize(token);
  const people = await participantsOf(s.id);
  if (people.length < 3) return { error: "Il faut au moins 3 participants pour lancer le tirage." };

  // Claim the draw atomically so a double click or two tabs cannot draw twice.
  const claimed = await db().update(santa).set({ drawnAt: new Date() }).where(and(eq(santa.id, s.id), isNull(santa.drawnAt))).returning({ id: santa.id });
  if (!claimed.length) return { error: "Le tirage a déjà été lancé." };

  const pairs = drawCycle(people.map((p) => p.id));
  const tokens = new Map(people.map((p) => [p.id, newToken()]));
  try {
    await db().batch([
      db().insert(assignment).values(pairs.map((x) => ({ santaId: s.id, giverId: x.giverId, receiverId: x.receiverId }))),
      ...people.map((p) => db().update(participant).set({ tokenHash: hashToken(tokens.get(p.id)!) }).where(eq(participant.id, p.id))),
    ]);
  } catch (e) {
    await db().update(santa).set({ drawnAt: null }).where(eq(santa.id, s.id));
    console.error("Tirage annulé", e);
    return { error: "Le tirage a échoué, rien n'a été enregistré. Réessaie." };
  }

  const results = await Promise.allSettled(
    people.map(async (p) => {
      await sendMail({ to: p.email, ...mailFor(s, p, tokens.get(p.id)!) });
      await db().update(participant).set({ emailSentAt: new Date() }).where(eq(participant.id, p.id));
    }),
  );
  const failed = results.filter((r) => r.status === "rejected").length;
  results.forEach((r) => r.status === "rejected" && console.error("Mail participant non envoyé", r.reason));
  revalidatePath(`/orga/${token}`);
  return failed
    ? { error: `Tirage fait, mais ${failed} e-mail(s) n'ont pas pu partir. Utilise « Renvoyer » sur les lignes concernées.` }
    : { ok: "Tirage fait ! Chaque participant a reçu son e-mail." };
}

export async function resendMail(token: string, participantId: string): Promise<void> {
  const s = await authorize(token);
  if (!s.drawnAt) throw new Error("Tirage pas encore fait");
  const [p] = await db().select().from(participant).where(and(eq(participant.id, participantId), eq(participant.santaId, s.id))).limit(1);
  if (!p) throw new Error("Participant introuvable");
  // Only hashes are stored, so resending means issuing a new link (the previous one stops working).
  const playerToken = newToken();
  await db().update(participant).set({ tokenHash: hashToken(playerToken), emailSentAt: null }).where(eq(participant.id, p.id));
  await sendMail({ to: p.email, ...mailFor(s, p, playerToken) });
  await db().update(participant).set({ emailSentAt: new Date() }).where(eq(participant.id, p.id));
  revalidatePath(`/orga/${token}`);
}
