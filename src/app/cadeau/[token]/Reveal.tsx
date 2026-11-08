"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Gift } from "lucide-react";
import { useState } from "react";
import { markOpened } from "./actions";

export function Reveal({ token, receiverName }: { token: string; receiverName: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const dur = reduce ? 0.2 : 1.2;

  const unwrap = () => {
    setOpen(true);
    void markOpened(token).catch(() => {});
  };

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
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
              <Gift className="absolute -top-8 left-1/2 -translate-x-1/2 text-or" size={36} strokeWidth={1.5} />
            </span>
            <span className="rounded-xl bg-neige px-6 py-3 font-semibold text-rouge-profond transition group-hover:bg-or-pale">Ouvre ton cadeau</span>
          </motion.button>
        ) : (
          <motion.div
            key="name"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: dur * 0.6, delay: reduce ? 0 : 0.3 }}
            aria-live="polite"
          >
            <p className="font-script text-3xl text-or-pale">Tu offres un cadeau à</p>
            <p className="mt-2 break-words font-serif text-5xl text-neige sm:text-6xl">{receiverName}</p>
            <p className="mt-4 text-or-pale">Chut, c&rsquo;est un secret ! 🤫</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
