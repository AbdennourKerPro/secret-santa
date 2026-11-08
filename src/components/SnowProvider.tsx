"use client";

import { Snowflake } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Snow } from "./Snow";

const KEY = "santa-snow";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function read(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

export function SnowLayer() {
  const on = useSyncExternalStore(subscribe, read, () => true);
  const toggle = () => {
    try {
      localStorage.setItem(KEY, on ? "off" : "on");
    } catch {}
    listeners.forEach((l) => l());
  };
  return (
    <>
      <Snow enabled={on} />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? "Couper la neige" : "Activer la neige"}
        className="fixed bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-neige text-rouge shadow-md ring-1 ring-or/60 hover:bg-or-pale"
      >
        <Snowflake size={22} strokeWidth={1.5} className={on ? "" : "opacity-40"} />
      </button>
    </>
  );
}
