"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type Mode = "gradcam" | "adversarial";

/**
 * Before/after comparison: drag (or use arrow keys on) the handle to reveal an explanation map
 * or an adversarial perturbation over the original image. Overlays are illustrative.
 */
export function XaiSlider() {
  const [pos, setPos] = useState(50);
  const [mode, setMode] = useState<Mode>("gradcam");
  const id = useId();

  return (
    <figure className="relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-bg/60 select-none">
        {/* base image */}
        <Image src="/sketch.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />

        {/* processed layer, clipped */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} aria-hidden>
          <Image src="/sketch.jpg" alt="" fill sizes="(min-width: 1024px) 560px, 90vw" className={cn("object-cover", mode === "gradcam" ? "grayscale contrast-125 brightness-75" : "")} />
          {mode === "gradcam" ? (
            <>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 26% 22% at 50% 30%, rgba(251,146,60,0.95), rgba(251,146,60,0.7) 30%, rgba(167,139,250,0.55) 55%, rgba(34,211,238,0.35) 75%, rgba(34,211,238,0.05) 100%)",
                  mixBlendMode: "hard-light",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse 30% 24% at 62% 66%, rgba(34,211,238,0.35), transparent 70%)",
                  mixBlendMode: "screen",
                }}
              />
            </>
          ) : (
            <>
              <svg className="absolute inset-0 h-full w-full opacity-70 mix-blend-overlay" aria-hidden>
                <filter id={`${id}-noise`}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" stitchTiles="stitch" />
                  <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#${id}-noise)`} />
              </svg>
              <div className="absolute inset-0 bg-violet/20 mix-blend-color" />
            </>
          )}
        </div>

        {/* divider + handle */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-ink/80" style={{ left: `${pos}%` }} aria-hidden>
          <div className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink/40 bg-bg/80 font-mono text-[10px] text-ink backdrop-blur">
            ⇔
          </div>
        </div>

        {/* labels */}
        <div className="pointer-events-none absolute left-3 top-3 rounded-sm bg-bg/80 px-2 py-1 font-mono text-[10px] tracking-widest text-ink-2 backdrop-blur">
          INPUT
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-sm px-2 py-1 font-mono text-[10px] tracking-widest text-bg" style={{ background: mode === "gradcam" ? "#fb923c" : "#a78bfa" }}>
          {mode === "gradcam" ? "GRAD-CAM · ILLUSTRATIVE" : "PGD PERTURBATION · ILLUSTRATIVE"}
        </div>
        <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] tracking-widest text-muted">
          resnet18 · captum
        </div>

        <input
          id={`${id}-range`}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Reveal amount of the processed image"
          className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100 focus-visible:outline-cyan [&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-12 [&::-webkit-slider-thumb]:appearance-none"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div role="group" aria-label="Overlay type" className="flex gap-1 rounded-full border border-line p-1">
          {(
            [
              ["gradcam", "Explanation"],
              ["adversarial", "Adversarial"],
            ] as [Mode, string][]
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn("rounded-full px-3 py-1 font-mono text-[11px] tracking-wider", mode === m ? "bg-white/[0.08] text-ink" : "text-muted hover:text-ink-2")}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[10px] tracking-widest text-muted">drag · ← →</p>
      </div>
      <figcaption className="sr-only">
        A slider compares an input image with either a Grad-CAM style attribution heat-map or an adversarial noise perturbation. Both overlays are illustrative.
      </figcaption>
    </figure>
  );
}
