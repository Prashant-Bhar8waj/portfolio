"use client";

import { motion, useScroll } from "framer-motion";
import { chapters } from "@/content/story";
import { cn } from "@/lib/cn";

export function TocRail({ active }: { active: number }) {
  const { scrollYProgress } = useScroll();
  return (
    <>
      <motion.div aria-hidden className="fixed right-[7px] top-0 z-40 hidden h-screen w-[1.5px] origin-top bg-ink xl:block" style={{ scaleY: scrollYProgress }} />
      <nav aria-label="Chapters" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 font-mono text-[10px] xl:flex">
        {chapters.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={cn("flex items-center justify-end gap-2 tracking-wider transition-colors", i === active ? "text-ink" : "text-muted hover:text-ink")}
          >
            <span className={cn(i === active ? "opacity-100" : "opacity-0")}>{c.title}</span>
            <span className={cn("w-9 text-right", i === active && "font-semibold")}>{c.year}</span>
            <span className={cn("h-1.5 w-1.5 rounded-full border border-ink", i <= active ? "bg-red border-red" : "bg-transparent")} />
          </a>
        ))}
      </nav>
    </>
  );
}
