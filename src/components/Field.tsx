export const inputClass =
  "mt-1 block h-12 w-full border-0 border-b border-or-pale/35 bg-transparent px-0 text-lg text-neige [color-scheme:dark] placeholder:text-or-pale/35 transition-colors focus:border-b-2 focus:border-or focus:outline-none focus-visible:outline-none";

export function Field({
  label, name, errors, children, hint,
}: { label: string; name: string; errors?: string[]; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-[0.18em] text-or-pale/70">{label}</label>
      {children}
      {hint && <p className="mt-1 text-sm text-or-pale/55">{hint}</p>}
      {errors?.length ? (
        <p role="alert" className="mt-1 text-sm font-semibold text-[#ffb3bd]">{errors.join(" ")}</p>
      ) : null}
    </div>
  );
}

const pill = "inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-lg font-semibold transition active:translate-y-px disabled:opacity-60";
export const pillPrimary = `${pill} bg-neige text-rouge-profond shadow-[0_10px_40px_-10px_rgba(255,59,78,0.8)] hover:-translate-y-0.5 hover:bg-or-pale`;
export const pillGhost = `${pill} border border-or-pale/60 text-or-pale hover:-translate-y-0.5 hover:border-or-pale hover:bg-white/5`;

export function SubmitButton({ children, pending, variant = "primary", className = "" }: { children: React.ReactNode; pending?: boolean; variant?: "primary" | "secondary"; className?: string }) {
  return (
    <button type="submit" disabled={pending} className={`${variant === "primary" ? pillPrimary : pillGhost} ${className}`}>
      {pending ? "Un instant…" : children}
    </button>
  );
}

export function Notice({ kind, children }: { kind: "ok" | "error"; children: React.ReactNode }) {
  return kind === "error" ? (
    <p role="alert" className="font-semibold text-[#ffb3bd]">{children}</p>
  ) : (
    <p role="status" className="font-semibold text-or">{children}</p>
  );
}
