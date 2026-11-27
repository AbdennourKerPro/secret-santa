import { Suspense } from "react";
import { CalendarDays, UserRound, Wallet } from "lucide-react";
import { Frame } from "@/components/Frame";
import { formatDate } from "@/lib/mail";
import { loadParticipant } from "./data";
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
  const { s, p, receiver } = await loadParticipant(token);

  return (
    <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col items-center px-5 pb-32 text-center">
      <p className="font-script text-2xl text-or">Bonjour {p.name} !</p>
      <h1 className="font-display text-5xl font-extralight uppercase leading-none tracking-tight text-or-pale sm:text-6xl">{s.name}</h1>

      <Reveal token={token} receiverName={receiver.name} alreadyOpened={!!p.openedAt} />

      <section aria-label="L'événement" className="w-full max-w-md rounded-3xl border border-or-pale/20 bg-black/15 px-5 py-5">
        <ul className="grid gap-2 text-or-pale/90">
          <li className="inline-flex items-center justify-center gap-2"><CalendarDays size={18} strokeWidth={1.5} aria-hidden="true" />{formatDate(s.exchangeDate)}</li>
          <li className="inline-flex items-center justify-center gap-2"><Wallet size={18} strokeWidth={1.5} aria-hidden="true" />Budget {s.budget} {s.currency}</li>
          <li className="inline-flex items-center justify-center gap-2 text-sm text-or-pale/60"><UserRound size={16} strokeWidth={1.5} aria-hidden="true" />Organisé par {s.organizerName}</li>
        </ul>
        {s.message && <blockquote className="mt-4 border-t border-or-pale/15 pt-4 font-serif text-lg italic text-neige/90">« {s.message} »</blockquote>}
      </section>
    </main>
  );
}
