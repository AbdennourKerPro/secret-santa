import Link from "next/link";
import { Gift } from "lucide-react";

export function Banner() {
  return (
    <header className="bg-rouge-profond text-neige">
      <div className="mx-auto flex max-w-[640px] items-center gap-2 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl">
          <Gift size={22} strokeWidth={1.5} className="text-or" aria-hidden="true" />
          Secret Santa
        </Link>
      </div>
      <div className="h-1 bg-or" aria-hidden="true" />
    </header>
  );
}
