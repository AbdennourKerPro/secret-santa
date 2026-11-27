"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gift, MessageCircleHeart, Send } from "lucide-react";
import { useReveal } from "./RevealState";

/**
 * Floating menu at the bottom of every participant page. It stays hidden until the gift has been opened,
 * because one of its entries carries the name of the person you drew.
 */
export function BottomNav({ token, receiverName, openedBefore }: { token: string; receiverName: string; openedBefore: boolean }) {
  const { revealed } = useReveal();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  if (!openedBefore && !revealed) return null;

  const base = `/cadeau/${token}`;
  const items = [
    { href: base, label: "Mon tirage", Icon: Gift },
    { href: `${base}/pere-noel`, label: "Père Noël", Icon: MessageCircleHeart },
    { href: `${base}/tire-au-sort`, label: receiverName, Icon: Send },
  ];

  return (
    <motion.nav
      aria-label="Menu du participant"
      data-bottom-nav
      initial={openedBefore || reduce ? false : { y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: openedBefore ? 0 : 1.6, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto w-[min(26rem,calc(100%-2.5rem))]"
    >
      <ul className="grid grid-cols-3 gap-1 rounded-full border border-or-pale/25 bg-nuit/85 p-1.5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-0 flex-col items-center gap-0.5 rounded-full px-2 py-2 text-xs font-semibold transition-colors ${
                  active ? "bg-neige text-rouge-profond" : "text-or-pale/75 hover:bg-white/5 hover:text-or-pale"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2 : 1.6} aria-hidden="true" />
                <span className="w-full truncate text-center">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
