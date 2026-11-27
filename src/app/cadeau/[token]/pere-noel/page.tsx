import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Frame } from "@/components/Frame";
import { MascotIcon } from "@/components/mascots/Mascots";
import { wishlistOf } from "@/lib/queries";
import { ChatPage } from "../ChatPage";
import { loadParticipant, loadThread } from "../data";
import { Thread } from "../Thread";
import { MyList } from "../Wishlists";

export const metadata = { title: "Mon Père Noël secret", robots: { index: false } };

export default function SantaChatPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Frame>
      <Suspense fallback={<p className="p-8 text-center text-or-pale/70">Chargement…</p>}>
        <SantaChat params={params} />
      </Suspense>
    </Frame>
  );
}

async function SantaChat({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { p } = await loadParticipant(token);
  if (!p.openedAt) redirect(`/cadeau/${token}`); // open the gift first
  const [messages, myWishlist] = await Promise.all([loadThread(p.id, "in"), wishlistOf(p.id)]);

  return (
    <ChatPage
      kicker="Discute avec"
      title="Ton Père Noël secret"
      intro="Ton Père Noël secret peut t'écrire et lire ta liste. Tu peux lui répondre sans savoir qui il est."
      mascot={<MascotIcon kind="santa" size={84} />}
      listLabel="Ma liste"
      messages={
        <Thread
          token={token} role="in" messages={messages} theirLabel="Ton Père Noël secret"
          empty="Rien pour l'instant. Ton Père Noël secret n'a pas encore écrit, mais tu peux lui parler en premier."
        />
      }
      list={<MyList token={token} initial={myWishlist} />}
    />
  );
}
