import Link from "next/link";
import { pillGhost, pillPrimary } from "./Field";

export function PillLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <Link href={href} className={`${variant === "primary" ? pillPrimary : pillGhost} w-full sm:w-auto`}>
      {children}
    </Link>
  );
}
