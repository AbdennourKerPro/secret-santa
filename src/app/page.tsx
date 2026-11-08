import Link from "next/link";
import { CalendarDays, Gift, Mail } from "lucide-react";
import { Banner } from "@/components/Banner";

const steps = [
  { icon: CalendarDays, title: "Crée l'événement", text: "Date d'échange, budget et petit mot pour tout le monde." },
  { icon: Gift, title: "Ajoute les participants", text: "Un nom et une adresse e-mail suffisent." },
  { icon: Mail, title: "Lance le tirage", text: "Chacun reçoit un lien secret pour découvrir son destinataire." },
];

export default function Home() {
  return (
    <>
      <Banner />
      <section className="bg-rouge-profond pb-14 pt-6 text-neige">
        <div className="mx-auto max-w-[640px] px-4 text-center">
          <p className="font-script text-3xl text-or-pale">Joyeux Noël</p>
          <h1 className="mt-2 text-4xl leading-tight sm:text-5xl">Organise ton Secret Santa en toute discrétion</h1>
          <p className="mx-auto mt-4 max-w-md text-or-pale">
            Un tirage au sort équitable, confidentiel, et des e-mails envoyés pour toi.
          </p>
          <Link
            href="/nouveau"
            className="mt-8 inline-flex h-12 items-center rounded-xl bg-neige px-6 font-semibold text-rouge-profond transition hover:-translate-y-0.5 hover:bg-or-pale"
          >
            Organiser un Secret Santa
          </Link>
        </div>
      </section>
      <main className="mx-auto w-full max-w-[640px] flex-1 px-4 py-10">
        <ol className="grid gap-4">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="rise-in rounded-2xl border-t border-or bg-neige p-5 shadow-sm"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start gap-4">
                <s.icon className="mt-1 shrink-0 text-rouge" size={24} strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h2 className="text-lg">{i + 1}. {s.title}</h2>
                  <p className="mt-1 text-encre-douce">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
