"use client";

import { useActionState } from "react";
import { Field, inputClass, SubmitButton } from "@/components/Field";
import { addParticipant, runDraw, type ActionState } from "./actions";

export function AddParticipantForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addParticipant.bind(null, token), {});
  return (
    <form action={action} className="grid gap-4" noValidate key={state.ok ?? "form"}>
      <Field label="Prénom" name="name" errors={state.errors?.name}>
        <input id="name" name="name" required maxLength={60} className={inputClass} />
      </Field>
      <Field label="E-mail" name="email" errors={state.errors?.email}>
        <input id="email" name="email" type="email" required maxLength={200} className={inputClass} />
      </Field>
      {state.error && <p role="alert" className="font-semibold text-rouge-profond">{state.error}</p>}
      {state.ok && <p role="status" className="font-semibold text-encre">{state.ok}</p>}
      <div><SubmitButton pending={pending} variant="secondary">Ajouter</SubmitButton></div>
    </form>
  );
}

export function DrawButton({ token, count }: { token: string; count: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(runDraw.bind(null, token), {});
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Lancer le tirage avec ${count} participants ? Il sera définitif et chacun recevra son e-mail.`)) e.preventDefault();
      }}
      className="grid gap-3"
    >
      {state.error && <p role="alert" className="font-semibold text-rouge-profond">{state.error}</p>}
      {state.ok && <p role="status" className="font-semibold">{state.ok}</p>}
      <div><SubmitButton pending={pending}>Lancer le tirage</SubmitButton></div>
    </form>
  );
}
