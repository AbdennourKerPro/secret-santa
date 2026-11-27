import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Frame } from "@/components/Frame";
import { MascotIcon } from "@/components/mascots/Mascots";
import { wishlistOf } from "@/lib/queries";
import { ChatPage } from "../ChatPage";
import { loadParticipant, loadThread } from "../data";
import { Thread } from "../Thread";
import { TheirList } from "../Wishlists";

export const metadata = { title: "Ton tiré au sort", robots: { index: false } };

export default function ReceiverChatPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Frame>
      <Suspense fallback={<p className="p-8 text-center text-or-pale/70">Chargement…</p>}>
        <ReceiverChat params={params} />
      </Suspense>
    </Frame>
  );
}

async function ReceiverChat({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { p, receiver } = await loadParticipant(token);
  if (!p.openedAt) redirect(`/cadeau/${token}`); // the name stays hidden until the gift is opened
  const [messages, theirWishlist] = await Promise.all([loadThread(p.id, "out"), wishlistOf(receiver.id)]);

  return (
    <ChatPage
      kicker="Écris en secret à"
      title={receiver.name}
      intro={`${receiver.name} te voit comme « son Père Noël secret »\u00a0: il ou elle ne saura pas que c'est toi.`}
      mascot={<MascotIcon kind="elf" size={76} />}
      listLabel="Sa liste"
      messages={
        <Thread
          token={token} role="out" messages={messages} theirLabel={receiver.name}
          empty={`Pose une question à ${receiver.name} ou glisse-lui un indice, en restant anonyme.`}
        />
      }
      list={<TheirList name={receiver.name} content={theirWishlist} />}
    />
  );
}
