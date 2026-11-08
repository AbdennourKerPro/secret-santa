"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db, participant } from "@/db";
import { hashToken } from "@/lib/tokens";

/** Records the first time a participant opens their gift (the organizer sees "a ouvert son cadeau"). */
export async function markOpened(token: string): Promise<void> {
  await db()
    .update(participant)
    .set({ openedAt: new Date() })
    .where(and(eq(participant.tokenHash, hashToken(token)), isNull(participant.openedAt)));
}
