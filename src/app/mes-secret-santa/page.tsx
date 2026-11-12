import { Plus } from "lucide-react";
import { PillLink } from "@/components/Buttons";
import { Frame, PageTitle } from "@/components/Frame";
import { MascotIcon } from "@/components/mascots/Mascots";
import { SavedList } from "./SavedList";
import { RecoveryForm } from "./RecoveryForm";

export const metadata = { title: "Mes Secret Santa", robots: { index: false } };

export default function MySantas() {
  return (
    <Frame>
      <main className="mx-auto w-full max-w-[640px] flex-1 px-5 pb-12">
        <PageTitle kicker="Ta hotte">Mes Secret Santa</PageTitle>
        <div className="mt-8"><SavedList /></div>
        <RecoveryForm />
        <div className="mt-10 flex justify-center">
          <PillLink href="/nouveau"><Plus size={20} aria-hidden="true" />Nouveau Secret Santa</PillLink>
        </div>
        <p className="mt-6 text-center text-sm text-or-pale/55">
          La liste est gardée dans ce navigateur uniquement. Pour retrouver tes événements ailleurs, utilise la récupération par e-mail ci-dessus.
        </p>
        <div className="mt-10 flex items-end justify-center gap-2 border-b border-or-pale/20 pb-1" aria-hidden="true">
          <MascotIcon kind="reindeer" size={110} />
          <MascotIcon kind="santa" size={130} />
          <MascotIcon kind="elf" size={100} />
        </div>
      </main>
    </Frame>
  );
}
