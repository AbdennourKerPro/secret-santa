"use client";

import { createContext, useContext, useState } from "react";

/**
 * Remembers, for this visit, that the gift was just opened, so the bottom menu can appear
 * without a reload. Across visits the truth is the server's participant.opened_at.
 */
const Ctx = createContext<{ revealed: boolean; setRevealed: (v: boolean) => void }>({ revealed: false, setRevealed: () => {} });

export function RevealProvider({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  return <Ctx.Provider value={{ revealed, setRevealed }}>{children}</Ctx.Provider>;
}

export const useReveal = () => useContext(Ctx);
