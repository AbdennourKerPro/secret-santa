import Link from "next/link";

export function PillLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" }) {
  const base = "inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-8 text-lg font-semibold transition sm:w-auto";
  const style =
    variant === "primary"
      ? "bg-neige text-rouge-profond shadow-[0_10px_40px_-10px_rgba(255,59,78,0.8)] hover:-translate-y-0.5 hover:bg-or-pale"
      : "border border-or-pale/60 text-or-pale backdrop-blur-sm hover:-translate-y-0.5 hover:border-or-pale hover:bg-white/5";
  return (
    <Link href={href} className={`${base} ${style}`}>
      {children}
    </Link>
  );
}
