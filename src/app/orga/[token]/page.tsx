import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, Check, Eye, Mail, RotateCw, Trash2, Wallet } from "lucide-react";
import { Frame, PageTitle } from "@/components/Frame";
import { MascotIcon } from "@/components/mascots/Mascots";
import { SantaList } from "@/components/scenes/SantaList";
import { formatDate } from "@/lib/mail";
import { participantsOf, santaByOrganizerToken } from "@/lib/queries";
import { MAX_PARTICIPANTS } from "@/lib/validation";
import { AddParticipantForm, DrawButton } from "./Controls";
import { removeParticipant, resendMail } from "./actions";
import { Remember } from "./Remember";

export const metadata = { title: "Tableau de bord", robots: { index: false } };

export default function OrganizerPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Frame>
      <Suspense fallback={<p className="px-8 text-or-pale/70">Chargement…</p>}>
        <Dashboard params={params} />
      </Suspense>
    </Frame>
  );
}

function Status({ p, drawn }: { p: { emailSentAt: Date | null; openedAt: Date | null }; drawn: boolean }) {
  const base = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold";
  if (!drawn) return null;
  if (p.openedAt) return <span className={`${base} bg-or/15 text-or`}><Eye size={14} aria-hidden="true" />A ouvert son cadeau</span>;
  if (p.emailSentAt) return <span className={`${base} bg-white/10 text-or-pale`}><Check size={14} aria-hidden="true" />E-mail envoyé</span>;
  return <span className={`${base} bg-[#ffb3bd]/15 text-[#ffb3bd]`}><Mail size={14} aria-hidden="true" />Envoi échoué</span>;
}

async function Dashboard({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = await santaByOrganizerToken(token);
  if (!s) notFound();
  const people = await participantsOf(s.id);
  const drawn = !!s.drawnAt;
  const unsent = people.filter((p) => !p.emailSentAt).length;

  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-5 pb-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      <Remember path={`/orga/${token}`} name={s.name} exchangeDate={s.exchangeDate} />

      <div className="lg:sticky lg:top-10 lg:self-start">
        <PageTitle kicker={drawn ? "Les lutins s'activent" : "Le Père Noël vérifie sa liste"}>{s.name}</PageTitle>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-or-pale/80">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={18} strokeWidth={1.5} aria-hidden="true" />{formatDate(s.exchangeDate)}</span>
          <span className="inline-flex items-center gap-1.5"><Wallet size={18} strokeWidth={1.5} aria-hidden="true" />{s.budget} {s.currency} par cadeau</span>
        </p>
        <SantaList className="mx-auto mt-6 w-full max-w-[240px] lg:max-w-[300px]" />
      </div>

      <section aria-labelledby="participants" className="grid content-start gap-8">
        <div>
          <h2 id="participants" className="flex items-baseline justify-between border-b border-or-pale/25 pb-2 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-or-pale/70">
            <span>Participants</span><span className="font-display text-3xl font-extralight text-or-pale">{people.length}</span>
          </h2>
          {people.length === 0 ? (
            <p className="py-6 text-or-pale/70">Personne pour l&rsquo;instant. Ajoute au moins 3 participants.</p>
          ) : (
            <ul className="divide-y divide-or-pale/15">
              {people.map((p, i) => (
                <li key={p.id} className="rise-in flex flex-wrap items-center gap-3 py-3" style={{ animationDelay: `${i * 40}ms` }}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rouge-profond/70 ring-1 ring-or-pale/20">
                    <MascotIcon kind={(["santa", "reindeer", "elf"] as const)[i % 3]} size={32} />
                  </span>
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-neige">{p.name}</p>
                      <p className="truncate text-sm text-or-pale/60">{p.email}</p>
                    </div>
                    {drawn && <div className="mt-1 sm:mt-0"><Status p={p} drawn={drawn} /></div>}
                  </div>
                  {drawn ? (
                    <form action={resendMail.bind(null, token, p.id)}>
                      <button aria-label={`Renvoyer l'e-mail à ${p.name}`} title="Renvoyer" className="flex h-10 w-10 items-center justify-center rounded-full text-or-pale/70 hover:bg-white/10 hover:text-neige">
                        <RotateCw size={18} strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    </form>
                  ) : (
                    <form action={removeParticipant.bind(null, token, p.id)}>
                      <button aria-label={`Retirer ${p.name}`} className="flex h-10 w-10 items-center justify-center rounded-full text-or-pale/70 hover:bg-white/10 hover:text-neige">
                        <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
          {!drawn && people.length < MAX_PARTICIPANTS && (
            <div className="mt-4"><AddParticipantForm token={token} /></div>
          )}
        </div>

        {drawn ? (
          <div className="rounded-3xl border border-or-pale/20 bg-white/5 p-6 text-center">
            <p className="font-script text-3xl text-or">Le tirage est fait !</p>
            {unsent > 0 ? (
              <p role="alert" className="mt-2 font-semibold text-[#ffb3bd]">{unsent} e-mail(s) n&rsquo;ont pas pu partir : utilise le bouton ↻ sur les lignes concernées.</p>
            ) : (
              <p role="status" className="mt-2 text-neige">Chaque participant a reçu son e-mail.</p>
            )}
            <p className="mt-2 text-sm text-or-pale/60">Les attributions restent secrètes, même pour toi. ↻ envoie un nouveau lien (l&rsquo;ancien cesse de fonctionner).</p>
          </div>
        ) : (
          <div className="grid justify-items-center gap-2 text-center">
            {people.length >= 3 ? (
              <>
                <DrawButton token={token} count={people.length} />
                <p className="text-sm text-or-pale/60">Chacun recevra par e-mail un lien secret vers son destinataire.</p>
              </>
            ) : (
              <p className="text-sm text-or-pale/60">Encore {3 - people.length} participant(s) avant de pouvoir lancer le tirage.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
