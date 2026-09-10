"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { DetectionBox } from "@/components/effects/DetectionBox";
import { cn } from "@/lib/cn";

type Mode = "raw" | "features" | "attention";

const modes: { id: Mode; label: string }[] = [
  { id: "raw", label: "Raw input" },
  { id: "features", label: "Feature map" },
  { id: "attention", label: "Attention" },
];

const tech = ["Python", "C++", "PyTorch", "OpenCV", "Linux", "AWS", "Docker", "Git"];

export function About() {
  const [mode, setMode] = useState<Mode>("raw");

  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <SectionHeader
        index="01"
        tag="about"
        title={
          <>
            Where vision, learning <span className="serif-accent text-violet">and</span> engineering meet.
          </>
        }
      />

      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <div
            className="group relative"
            onMouseEnter={() => mode === "raw" && setMode("features")}
            onMouseLeave={() => setMode("raw")}
          >
            <DetectionBox label="engineer" confidence={0.99} accent="cyan" className="rounded-2xl">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src={site.photo}
                  alt={`Portrait of ${site.name}`}
                  fill
                  sizes="(min-width: 1024px) 420px, 90vw"
                  priority={false}
                  className={cn(
                    "object-cover transition-[filter,transform] duration-700",
                    mode === "raw" && "scale-100",
                    mode === "features" && "scale-[1.02] grayscale contrast-150 brightness-90",
                    mode === "attention" && "scale-[1.02] grayscale contrast-125 brightness-75",
                  )}
                />
                {/* Feature-map look: edge-ish overlay */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 transition-opacity duration-700",
                    mode === "features" ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(34,211,238,0.55), rgba(167,139,250,0.45) 60%, rgba(6,10,20,0.2))",
                    mixBlendMode: "color",
                  }}
                />
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 transition-opacity duration-700",
                    mode === "features" ? "opacity-70" : "opacity-0",
                  )}
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(34,211,238,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.25) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                    mixBlendMode: "screen",
                  }}
                />
                {/* Attention heat overlay */}
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-0 transition-opacity duration-700",
                    mode === "attention" ? "opacity-100" : "opacity-0",
                  )}
                  style={{
                    background:
                      "radial-gradient(ellipse 34% 26% at 42% 24%, rgba(251,146,60,0.95), rgba(251,146,60,0.55) 35%, rgba(167,139,250,0.45) 60%, rgba(34,211,238,0.25) 80%, transparent 100%)",
                    mixBlendMode: "hard-light",
                  }}
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-bg/90 to-transparent px-4 pb-3 pt-10 font-mono text-[10px] tracking-widest text-muted">
                  <span>{mode === "raw" ? "input · 1600×1200" : mode === "features" ? "dinov2 · block 3" : "foreground attn"}</span>
                  <span>{mode === "raw" ? "" : "illustrative"}</span>
                </div>
              </div>
            </DetectionBox>

            <div role="group" aria-label="Image view mode" className="mt-4 grid grid-cols-3 gap-1 rounded-full border border-line p-1">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={mode === m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wider transition-colors",
                    mode === m.id ? "bg-white/[0.08] text-ink" : "text-muted hover:text-ink-2",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal className="space-y-5 text-lg leading-relaxed text-ink-2">
            <p>
              I&apos;m {site.name}. I teach cameras to notice the things people miss: a scratch six pixels wide, a bolt
              that is only missing from one angle, a particle drifting through an IV bag at a hundred frames a second.
            </p>
            <p>
              The part I love most is designing architectures. Sketching how information should flow between five
              cameras, deciding where geometry gets to constrain a transformer, working out which gate decides when a
              view can be trusted, and then building it and letting the data tell me whether I was right. That habit
              started in electrical engineering, where I learned to think in signals and systems, and it carried me
              through a Master&apos;s in Visual Computing at Saarland University and three years in the AI Group at
              K|Lens GmbH, where I calibrate real camera rigs and ship real inspection models to real factory floors.
            </p>
            <p>
              Off the clock I have written a physically based renderer for the fun of watching light behave, built a
              small robot that carries a houseplant toward the sun, and read far too many transformer papers. My daily
              tools are Python and C++, PyTorch and OpenCV, Linux, Docker, Git and AWS.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
            {[
              ["Education", "M.Sc. Visual Computing", "Saarland University"],
              ["Experience", "3+ years", "K|Lens GmbH · AI Group"],
              ["Roots", "B.Tech EEE", "Gold medalist"],
              ["Base", "Saarbrücken", "Germany"],
            ].map(([k, v, s]) => (
              <div key={k} className="bg-bg p-4">
                <p className="annot">{k}</p>
                <p className="mt-2 text-sm font-medium text-ink">{v}</p>
                <p className="text-xs text-muted">{s}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-2">
            {tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-ink-2"
              >
                {t}
              </span>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
