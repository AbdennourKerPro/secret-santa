import { Card, Shell } from "@/components/Shell";
import { CreateForm } from "./CreateForm";

export const metadata = { title: "Nouveau Secret Santa" };

export default function NewSanta() {
  return (
    <Shell>
      <h1 className="mb-1 text-3xl">Nouveau Secret Santa</h1>
      <p className="mb-6 text-encre-douce">Quelques infos, et tu pourras ajouter les participants.</p>
      <Card>
        <CreateForm />
      </Card>
    </Shell>
  );
}
