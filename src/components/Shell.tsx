import { Banner } from "./Banner";

export function Shell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <>
      <Banner />
      <main className={`mx-auto w-full flex-1 px-4 py-8 ${wide ? "max-w-[760px]" : "max-w-[640px]"}`}>{children}</main>
    </>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rise-in rounded-2xl border-t border-or bg-neige p-5 shadow-sm ${className}`}>{children}</section>;
}
