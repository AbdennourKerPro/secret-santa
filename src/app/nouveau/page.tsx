import { Frame, PageTitle } from "@/components/Frame";
import { ElfWorkshop } from "@/components/scenes/ElfWorkshop";
import { CreateForm } from "./CreateForm";

export const metadata = { title: "Nouveau Secret Santa" };

export default function NewSanta() {
  return (
    <Frame>
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
        <div className="lg:sticky lg:top-10">
          <PageTitle kicker="On emballe ?">Nouveau Secret Santa</PageTitle>
          <ElfWorkshop className="mx-auto mt-6 w-full max-w-[360px] lg:max-w-[460px]" />
        </div>
        <CreateForm />
      </main>
    </Frame>
  );
}
