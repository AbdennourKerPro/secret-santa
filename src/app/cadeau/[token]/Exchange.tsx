"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Notice, SubmitButton } from "@/components/Field";
import { MascotIcon } from "@/components/mascots/Mascots";
import { saveWishlist, sendMessage, type ActionState } from "./actions";

export type ChatMessage = { id: string; mine: boolean; body: string; when: string };

type Props = {
  token: string;
  receiverName: string;
  myWishlist: string;
  theirWishlist: string;
  /** Chat with the person I drew (I stay anonymous to them). */
  outMessages: ChatMessage[];
  /** Chat with my secret Santa (I never learn who it is). Null if there is none. */
  inMessages: ChatMessage[];
};

const area =
  "mt-2 block w-full resize-none rounded-2xl border border-or-pale/30 bg-white/5 p-4 text-base text-neige [color-scheme:dark] placeholder:text-or-pale/40 focus:border-or focus:outline-none";

type Tab = "mine" | "theirs" | "chat";
const TABS: { id: Tab; label: string }[] = [
  { id: "mine", label: "Ma liste" },
  { id: "theirs", label: "Sa liste" },
  { id: "chat", label: "Messages" },
];

export function Exchange(props: Props) {
  const [tab, setTab] = useState<Tab>("mine");
  const router = useRouter();

  // Light "live" feel: while the chat is on screen, fetch fresh messages every 20 s.
  useEffect(() => {
    if (tab !== "chat") return;
    const t = setInterval(() => {
      if (!document.hidden) router.refresh();
    }, 20_000);
    return () => clearInterval(t);
  }, [tab, router]);

  return (
    <section className="mt-8 w-full text-left" aria-label="Liste au Père Noël et messages">
      <div role="tablist" aria-label="Échanges" className="flex justify-center gap-1 border-b border-or-pale/20">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold uppercase tracking-[0.12em] sm:px-4 transition-colors ${
              tab === t.id ? "border-or text-neige" : "border-transparent text-or-pale/60 hover:text-or-pale"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="pt-6">
        {tab === "mine" && <MyList token={props.token} initial={props.myWishlist} />}
        {tab === "theirs" && <TheirList name={props.receiverName} content={props.theirWishlist} />}
        {tab === "chat" && <Chats {...props} />}
      </div>
    </section>
  );
}

function MyList({ token, initial }: { token: string; initial: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveWishlist.bind(null, token), {});
  return (
    <form action={action} className="grid gap-3">
      <div className="flex items-end gap-3">
        <MascotIcon kind="santa" size={64} />
        <p className="pb-2 text-or-pale/85">Écris ta lettre au Père Noël. Seul ton Père Noël secret pourra la lire.</p>
      </div>
      <label htmlFor="wishlist" className="sr-only">Ma liste au Père Noël</label>
      <textarea id="wishlist" name="content" rows={7} maxLength={1000} defaultValue={initial} placeholder="Un livre de cuisine, des chaussettes rigolotes, du chocolat noir…" className={area} />
      {state.errors?.content && <Notice kind="error">{state.errors.content.join(" ")}</Notice>}
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && <Notice kind="ok">{state.ok}</Notice>}
      <SubmitButton pending={pending} className="justify-self-start">Enregistrer ma liste</SubmitButton>
    </form>
  );
}

function TheirList({ name, content }: { name: string; content: string }) {
  return (
    <div className="grid gap-3">
      <div className="flex items-end gap-3">
        <MascotIcon kind="elf" size={64} />
        <p className="pb-2 text-or-pale/85">La liste de <strong className="text-neige">{name}</strong>, pour t&rsquo;inspirer.</p>
      </div>
      {content ? (
        <p className="whitespace-pre-wrap break-words rounded-2xl border border-or-pale/25 bg-white/5 p-4 text-neige">{content}</p>
      ) : (
        <p className="rounded-2xl border border-dashed border-or-pale/30 p-4 text-or-pale/70">
          {name} n&rsquo;a pas encore écrit sa liste. Tu peux lui glisser un mot dans l&rsquo;onglet Messages.
        </p>
      )}
    </div>
  );
}

function Chats(p: Props) {
  const [side, setSide] = useState<"out" | "in">("out");
  const pillBase = "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors";
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Conversation">
        <button type="button" aria-pressed={side === "out"} onClick={() => setSide("out")} className={`${pillBase} ${side === "out" ? "bg-neige text-rouge-profond" : "border border-or-pale/40 text-or-pale"}`}>
          À {p.receiverName}
        </button>
        <button type="button" aria-pressed={side === "in"} onClick={() => setSide("in")} className={`${pillBase} ${side === "in" ? "bg-neige text-rouge-profond" : "border border-or-pale/40 text-or-pale"}`}>
          Mon Père Noël secret
        </button>
      </div>
      {side === "out" ? (
        <Thread
          key="out" token={p.token} role="out" messages={p.outMessages}
          intro={`${p.receiverName} te voit comme « son Père Noël secret » : il ou elle ne saura pas que c'est toi.`}
          theirLabel={p.receiverName} empty={`Pose une question à ${p.receiverName} ou glisse-lui un indice, en restant anonyme.`}
        />
      ) : (
        <Thread
          key="in" token={p.token} role="in" messages={p.inMessages}
          intro="Ton Père Noël secret peut t'écrire. Tu peux lui répondre sans savoir qui il est."
          theirLabel="Ton Père Noël secret" empty="Rien pour l'instant. Ton Père Noël secret n'a pas encore écrit, mais tu peux lui parler en premier."
        />
      )}
    </div>
  );
}

function Thread({ token, role, messages, intro, theirLabel, empty }: {
  token: string; role: "out" | "in"; messages: ChatMessage[]; intro: string; theirLabel: string; empty: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(sendMessage.bind(null, token, role), {});
  const formRef = useRef<HTMLFormElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  return (
    <div className="grid gap-3">
      <p className="text-center text-sm text-or-pale/75">{intro}</p>
      <div className="max-h-[22rem] min-h-24 overflow-y-auto rounded-2xl border border-or-pale/20 bg-black/15 p-3" aria-live="polite">
        {messages.length === 0 ? (
          <p className="p-3 text-center text-or-pale/60">{empty}</p>
        ) : (
          <ul className="grid gap-2">
            {messages.map((m) => (
              <li key={m.id} className={`flex flex-col ${m.mine ? "items-end" : "items-start"}`}>
                <p className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 ${m.mine ? "rounded-br-sm bg-rouge text-neige" : "rounded-bl-sm bg-white/10 text-neige"}`}>{m.body}</p>
                <span className="mt-0.5 px-1 text-xs text-or-pale/50">{m.mine ? "Toi" : theirLabel} · {m.when}</span>
              </li>
            ))}
          </ul>
        )}
        <div ref={endRef} />
      </div>
      <form ref={formRef} action={action} className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor={`msg-${role}`} className="sr-only">Ton message</label>
          <textarea id={`msg-${role}`} name="body" rows={2} maxLength={500} required placeholder="Ton message…" className={area.replace("mt-2 ", "")} />
        </div>
        <button type="submit" disabled={pending} aria-label="Envoyer le message" className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neige text-rouge-profond transition hover:-translate-y-0.5 hover:bg-or-pale disabled:opacity-60">
          <Send size={20} aria-hidden="true" />
        </button>
      </form>
      {state.errors?.body && <Notice kind="error">{state.errors.body.join(" ")}</Notice>}
      {state.error && <Notice kind="error">{state.error}</Notice>}
    </div>
  );
}
