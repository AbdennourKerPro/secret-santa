import { Suspense } from "react";
import { BottomNav } from "./BottomNav";
import { loadParticipant } from "./data";
import { RevealProvider } from "./RevealState";

export default function ParticipantLayout({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
  return (
    <RevealProvider>
      {children}
      <Suspense fallback={null}>
        <Nav params={params} />
      </Suspense>
    </RevealProvider>
  );
}

async function Nav({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { p, receiver } = await loadParticipant(token);
  return <BottomNav token={token} receiverName={receiver.name} openedBefore={!!p.openedAt} />;
}
