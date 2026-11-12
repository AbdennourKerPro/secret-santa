import { Suspense } from "react";
import { eq } from "drizzle-orm";
import { Frame, PageTitle } from "@/components/Frame";
import { PillLink } from "@/components/Buttons";
import { pillPrimary } from "@/components/Field";
import { db, santa } from "@/db";
import { validRecoveryProof } from "@/lib/recovery";
import { confirmRecovery } from "./actions";

export const metadata = { title: "Retrouver mon accès organisateur", robots: { index: false, follow: false }, referrer: "no-referrer" };

type Params = Promise<{ id: string; proof: string }>;

export default function RecoveryPage({ params }: { params: Params }) {
  return <Frame><Suspense fallback={<p className="px-8 text-or-pale/70">Vérification du lien…</p>}><Recovery params={params} /></Suspense></Frame>;
}

async function Recovery({ params }: { params: Params }) {
  const { id, proof } = await params;
  const [event] = /^[a-f0-9-]{36}$/i.test(id)
    ? await db().select({ name: santa.name, hash: santa.organizerTokenHash }).from(santa).where(eq(santa.id, id)).limit(1)
    : [];
  const valid = event && validRecoveryProof(id, proof, event.hash);
  return (
    <main className="mx-auto w-full max-w-[640px] flex-1 px-5 pb-12">
      <PageTitle kicker="Accès organisateur">{valid ? event.name : "Lien expiré ou déjà utilisé"}</PageTitle>
      {valid ? (
        <div className="mt-8 grid gap-6">
          <p className="text-or-pale/80">Confirme pour ouvrir ton tableau de bord avec un nouvel accès privé. Ton ancien lien organisateur sera remplacé. Le tirage et les accès des participants restent inchangés.</p>
          <form action={confirmRecovery.bind(null, id, proof)}>
            <button type="submit" className={pillPrimary}>Ouvrir mon tableau de bord</button>
          </form>
        </div>
      ) : (
        <div className="mt-8 grid justify-items-start gap-6">
          <p className="text-or-pale/80">Demande un nouvel e-mail pour retrouver ton accès organisateur.</p>
          <PillLink href="/mes-secret-santa">Recevoir un nouveau lien</PillLink>
        </div>
      )}
    </main>
  );
}
