"use server";

import { redirect } from "next/navigation";
import { db, participant, santa } from "@/db";
import { appUrl, organizerMail, sendMail } from "@/lib/mail";
import { hashToken, newToken } from "@/lib/tokens";
import { createSantaSchema, fieldErrors, type FieldErrors } from "@/lib/validation";

export type CreateState = { errors?: FieldErrors; values?: Record<string, string> };

export async function createSanta(_prev: CreateState, formData: FormData): Promise<CreateState> {
  const raw = Object.fromEntries(
    ["name", "exchangeDate", "budget", "message", "organizerName", "organizerEmail"].map((k) => [k, String(formData.get(k) ?? "")]),
  );
  const parsed = createSantaSchema.safeParse({ ...raw, organizerPlays: formData.get("organizerPlays") === "on" });
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values: raw };
  const d = parsed.data;

  const token = newToken();
  const [created] = await db()
    .insert(santa)
    .values({
      name: d.name, exchangeDate: d.exchangeDate, budget: d.budget, message: d.message,
      organizerName: d.organizerName, organizerEmail: d.organizerEmail, organizerTokenHash: hashToken(token),
    })
    .returning({ id: santa.id });

  if (d.organizerPlays) {
    await db().insert(participant).values({ santaId: created.id, name: d.organizerName, email: d.organizerEmail });
  }

  // The organizer lands on the dashboard right away; the e-mail is only a way to come back later.
  try {
    await sendMail({ to: d.organizerEmail, ...organizerMail({ santaName: d.name, url: `${appUrl()}/orga/${token}` }) });
  } catch (e) {
    console.error("Mail organisateur non envoyé", e);
  }
  redirect(`/orga/${token}`);
}
