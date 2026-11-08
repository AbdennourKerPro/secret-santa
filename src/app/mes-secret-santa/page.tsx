import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { PillLink } from "@/components/Buttons";
import { SavedList } from "./SavedList";

export const metadata = { title: "Mes Secret Santa", robots: { index: false } };

export default function MySantas() {
  return (
    <div className="flex min-h-dvh flex-col bg-nuit p-3 text-or-pale sm:p-6">
      <div className="relative flex flex-1 flex-col rounded-[28px] border border-or-pale/25 bg-[radial-gradient(ellipse_at_50%_0%,#9b1530_0%,#4a0912_45%,#1c0408_100%)]">
        <header className="flex items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:text-neige">
            <ArrowLeft size={18} aria-hidden="true" />Accueil
          </Link>
        </header>
        <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pb-10">
          <h1 className="font-display text-5xl font-extralight uppercase tracking-tight text-or-pale sm:text-6xl">Mes Secret Santa</h1>
          <p className="mb-6 mt-2 text-or-pale/80">Retrouve les tableaux de bord de tes événements.</p>
          <SavedList />
          <div className="mt-8 flex justify-center">
            <PillLink href="/nouveau"><Plus size={20} aria-hidden="true" />Nouveau Secret Santa</PillLink>
          </div>
          <p className="mt-6 text-center text-sm text-or-pale/60">
            La liste est gardée sur cet appareil uniquement. Sur un autre appareil, utilise le lien reçu par e-mail.
          </p>
        </main>
      </div>
    </div>
  );
}
