import Link from "next/link";
import { Gift } from "lucide-react";
import { SleighSky } from "./scenes/SleighSky";

const GLOWS = {
  center: "bg-[radial-gradient(ellipse_at_50%_58%,#d0213f_0%,#7a0e20_32%,#2a060c_68%,#1c0408_100%)]",
  top: "bg-[radial-gradient(ellipse_at_50%_0%,#9b1530_0%,#4a0912_45%,#1c0408_100%)]",
} as const;

/** Dark rounded frame shared by every page, with the gift button home and the sleigh crossing the sky. */
export function Frame({ children, glow = "top" }: { children: React.ReactNode; glow?: keyof typeof GLOWS }) {
  return (
    <div className="flex min-h-dvh flex-col bg-nuit p-3 text-or-pale sm:p-6">
      <div className={`relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-or-pale/25 ${GLOWS[glow]}`}>
        <SleighSky />
        <header className="relative z-10 px-4 py-4 sm:px-7">
          <Link
            href="/"
            aria-label="Accueil"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-or-pale/30 text-or transition hover:-translate-y-0.5 hover:border-or hover:bg-white/5"
          >
            <Gift size={22} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </header>
        <div className="relative z-10 flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

export function PageTitle({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <div>
      {kicker && <p className="font-script text-2xl text-or">{kicker}</p>}
      <h1 className="font-display text-5xl font-extralight uppercase leading-[0.95] tracking-tight text-or-pale sm:text-6xl">{children}</h1>
    </div>
  );
}
