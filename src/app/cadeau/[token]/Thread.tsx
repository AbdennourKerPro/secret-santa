"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Notice } from "@/components/Field";
import { sendMessage, type ActionState } from "./actions";
import { area } from "./Wishlists";

export type ChatMessage = { id: string; mine: boolean; body: string; when: string };

export function Thread({ token, role, messages, theirLabel, empty }: {
  token: string; role: "out" | "in"; messages: ChatMessage[]; theirLabel: string; empty: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(sendMessage.bind(null, token, role), {});
  const formRef = useRef<HTMLFormElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Light "live" feel: while the chat is on screen, fetch fresh messages every 20 s.
  useEffect(() => {
    const t = setInterval(() => {
      if (!document.hidden) router.refresh();
    }, 20_000);
    return () => clearInterval(t);
  }, [router]);
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  return (
    <div className="grid gap-3">
      <div className="max-h-[50dvh] min-h-40 overflow-y-auto rounded-2xl border border-or-pale/20 bg-black/15 p-3" aria-live="polite">
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
          <textarea id={`msg-${role}`} name="body" rows={2} maxLength={500} required placeholder="Ton message…" className={area} />
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
