"use client";

import { useActionState } from "react";
import { Field, inputClass, SubmitButton } from "@/components/Field";
import { createSanta, type CreateState } from "./actions";

export function CreateForm() {
  const [state, action, pending] = useActionState<CreateState, FormData>(createSanta, {});
  const v = state.values ?? {};
  const e = state.errors ?? {};
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Field label="Nom de l'événement" name="name" errors={e.name}>
        <input id="name" name="name" defaultValue={v.name} maxLength={80} required placeholder="Noël en famille 2026" className={inputClass} aria-invalid={!!e.name} />
      </Field>
      <Field label="Date de l'échange des cadeaux" name="exchangeDate" errors={e.exchangeDate}>
        <input id="exchangeDate" name="exchangeDate" type="date" defaultValue={v.exchangeDate} required className={inputClass} aria-invalid={!!e.exchangeDate} />
      </Field>
      <Field label="Budget par cadeau (€)" name="budget" errors={e.budget}>
        <input id="budget" name="budget" type="number" inputMode="numeric" min={1} max={10000} defaultValue={v.budget ?? "20"} required className={inputClass} aria-invalid={!!e.budget} />
      </Field>
      <Field label="Message pour les participants (facultatif)" name="message" errors={e.message}>
        <textarea id="message" name="message" defaultValue={v.message} maxLength={500} rows={3} className={`${inputClass} h-auto py-2`} placeholder="Rendez-vous chez Mamie à 19 h !" />
      </Field>
      <Field label="Ton prénom" name="organizerName" errors={e.organizerName}>
        <input id="organizerName" name="organizerName" defaultValue={v.organizerName} maxLength={60} required autoComplete="given-name" className={inputClass} aria-invalid={!!e.organizerName} />
      </Field>
      <Field label="Ton e-mail" name="organizerEmail" errors={e.organizerEmail} hint="Tu y recevras le lien secret de ton tableau de bord.">
        <input id="organizerEmail" name="organizerEmail" type="email" defaultValue={v.organizerEmail} maxLength={200} required autoComplete="email" className={inputClass} aria-invalid={!!e.organizerEmail} />
      </Field>
      <label className="flex items-center gap-3">
        <input type="checkbox" name="organizerPlays" defaultChecked className="h-5 w-5 accent-[var(--rouge-noel)]" />
        Je participe aussi au tirage
      </label>
      <SubmitButton pending={pending}>Créer mon Secret Santa</SubmitButton>
    </form>
  );
}
