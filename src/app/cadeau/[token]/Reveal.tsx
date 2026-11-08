"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { MascotIcon } from "@/components/mascots/Mascots";
import { markOpened } from "./actions";

export function Reveal({ token, receiverName, onOpen }: { token: string; receiverName: string; onOpen?: () => void }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const dur = reduce ? 0.2 : 1.2;

  const unwrap = () => {
    setOpen(true);
    onOpen?.();
    void markOpened(token).catch(() => {});
  };

  return (
    <div className="flex min-h-[380px] w-full flex-col items-center justify-center text-center">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="box"
            type="button"
            onClick={unwrap}
            exit={{ opacity: 0, transition: { duration: reduce ? 0.15 : 0.5, delay: reduce ? 0 : 0.7 } }}
            className="group flex flex-col items-center gap-5"
            aria-label="Ouvre ton cadeau pour découvrir ton destinataire"
          >
            <span className="relative block h-36 w-44" aria-hidden="true">
              <motion.span
                className="absolute inset-x-[-6px] top-0 z-10 block h-10 rounded-md bg-rouge shadow-md"
                exit={reduce ? undefined : { y: -48, rotate: -8, transition: { duration: dur * 0.6 } }}
              >
                <span className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-or" />
              </motion.span>
              <span className="absolute inset-x-0 bottom-0 top-10 block rounded-b-md bg-rouge-profond ring-1 ring-or/40">
                <span className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-or" />
              </span>
              <span className="absolute -top-7 left-1/2 block h-8 w-16 -translate-x-1/2">
                <span className="absolute left-0 top-1 h-6 w-8 rotate-[-18deg] rounded-full border-4 border-or" />
                <span className="absolute right-0 top-1 h-6 w-8 rotate-[18deg] rounded-full border-4 border-or" />
              </span>
            </span>
            <span className="inline-flex h-14 items-center rounded-full bg-neige px-8 text-lg font-semibold text-rouge-profond shadow-[0_10px_40px_-10px_rgba(255,59,78,0.8)] transition group-hover:-translate-y-0.5 group-hover:bg-or-pale">Ouvre ton cadeau</span>
          </motion.button>
        ) : (
          <motion.div
            key="name"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: dur * 0.6, delay: reduce ? 0 : 0.3 }}
            aria-live="polite"
          >
            <p className="font-script text-3xl text-or">Tu offres un cadeau à</p>
            <p className="mt-1 break-words font-display text-7xl font-extralight uppercase text-neige [text-shadow:0_0_40px_rgba(255,80,100,0.5)] sm:text-8xl">{receiverName}</p>
            <div className="mt-4 flex items-end justify-center gap-2" aria-hidden="true">
              <MascotIcon kind="reindeer" size={64} />
              <MascotIcon kind="santa" size={84} />
              <MascotIcon kind="elf" size={64} />
            </div>
            <p className="mt-3 text-or-pale">Chut, c&rsquo;est un secret !</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
