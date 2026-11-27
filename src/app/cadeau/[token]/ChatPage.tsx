"use client";

import { useState } from "react";

/** A dedicated conversation page: a header, then a switch between the messages and the matching wish list. */
export function ChatPage({ kicker, title, intro, mascot, listLabel, messages, list }: {
  kicker: string; title: string; intro: string; mascot: React.ReactNode; listLabel: string;
  messages: React.ReactNode; list: React.ReactNode;
}) {
  const [tab, setTab] = useState<"messages" | "list">("messages");
  const tabs = [
    { id: "messages" as const, label: "Messages" },
    { id: "list" as const, label: listLabel },
  ];
  return (
    <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col px-5 pb-32">
      <div className="flex items-end gap-4">
        <div className="shrink-0">{mascot}</div>
        <div className="min-w-0 pb-1">
          <p className="font-script text-2xl text-or">{kicker}</p>
          <h1 className="break-words font-display text-4xl font-extralight uppercase leading-none tracking-tight text-or-pale sm:text-5xl">{title}</h1>
        </div>
      </div>
      <p className="mt-3 text-sm text-or-pale/75">{intro}</p>

      <div role="tablist" aria-label="Contenu" className="mt-5 grid grid-cols-2 gap-1 rounded-full border border-or-pale/25 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${tab === t.id ? "bg-neige text-rouge-profond" : "text-or-pale/75 hover:text-or-pale"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="pt-5">
        {tab === "messages" ? messages : list}
      </div>
    </main>
  );
}
