"use client";

/**
 * The organizer has no account: the dashboards they opened on this device are
 * remembered in localStorage (name, date, private link). Nothing leaves the browser.
 */
export type SavedSanta = { path: string; name: string; exchangeDate: string; savedAt: number };

const KEY = "santa-mes-evenements";
const listeners = new Set<() => void>();
let cacheRaw: string | null = null;
let cache: SavedSanta[] = [];
const EMPTY: SavedSanta[] = [];

function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function getSaved(): SavedSanta[] {
  const raw = readRaw();
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

export const getServerSaved = () => EMPTY;

function write(list: SavedSanta[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
  listeners.forEach((l) => l());
}

export function rememberSanta(entry: Omit<SavedSanta, "savedAt">) {
  const rest = getSaved().filter((s) => s.path !== entry.path);
  write([{ ...entry, savedAt: Date.now() }, ...rest].slice(0, 50));
}

export function forgetSanta(path: string) {
  write(getSaved().filter((s) => s.path !== path));
}

export function subscribeSaved(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}
