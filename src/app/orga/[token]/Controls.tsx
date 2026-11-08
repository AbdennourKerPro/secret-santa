"use client";

import { useActionState } from "react";
import { Plus } from "lucide-react";
import { inputClass, Notice, SubmitButton } from "@/components/Field";
import { addParticipant, runDraw, type ActionState } from "./actions";

export function AddParticipantForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addParticipant.bind(null, token), {});
  const e = state.errors ?? {};
  return (
    <form action={action} className="grid gap-3" noValidate key={state.ok ?? "form"}>
      <div className="flex items-end gap-3">
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="sr-only">Prénom</label>
            <input id="name" name="name" required maxLength={60} placeholder="Prénom" className={inputClass} aria-invalid={!!e.name} />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">E-mail</label>
            <input id="email" name="email" type="email" required maxLength={200} placeholder="E-mail" className={inputClass} aria-invalid={!!e.email} />
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          aria-label="Ajouter ce participant"
          className="mb-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neige text-rouge-profond transition hover:-translate-y-0.5 hover:bg-or-pale disabled:opacity-60"
        >
          <Plus size={22} aria-hidden="true" />
        </button>
      </div>
      {(e.name || e.email) && <Notice kind="error">{[...(e.name ?? []), ...(e.email ?? [])].join(" ")}</Notice>}
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && <Notice kind="ok">{state.ok}</Notice>}
    </form>
  );
}

export function DrawButton({ token, count }: { token: string; count: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(runDraw.bind(null, token), {});
  return (
    <form
      action={action}
      onSubmit={(ev) => {
        if (!window.confirm(`Lancer le tirage avec ${count} participants ? Il sera définitif et chacun recevra son e-mail.`)) ev.preventDefault();
      }}
      className="grid justify-items-center gap-3"
    >
      {state.error && <Notice kind="error">{state.error}</Notice>}
      <SubmitButton pending={pending}>Lancer le tirage</SubmitButton>
    </form>
  );
}
