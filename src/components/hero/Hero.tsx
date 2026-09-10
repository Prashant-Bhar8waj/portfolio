"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";
import { easeOut } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Hero() {
  const reduce = useReducedMotion();
  const words = site.tagline.split(" ");

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 md:pt-32">
      {/* Backdrop: grid, glows, scan sweep */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute -left-1/4 top-0 h-[60vh] w-[70vw] rounded-full bg-cyan/10 blur-[120px] animate-drift" />
        <div className="absolute -right-1/4 bottom-0 h-[50vh] w-[60vw] rounded-full bg-violet/10 blur-[120px]" />
        <div className="absolute right-1/3 top-1/3 h-[30vh] w-[30vw] rounded-full bg-orange/[0.06] blur-[100px]" />
        <div className="absolute inset-0 noise opacity-[0.35] mix-blend-soft-light" />
        <div className="absolute inset-0 scanlines opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent animate-scan motion-reduce:hidden" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:pb-28">
        <div className="relative min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            <span className="text-xs font-medium tracking-wide text-ink-2">{site.statusBadge}</span>
          </motion.div>

          <h1 className="headline min-w-0 text-[clamp(2.75rem,8vw,6.5rem)] text-ink">
            {words.map((wd, i) => {
              const last = i === words.length - 1;
              return (
                <Fragment key={i}>
                  <motion.span
                    className="inline-block will-change-transform"
                    initial={{ opacity: 0, y: reduce ? 0 : 28, filter: reduce ? "none" : "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: easeOut, delay: 0.15 + i * 0.09 }}
                  >
                    {last ? (
                      <span className="serif-accent bg-gradient-to-r from-cyan via-cyan to-violet bg-clip-text pr-2 text-transparent">
                        {wd}
                      </span>
                    ) : (
                      wd
                    )}
                  </motion.span>
                  {!last && " "}
                </Fragment>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.6 }}
            className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-ink-2 md:text-xl"
          >
            {site.subline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button href="#work">
              Explore My Work
              <span aria-hidden className="transition-transform group-hover:translate-y-0.5">↓</span>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-14 grid grid-cols-2 gap-4 border-t border-line pt-6 font-mono text-[11px] tracking-wider text-muted"
          >
            <div>
              <dt className="uppercase">experience</dt>
              <dd className="mt-1 text-sm text-ink">3+ yrs · K|Lens</dd>
            </div>
            <div>
              <dt className="uppercase">degree</dt>
              <dd className="mt-1 text-sm text-ink">M.Sc. Visual Computing</dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: easeOut, delay: 0.4 }}
          className="relative min-w-0"
        >
          <div className="glass relative aspect-[4/3] w-full overflow-hidden rounded-3xl lg:aspect-[5/4]">
            <div className="absolute left-4 top-4 z-10 flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse-soft" />
              FEED · LIVE
            </div>
            <div className="absolute bottom-4 right-4 z-10 hidden font-mono text-[10px] tracking-widest text-muted sm:block">
              REAL-IAD GEOMETRY · 4 + 1 CAMERAS
            </div>
            <HeroVisual className="absolute inset-0 h-full w-full touch-none" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.06]" />
          </div>
          <p className="mt-3 text-center font-mono text-[10px] tracking-widest text-muted">
            move the cursor to orbit · hover a camera to inspect its view
          </p>
        </motion.div>
      </div>
    </section>
  );
}
