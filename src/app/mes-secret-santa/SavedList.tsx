"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CalendarDays, ChevronRight, X } from "lucide-react";
import { MascotIcon } from "@/components/mascots/Mascots";
import { forgetSanta, getSaved, getServerSaved, subscribeSaved } from "@/lib/mySantas";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

export function SavedList() {
  const list = useSyncExternalStore(subscribeSaved, getSaved, getServerSaved);

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <MascotIcon kind="elf" size={120} />
        <p className="font-serif text-xl text-neige">Aucun Secret Santa sur cet appareil</p>
        <p className="max-w-sm text-or-pale/80">
          Ceux que tu crées ou ouvres depuis le lien de ton e-mail apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {list.map((s, i) => (
        <li key={s.path} className="rise-in flex items-stretch overflow-hidden rounded-2xl bg-neige text-encre shadow-lg" style={{ animationDelay: `${i * 60}ms` }}>
          <Link href={s.path} className="flex min-w-0 flex-1 items-center gap-4 p-4 hover:bg-or-pale/40">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rouge-profond">
              <MascotIcon kind={(["santa", "reindeer", "elf"] as const)[i % 3]} size={40} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-serif text-lg">{s.name}</span>
              <span className="flex items-center gap-1 text-sm text-encre-douce">
                <CalendarDays size={14} aria-hidden="true" />
                {fmt(s.exchangeDate)}
              </span>
            </span>
            <ChevronRight className="text-rouge" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => forgetSanta(s.path)}
            aria-label={`Retirer ${s.name} de cette liste`}
            className="flex w-12 items-center justify-center border-l border-or-pale text-encre-douce hover:bg-or-pale/40 hover:text-rouge"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
