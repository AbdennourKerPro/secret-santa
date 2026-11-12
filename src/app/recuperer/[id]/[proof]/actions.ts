"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, santa } from "@/db";
import { validRecoveryProof } from "@/lib/recovery";
import { hashToken, newToken } from "@/lib/tokens";

export async function confirmRecovery(id: string, proof: string) {
  if (!/^[a-f0-9-]{36}$/i.test(id)) redirect("/mes-secret-santa");
  const [event] = await db().select({ hash: santa.organizerTokenHash }).from(santa).where(eq(santa.id, id)).limit(1);
  if (!event || !validRecoveryProof(id, proof, event.hash)) redirect("/mes-secret-santa");
  const token = newToken();
  // Compare-and-swap makes all recovery proofs single-use, including concurrent requests.
  const changed = await db().update(santa).set({ organizerTokenHash: hashToken(token) })
    .where(and(eq(santa.id, id), eq(santa.organizerTokenHash, event.hash)))
    .returning({ id: santa.id });
  if (!changed.length) redirect("/mes-secret-santa");
  redirect(`/orga/${token}`);
}
