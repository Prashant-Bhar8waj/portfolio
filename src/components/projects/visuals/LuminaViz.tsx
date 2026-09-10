"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Five camera views feeding one fused decision. Hover or focus a view to see how it connects:
 * calibrated cameras (C1–C4) exchange information along epipolar constraints; the uncalibrated
 * top-down camera (C5) uses self-attention and is fused late.
 */

const W = 480;
const H = 360;
const center = { x: W / 2, y: H / 2 + 10 };

const views = [
  { id: "C1", x: 70, y: 80, calibrated: true },
  { id: "C2", x: W - 70, y: 80, calibrated: true },
  { id: "C3", x: 70, y: H - 60, calibrated: true },
  { id: "C4", x: W - 70, y: H - 60, calibrated: true },
  { id: "C5", x: W / 2, y: 40, calibrated: false },
];

const cells = Array.from({ length: 16 }, (_, i) => ({ r: Math.floor(i / 4), c: i % 4 }));

export function LuminaViz() {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const isActive = (i: number) => active === null || active === i;

  return (
    <figure className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full overflow-visible rounded-2xl border border-line bg-bg/60"
        role="img"
        aria-label="Diagram of LUMINA: five camera views feed a fused decision node. Calibrated cameras C1 to C4 are linked by epipolar attention; camera C5 uses self-attention."
      >
        <defs>
          <radialGradient id="lum-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* epipolar links between calibrated cams */}
        {views.slice(0, 4).map((a, i) =>
          views.slice(i + 1, 4).map((b, j) => {
            const k = i + 1 + j;
            const on = active !== null && (active === i || active === k);
            return (
              <line
                key={`${a.id}-${b.id}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#a78bfa"
                strokeOpacity={on ? 0.75 : active === null ? 0.14 : 0.04}
                strokeWidth={on ? 1.2 : 1}
                strokeDasharray="3 6"
                className={cn(!reduce && on && "animate-dash")}
              />
            );
          }),
        )}

        {/* feed paths to the core */}
        {views.map((v, i) => {
          const path = `M ${v.x} ${v.y} Q ${(v.x + center.x) / 2} ${(v.y + center.y) / 2 + (i % 2 ? 24 : -24)} ${center.x} ${center.y}`;
          const on = isActive(i);
          return (
            <g key={v.id}>
              <path
                id={`lum-path-${i}`}
                d={path}
                fill="none"
                stroke={v.calibrated ? "#22d3ee" : "#fb923c"}
                strokeOpacity={on ? (active === i ? 0.8 : 0.3) : 0.08}
                strokeWidth={1}
              />
              {!reduce &&
                on &&
                [0, 1].map((n) => (
                  <circle key={n} r={2.2} fill={v.calibrated ? "#22d3ee" : "#fb923c"}>
                    <animateMotion dur={`${2.2 + i * 0.25}s`} begin={`${n * 1.1 + i * 0.2}s`} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#lum-path-${i}`} />
                    </animateMotion>
                  </circle>
                ))}
            </g>
          );
        })}

        {/* core */}
        <circle cx={center.x} cy={center.y} r={54} fill="url(#lum-core)" className={cn(!reduce && "animate-pulse-soft")} />
        <circle cx={center.x} cy={center.y} r={26} fill="#0d1526" stroke="#22d3ee" strokeOpacity={0.7} />
        <text x={center.x} y={center.y - 3} textAnchor="middle" fontSize={8} fill="#7c889e" fontFamily="var(--font-geist-mono), monospace" letterSpacing={1}>
          GATED
        </text>
        <text x={center.x} y={center.y + 8} textAnchor="middle" fontSize={8} fill="#e6edf7" fontFamily="var(--font-geist-mono), monospace" letterSpacing={1}>
          FUSION
        </text>

        {/* decision */}
        <g transform={`translate(${center.x}, ${center.y + 74})`}>
          <rect x={-62} y={-12} width={124} height={24} rx={12} fill="#060a14" stroke="#22d3ee" strokeOpacity={0.5} />
          <text textAnchor="middle" y={4} fontSize={9} fill="#22d3ee" fontFamily="var(--font-geist-mono), monospace" letterSpacing={1.5}>
            DECISION · 0.9717
          </text>
        </g>

        {/* view tiles */}
        {views.map((v, i) => {
          const on = isActive(i);
          const col = v.calibrated ? "#22d3ee" : "#fb923c";
          return (
            <g
              key={v.id}
              transform={`translate(${v.x - 28}, ${v.y - 22})`}
              tabIndex={0}
              role="button"
              aria-label={`${v.id}: ${v.calibrated ? "calibrated camera, epipolar attention" : "uncalibrated top-down camera, self-attention"}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="cursor-pointer outline-none"
              opacity={on ? 1 : 0.35}
              style={{ transition: "opacity .3s" }}
            >
              <rect width={56} height={44} rx={6} fill="#0d1526" stroke={active === i ? col : "rgba(148,163,184,0.25)"} strokeWidth={active === i ? 1.5 : 1} />
              {cells.map(({ r, c }, k) => {
                const hot = (k * 7 + i * 3) % 11 < 3;
                return (
                  <rect
                    key={k}
                    x={6 + c * 11}
                    y={5 + r * 8.2}
                    width={9}
                    height={6.4}
                    rx={1}
                    fill={hot ? col : "#334155"}
                    fillOpacity={hot ? (active === i ? 0.95 : 0.55) : 0.5}
                  />
                );
              })}
              <text x={28} y={-6} textAnchor="middle" fontSize={9} fill={col} fontFamily="var(--font-geist-mono), monospace" letterSpacing={1}>
                {v.id}
              </text>
            </g>
          );
        })}

        {/* legend */}
        <g transform="translate(14, 330)" fontFamily="var(--font-geist-mono), monospace" fontSize={8} fill="#7c889e" letterSpacing={1}>
          <circle r={3} cx={0} cy={0} fill="#22d3ee" />
          <text x={8} y={3}>EPIPOLAR ATTN (C1–C4)</text>
          <circle r={3} cx={150} cy={0} fill="#fb923c" />
          <text x={158} y={3}>SELF-ATTN (C5)</text>
          <line x1={262} x2={280} y1={0} y2={0} stroke="#a78bfa" strokeDasharray="3 4" />
          <text x={286} y={3}>GEOMETRIC LINK</text>
        </g>
      </svg>
      <figcaption className="sr-only">
        Frozen DINOv2 features from five synchronized views are fused with sparse epipolar attention and confidence gates into a single anomaly decision.
      </figcaption>
    </figure>
  );
}
