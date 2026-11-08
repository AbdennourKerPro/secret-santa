import { List, Plus } from "lucide-react";
import { PillLink } from "@/components/Buttons";
import { Frame } from "@/components/Frame";
import { SnowGlobe } from "@/components/SnowGlobe";

export default function Home() {
  return (
    <Frame glow="center">
      <main className="relative flex flex-1 flex-col items-center px-4 pb-8">
        <h1
          className="pointer-events-none select-none text-center font-display font-extralight uppercase leading-[0.85] tracking-tight text-or-pale [font-size:clamp(4.4rem,19vw,11rem)] [text-shadow:0_0_40px_rgba(255,80,100,0.35)]"
        >
          Joyeux Noël
        </h1>

        <SnowGlobe className="float-slow relative z-10 -mt-[9vw] w-[min(88vw,430px)] drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] sm:-mt-24" />

        <p className="relative z-10 mt-2 max-w-sm text-center text-or-pale/90">
          Tire au sort tes Secret Santa, garde le secret, et laisse les lutins envoyer les invitations.
        </p>

        <nav aria-label="Actions" className="relative z-10 mt-7 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <PillLink href="/nouveau"><Plus size={20} aria-hidden="true" />Nouveau Secret Santa</PillLink>
          <PillLink href="/mes-secret-santa" variant="ghost"><List size={20} aria-hidden="true" />Mes Secret Santa</PillLink>
        </nav>
      </main>
    </Frame>
  );
}
