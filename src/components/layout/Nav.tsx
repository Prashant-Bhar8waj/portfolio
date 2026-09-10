"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/cn";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500 sm:px-5",
          scrolled ? "glass mx-4 sm:mx-6 lg:mx-auto" : "mx-4 sm:mx-6 lg:mx-auto",
        )}
      >
        <Link href="#top" className="group flex items-center gap-3" aria-label={`${site.name}, home`}>
          <span className="corners relative grid h-9 w-9 place-items-center font-mono text-xs font-semibold tracking-widest text-ink [--s:8px]">
            PB
            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-cyan animate-pulse-soft" />
          </span>
          <span className="hidden text-sm font-medium text-ink-2 group-hover:text-ink sm:block">{site.name}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={cn(
                "relative rounded-full px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:text-ink",
                active === n.href && "text-ink",
              )}
            >
              {active === n.href && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-white/[0.06]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{n.label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-4">
              <span className={cn("absolute left-0 top-0 h-px w-4 bg-current transition-transform", open && "translate-y-[6px] rotate-45")} />
              <span className={cn("absolute left-0 top-[6px] h-px w-4 bg-current transition-opacity", open && "opacity-0")} />
              <span className={cn("absolute left-0 top-3 h-px w-4 bg-current transition-transform", open && "-translate-y-[6px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex h-full flex-col justify-center gap-2 px-8">
              {nav.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.05 * i } }}
                  className="headline flex items-baseline gap-4 py-3 text-4xl text-ink"
                >
                  <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                  {n.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
