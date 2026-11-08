"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

/** Keeps the wish lists and chats out of sight until the gift is opened: they would name the person you drew. */
export function GiftExperience({ token, receiverName, children }: { token: string; receiverName: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Reveal token={token} receiverName={receiverName} onOpen={() => setOpen(true)} />
      {open && <div className="w-full">{children}</div>}
    </>
  );
}
