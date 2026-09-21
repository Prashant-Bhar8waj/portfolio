"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RichText } from "./RichText";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Expandables({ items }: { items: readonly { label: string; body: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            className={cn(
              "rounded-[4px] border border-ink/70 bg-bg px-2.5 py-1 text-[0.95rem] leading-tight text-ink transition-colors hover:bg-ink hover:text-bg",
              open === i && "bg-ink text-bg",
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
      <AnimatePresence initial={false}>
        {open !== null && (
          <motion.div
            key={open}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="mt-4 border-l-2 border-red/70 pl-4 text-[1.05rem] leading-relaxed text-ink-2">
              <RichText text={items[open].body} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
