import { Frame, PageTitle } from "@/components/Frame";
import { PillLink } from "@/components/Buttons";
import { MascotIcon } from "@/components/mascots/Mascots";

export default function NotFound() {
  return (
    <Frame glow="center">
      <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-5 pb-16 text-center">
        <div className="relative" aria-hidden="true">
          <MascotIcon kind="reindeer" size={150} />
          <span className="absolute -right-2 -top-2 font-display text-5xl font-extralight text-or">?</span>
        </div>
        <PageTitle>Lien introuvable</PageTitle>
        <p className="text-or-pale/80">Le renne s&rsquo;est perdu dans la neige. Ce lien n&rsquo;existe pas ou n&rsquo;est plus valable : vérifie l&rsquo;e-mail le plus récent.</p>
        <PillLink href="/">Retour à l&rsquo;accueil</PillLink>
      </main>
    </Frame>
  );
}
