import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CalendarDays, Check, Eye, Mail, Trash2, Wallet } from "lucide-react";
import { Card, Shell } from "@/components/Shell";
import { formatDate } from "@/lib/mail";
import { participantsOf, santaByOrganizerToken } from "@/lib/queries";
import { MAX_PARTICIPANTS } from "@/lib/validation";
import { AddParticipantForm, DrawButton } from "./Controls";
import { removeParticipant, resendMail } from "./actions";
import { Remember } from "./Remember";

export const metadata = { title: "Tableau de bord", robots: { index: false } };

export default function OrganizerPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Shell wide>
      <Suspense fallback={<p className="text-encre-douce">Chargement…</p>}>
        <Dashboard params={params} />
      </Suspense>
    </Shell>
  );
}

function Status({ p, drawn }: { p: { emailSentAt: Date | null; openedAt: Date | null }; drawn: boolean }) {
  if (!drawn) return <span className="text-encre-douce">En attente du tirage</span>;
  if (p.openedAt) return <span className="inline-flex items-center gap-1 font-semibold text-rouge-profond"><Eye size={16} aria-hidden="true" />A ouvert son cadeau</span>;
  if (p.emailSentAt) return <span className="inline-flex items-center gap-1"><Check size={16} aria-hidden="true" />E-mail envoyé</span>;
  return <span className="inline-flex items-center gap-1 font-semibold text-rouge-profond"><Mail size={16} aria-hidden="true" />Envoi échoué</span>;
}

async function Dashboard({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const s = await santaByOrganizerToken(token);
  if (!s) notFound();
  const people = await participantsOf(s.id);
  const drawn = !!s.drawnAt;
  const unsent = people.filter((p) => !p.emailSentAt).length;

  return (
    <div className="grid gap-6">
      <Remember path={`/orga/${token}`} name={s.name} exchangeDate={s.exchangeDate} />
      <div>
        <h1 className="text-3xl">{s.name}</h1>
        <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-encre-douce">
          <span className="inline-flex items-center gap-1"><CalendarDays size={18} strokeWidth={1.5} aria-hidden="true" />{formatDate(s.exchangeDate)}</span>
          <span className="inline-flex items-center gap-1"><Wallet size={18} strokeWidth={1.5} aria-hidden="true" />{s.budget} {s.currency} par cadeau</span>
        </p>
      </div>

      <Card>
        <h2 className="mb-3 text-xl">Participants ({people.length})</h2>
        {people.length === 0 ? (
          <p className="text-encre-douce">Personne pour l&rsquo;instant. Ajoute au moins 3 participants.</p>
        ) : (
          <ul className="divide-y divide-or-pale">
            {people.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-encre-douce">{p.email}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Status p={p} drawn={drawn} />
                  {drawn ? (
                    <form action={resendMail.bind(null, token, p.id)}>
                      <button className="h-9 rounded-lg border border-rouge px-3 font-semibold text-rouge hover:bg-or-pale">Renvoyer</button>
                    </form>
                  ) : (
                    <form action={removeParticipant.bind(null, token, p.id)}>
                      <button aria-label={`Retirer ${p.name}`} className="flex h-9 w-9 items-center justify-center rounded-lg text-rouge hover:bg-or-pale">
                        <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {drawn ? (
        <Card>
          <h2 className="text-xl">Le tirage est fait</h2>
          {unsent > 0 ? (
            <p role="alert" className="mt-1 font-semibold text-rouge-profond">{unsent} e-mail(s) n&rsquo;ont pas pu partir : utilise « Renvoyer » sur les lignes concernées.</p>
          ) : (
            <p role="status" className="mt-1 font-semibold">Chaque participant a reçu son e-mail.</p>
          )}
          <p className="mt-1 text-encre-douce">Les attributions restent secrètes, même pour toi. « Renvoyer » envoie un nouveau lien à un participant qui n&rsquo;a pas reçu son e-mail (l&rsquo;ancien lien cesse de fonctionner).</p>
        </Card>
      ) : (
        <>
          {people.length < MAX_PARTICIPANTS && (
            <Card>
              <h2 className="mb-3 text-xl">Ajouter un participant</h2>
              <AddParticipantForm token={token} />
            </Card>
          )}
          <Card>
            <h2 className="text-xl">Tirage au sort</h2>
            <p className="mb-4 mt-1 text-encre-douce">
              {people.length < 3 ? "Il faut au moins 3 participants." : "Chacun recevra par e-mail un lien secret pour découvrir son destinataire."}
            </p>
            {people.length >= 3 && <DrawButton token={token} count={people.length} />}
          </Card>
        </>
      )}
    </div>
  );
}
