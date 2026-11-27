import { notFound } from "next/navigation";
import { cache } from "react";
import { giverOf, participantByToken, receiverOf, threadMessages } from "@/lib/queries";
import type { ChatMessage } from "./Thread";

const whenFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

/** Everything every participant page needs, fetched once per request (layout and page share it). */
export const loadParticipant = cache(async (token: string) => {
  const found = await participantByToken(token);
  if (!found || !found.s.drawnAt) notFound();
  const receiver = await receiverOf(found.p.id);
  if (!receiver) notFound();
  return { ...found, receiver };
});

/** "out": with the person I drew (I am the giver). "in": with my secret Santa (I am the receiver). */
export async function loadThread(myId: string, side: "out" | "in"): Promise<ChatMessage[]> {
  const giverId = side === "out" ? myId : await giverOf(myId);
  if (!giverId) return [];
  const rows = await threadMessages(giverId);
  const mineIsGiver = side === "out";
  return rows.map((m) => ({ id: m.id, mine: m.fromGiver === mineIsGiver, body: m.body, when: whenFmt.format(m.createdAt) }));
}
