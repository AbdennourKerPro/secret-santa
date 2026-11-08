export const inputClass =
  "mt-1 block h-12 w-full rounded-xl border border-encre-douce bg-neige px-3 text-encre focus-visible:outline-2 focus-visible:outline-or";

export function Field({
  label, name, errors, children, hint,
}: { label: string; name: string; errors?: string[]; children: React.ReactNode; hint?: string }) {
  const id = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="block font-semibold">{label}</label>
      {hint && <p className="text-sm text-encre-douce">{hint}</p>}
      {children}
      {errors?.length ? (
        <p id={id} role="alert" className="mt-1 text-sm font-semibold text-rouge-profond">{errors.join(" ")}</p>
      ) : null}
    </div>
  );
}

export function SubmitButton({ children, pending, variant = "primary" }: { children: React.ReactNode; pending?: boolean; variant?: "primary" | "secondary" }) {
  const base = "inline-flex h-12 items-center justify-center rounded-xl px-6 font-semibold transition active:translate-y-px disabled:opacity-60";
  const style = variant === "primary"
    ? "bg-rouge text-neige hover:-translate-y-0.5 hover:bg-rouge-profond"
    : "border-2 border-rouge text-rouge hover:bg-or-pale";
  return <button type="submit" disabled={pending} className={`${base} ${style}`}>{pending ? "Un instant…" : children}</button>;
}
