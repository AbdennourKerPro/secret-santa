"use client";

import { useActionState, useState } from "react";
import { Pencil } from "lucide-react";
import { Field, inputClass, Notice, SubmitButton } from "@/components/Field";
import { updateEvent, type ActionState } from "./actions";

type Props = { token: string; name: string; exchangeDate: string; budget: number; message: string; drawn: boolean };

export function EditEvent(props: Props) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!open) {
    return (
      <div className="mt-3">
        <button type="button" onClick={() => { setSaved(false); setOpen(true); }} className="inline-flex items-center gap-2 rounded-full border border-or-pale/40 px-4 py-1.5 text-sm font-semibold text-or-pale transition hover:border-or-pale hover:bg-white/5">
          <Pencil size={14} aria-hidden="true" />Modifier les infos
        </button>
        {saved && <p role="status" className="mt-2 text-sm font-semibold text-or">Informations mises à jour.</p>}
      </div>
    );
  }
  // The form is its own component so its state (typed values, errors) starts fresh on every opening.
  return <EditForm {...props} onClose={(didSave) => { setSaved(didSave); setOpen(false); }} />;
}

function EditForm({ token, name, exchangeDate, budget, message, drawn, onClose }: Props & { onClose: (saved: boolean) => void }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(async (prev, fd) => {
    const next = await updateEvent(token, prev, fd);
    if (next.ok) onClose(true);
    return next;
  }, {});
  const e = state.errors ?? {};
  const v = state.values ?? {};

  return (
    <form action={action} className="mt-4 grid gap-5 rounded-3xl border border-or-pale/20 bg-white/5 p-5" noValidate>
      <Field label="Nom de l'événement" name="edit-name" errors={e.name}>
        <input id="edit-name" name="name" defaultValue={v.name ?? name} maxLength={80} required className={inputClass} aria-invalid={!!e.name} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date de l'échange" name="edit-date" errors={e.exchangeDate}>
          <input id="edit-date" name="exchangeDate" type="date" defaultValue={v.exchangeDate ?? exchangeDate} required className={inputClass} aria-invalid={!!e.exchangeDate} />
        </Field>
        <Field label="Budget par cadeau (€)" name="edit-budget" errors={e.budget}>
          <input id="edit-budget" name="budget" type="number" inputMode="numeric" min={1} max={10000} defaultValue={v.budget ?? budget} required className={inputClass} aria-invalid={!!e.budget} />
        </Field>
      </div>
      <Field label="Message pour les participants" name="edit-message" errors={e.message}>
        <textarea id="edit-message" name="message" defaultValue={v.message ?? message} maxLength={500} rows={2} className={`${inputClass} h-auto resize-none py-2`} />
      </Field>
      {drawn && <p className="text-sm text-or-pale/65">Les participants verront les nouvelles infos sur leur page. Les e-mails déjà envoyés ne changent pas : préviens-les si la date ou le budget bouge.</p>}
      {state.error && <Notice kind="error">{state.error}</Notice>}
      <div className="flex flex-wrap gap-3">
        <SubmitButton pending={pending} className="!h-11 !px-6 !text-base">Enregistrer</SubmitButton>
        <button type="button" onClick={() => onClose(false)} className="h-11 rounded-full px-5 text-or-pale/80 hover:text-neige">Annuler</button>
      </div>
    </form>
  );
}
