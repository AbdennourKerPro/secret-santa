import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, Wallet } from "lucide-react";
import { Banner } from "@/components/Banner";
import { Card } from "@/components/Shell";
import { formatDate } from "@/lib/mail";
import { participantByToken, receiverOf } from "@/lib/queries";
import { Reveal } from "./Reveal";

export const metadata = { title: "Ton Secret Santa", robots: { index: false } };

export default function GiftPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <>
      <Banner />
      <Suspense fallback={<p className="p-8 text-center text-neige">Chargement…</p>}>
        <Gift params={params} />
      </Suspense>
    </>
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
    <div className="flex-1 bg-rouge-profond pb-10 pt-6">
      <div className="mx-auto grid w-full max-w-[640px] gap-6 px-4">
        <div className="text-center text-neige">
          <h1 className="text-3xl">{s.name}</h1>
          <p className="mt-1 text-or-pale">Bonjour {p.name} !</p>
        </div>
        <Reveal token={token} receiverName={receiver.name} />
        <Card>
          <h2 className="mb-3 text-xl">L&rsquo;échange</h2>
          <ul className="grid gap-2 text-encre">
            <li className="flex items-center gap-2"><CalendarDays size={20} strokeWidth={1.5} className="text-rouge" aria-hidden="true" />{formatDate(s.exchangeDate)}</li>
            <li className="flex items-center gap-2"><Wallet size={20} strokeWidth={1.5} className="text-rouge" aria-hidden="true" />Budget : {s.budget} {s.currency}</li>
          </ul>
          {s.message && <p className="mt-4 border-l-4 border-or bg-creme px-4 py-3">{s.message}</p>}
          <p className="mt-4 text-sm text-encre-douce">Organisé par {s.organizerName}.</p>
        </Card>
      </div>
    </div>
  );
}
