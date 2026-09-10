"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { journey } from "@/content/journey";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { accentHex, cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });

  return (
    <section id="journey" className="relative scroll-mt-24 py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/3 h-[40vh] w-[35vw] rounded-full bg-orange/[0.06] blur-[120px]" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="04"
          tag="professional journey"
          title={
            <>
              From circuits <span className="serif-accent text-cyan">to</span> sight.
            </>
          }
        />

        <ol ref={ref} className="relative mx-auto max-w-3xl">
          {/* rail */}
          <div aria-hidden className="absolute left-4 top-0 h-full w-px bg-line md:left-1/2" />
          <motion.div
            aria-hidden
            className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-cyan via-violet to-orange md:left-1/2"
            style={{ scaleY: reduce ? 1 : progress }}
          />

          {journey.map((m, i) => {
            const right = i % 2 === 1;
            return (
              <li key={m.title} className={cn("relative mb-12 pl-12 md:mb-16 md:w-1/2 md:pl-0", right ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right")}>
                <Reveal>
                  {/* node */}
                  <span
                    aria-hidden
                    className={cn("absolute top-1.5 grid h-8 w-8 -translate-x-1/2 place-items-center md:top-1", "left-4", right ? "md:left-0" : "md:left-full")}
                  >
                    <span className="absolute inset-0 rounded-full border border-line bg-bg" />
                    <span className={cn("relative h-2.5 w-2.5 rounded-full", m.current && "animate-pulse-soft")} style={{ background: accentHex[m.accent], boxShadow: `0 0 16px ${accentHex[m.accent]}` }} />
                  </span>

                  <p className="annot mb-2" style={{ color: accentHex[m.accent] }}>
                    {m.period}
                    {m.current && <span className="ml-2 rounded-sm bg-white/[0.08] px-1.5 py-0.5 text-[9px] text-ink">now</span>}
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">{m.title}</h3>
                  <p className="mt-1 text-sm text-ink-2">{m.org}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{m.body}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
