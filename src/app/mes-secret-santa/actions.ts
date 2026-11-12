"use server";

import { eq } from "drizzle-orm";
import { db, santa } from "@/db";
import { appUrl, recoveryMail, sendMail } from "@/lib/mail";
import { recoveryProof } from "@/lib/recovery";
import { hashToken } from "@/lib/tokens";
import { participantSchema } from "@/lib/validation";

export type RecoveryState = { ok?: string; error?: string; email?: string };

export async function recoverOrganizer(_prev: RecoveryState, formData: FormData): Promise<RecoveryState> {
  const parsed = participantSchema.shape.email.safeParse(formData.get("recoveryEmail"));
  if (!parsed.success) return { error: "Renseigne une adresse e-mail valide." };
  const email = parsed.data;
  try {
    // Never rotate the credential here: only the mailbox owner may confirm recovery.
    const events = await db().select({ id: santa.id, name: santa.name, hash: santa.organizerTokenHash })
      .from(santa).where(eq(santa.organizerEmail, email)).orderBy(santa.id);
    if (events.length) {
      if (!process.env.RESEND_API_KEY) throw new Error("Envoi des e-mails indisponible");
      // Identical requests within five minutes produce one email, even across instances.
      const recoveryWindow = Math.floor(Date.now() / 300_000) * 300_000;
      await sendMail({
        to: email,
        idempotencyKey: `organizer-recovery/${hashToken(JSON.stringify([email, recoveryWindow, events]))}`,
        ...recoveryMail(events.map((s) => ({
          name: s.name,
          url: `${appUrl()}/recuperer/${s.id}/${recoveryProof(s.id, s.hash, recoveryWindow)}`,
        }))),
      });
    }
  } catch (error) {
    console.error("Récupération organisateur impossible", error);
    return { error: "La demande n’a pas pu aboutir. Réessaie dans quelques instants.", email };
  }
  return { ok: "Si cette adresse correspond à des événements organisés, tu recevras un e-mail pour retrouver tes tableaux de bord. Vérifie aussi les indésirables.", email };
}
