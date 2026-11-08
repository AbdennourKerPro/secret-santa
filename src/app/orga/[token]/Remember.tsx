"use client";

import { useEffect } from "react";
import { rememberSanta } from "@/lib/mySantas";

/** Adds this dashboard to "Mes Secret Santa" on this device. */
export function Remember({ path, name, exchangeDate }: { path: string; name: string; exchangeDate: string }) {
  useEffect(() => {
    rememberSanta({ path, name, exchangeDate });
  }, [path, name, exchangeDate]);
  return null;
}
