import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, Wallet } from "lucide-react";
import { Frame } from "@/components/Frame";
import { formatDate } from "@/lib/mail";
import { participantByToken, receiverOf } from "@/lib/queries";
import { Reveal } from "./Reveal";

export const metadata = { title: "Ton Secret Santa", robots: { index: false } };

export default function GiftPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Frame glow="center">
      <Suspense fallback={<p className="p-8 text-center text-or-pale/70">Chargement…</p>}>
        <Gift params={params} />
      </Suspense>
    </Frame>
  );
}

async function Gift({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const found = await participantByToken(token);
  if (!found || !found.s.drawnAt) notFound();
  const receiver = await receiverOf(found.p.id);
  if (!receiver) notFound();
  const { s, p } = found;

  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center px-5 pb-12 text-center">
      <p className="font-script text-2xl text-or">Bonjour {p.name} !</p>
      <h1 className="font-display text-5xl font-extralight uppercase leading-none tracking-tight text-or-pale sm:text-6xl">{s.name}</h1>

      <Reveal token={token} receiverName={receiver.name} />

      <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-1 text-or-pale/85">
        <span className="inline-flex items-center gap-1.5"><CalendarDays size={18} strokeWidth={1.5} aria-hidden="true" />{formatDate(s.exchangeDate)}</span>
        <span className="inline-flex items-center gap-1.5"><Wallet size={18} strokeWidth={1.5} aria-hidden="true" />{s.budget} {s.currency}</span>
      </div>
      {s.message && <blockquote className="mt-5 max-w-md font-serif text-lg italic text-neige/90">« {s.message} »</blockquote>}
      <p className="mt-4 text-sm text-or-pale/55">Organisé par {s.organizerName}</p>
    </main>
  );
}
