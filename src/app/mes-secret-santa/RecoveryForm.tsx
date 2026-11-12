"use client";

import { useActionState } from "react";
import { Field, inputClass, Notice, SubmitButton } from "@/components/Field";
import { recoverOrganizer } from "./actions";

export function RecoveryForm() {
  const [state, action, pending] = useActionState(recoverOrganizer, {});
  return (
    <section className="mt-10 rounded-3xl border border-or-pale/20 bg-white/5 p-6" aria-labelledby="recovery-title">
      <h2 id="recovery-title" className="font-serif text-xl text-neige">Retrouver mes accès organisateur</h2>
      <p className="mt-2 text-or-pale/80">Un autre navigateur ou un e-mail perdu ? Reçois un lien d’accès pour chacun des Secret Santa que tu organises, sans mot de passe.</p>
      <form action={action} className="mt-5 grid gap-5">
        <Field label="Ton e-mail organisateur" name="recoveryEmail">
          <input id="recoveryEmail" name="recoveryEmail" type="email" required maxLength={200} autoComplete="email" defaultValue={state.email} className={inputClass} />
        </Field>
        {state.error && <Notice kind="error">{state.error}</Notice>}
        {state.ok && <Notice kind="ok">{state.ok}</Notice>}
        <SubmitButton pending={pending}>Recevoir mes liens d’accès</SubmitButton>
      </form>
    </section>
  );
}
