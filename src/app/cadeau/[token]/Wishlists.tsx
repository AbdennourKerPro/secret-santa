"use client";

import { useActionState } from "react";
import { Notice, SubmitButton } from "@/components/Field";
import { saveWishlist, type ActionState } from "./actions";

export const area =
  "block w-full resize-none rounded-2xl border border-or-pale/30 bg-white/5 p-4 text-base text-neige [color-scheme:dark] placeholder:text-or-pale/40 focus:border-or focus:outline-none";

export function MyList({ token, initial }: { token: string; initial: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveWishlist.bind(null, token), {});
  return (
    <form action={action} className="grid gap-3">
      <p className="text-or-pale/85">Écris ta lettre au Père Noël. Seul ton Père Noël secret pourra la lire.</p>
      <label htmlFor="wishlist" className="sr-only">Ma liste au Père Noël</label>
      <textarea id="wishlist" name="content" rows={7} maxLength={1000} defaultValue={initial} placeholder="Un livre de cuisine, des chaussettes rigolotes, du chocolat noir…" className={area} />
      {state.errors?.content && <Notice kind="error">{state.errors.content.join(" ")}</Notice>}
      {state.error && <Notice kind="error">{state.error}</Notice>}
      {state.ok && <Notice kind="ok">{state.ok}</Notice>}
      <SubmitButton pending={pending} className="justify-self-start">Enregistrer ma liste</SubmitButton>
    </form>
  );
}

export function TheirList({ name, content }: { name: string; content: string }) {
  return (
    <div className="grid gap-3">
      <p className="text-or-pale/85">La liste de <strong className="text-neige">{name}</strong>, pour t&rsquo;inspirer.</p>
      {content ? (
        <p className="whitespace-pre-wrap break-words rounded-2xl border border-or-pale/25 bg-white/5 p-4 text-neige">{content}</p>
      ) : (
        <p className="rounded-2xl border border-dashed border-or-pale/30 p-4 text-or-pale/70">
          {name} n&rsquo;a pas encore écrit sa liste. Tu peux lui glisser un mot dans Messages.
        </p>
      )}
    </div>
  );
}
