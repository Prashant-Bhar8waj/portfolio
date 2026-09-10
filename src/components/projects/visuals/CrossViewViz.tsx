"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Sparse epipolar attention, step by step (after Fig. 3.7 / 3.9 of the thesis):
 *   1. pick a query patch q in the reference view
 *   2. map it through the fundamental matrix to an epipolar line in the source view
 *   3. keep only key patches within a band φ of that line, weighted by w = exp(−d²/2σ²)
 *   4. attend to those keys only, then gate the result back into q
 * Click any reference patch to choose q; hover any source patch to read its d and w.
 * Geometry is illustrative; the mechanism matches the thesis.
 */

const W = 480;
const H = 286;
const G = 12; // patches per side
const CELL = 16;
const GAP = 2;
const STEP = CELL + GAP;
const SIZE = G * STEP - GAP; // 214
const LEFT = { x: 18, y: 50 };
const RIGHT = { x: W - 18 - SIZE, y: 50 };
const PHI = 1.45; // band half-width, in patches (reduced from the thesis value for legibility)
const SIGMA = 0.75; // Gaussian sigma, in patches

type Phase = 0 | 1 | 2 | 3; // query → line → band → attention
type Cell = { r: number; c: number };
type Key = Cell & { d: number; sd: number; w: number };

const CYAN = "#22d3ee";
const VIOLET = "#a78bfa";
const ORANGE = "#fb923c";
const MONO = "var(--font-geist-mono), monospace";

const gauss = (d: number) => Math.exp(-(d * d) / (2 * SIGMA * SIGMA));

const center = (o: { x: number; y: number }, r: number, c: number) => ({
  x: o.x + c * STEP + CELL / 2,
  y: o.y + r * STEP + CELL / 2,
});

/** Illustrative epipolar mapping: lines fan out from an epipole to the right of the source view. */
function epipolarLine(qr: number, qc: number) {
  const u = (qc + 0.5) / G;
  const v = (qr + 0.5) / G;
  const m = (u - 0.5) * 0.9;
  const b = v * G - m * (G * 0.5) + (v - 0.5) * 1.2;
  return { m, b };
}

/** Signed perpendicular distance (in patches) from a patch centre to the line y = m·x + b. */
const signedDist = (m: number, b: number, x: number, y: number) => (m * x - y + b) / Math.hypot(m, 1);

export function CrossViewViz() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState<[number, number]>([4, 3]);
  const [phase, setPhase] = useState<Phase>(0);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState<Cell | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const line = useMemo(() => epipolarLine(query[0], query[1]), [query]);

  const keys = useMemo(() => {
    const out: Key[] = [];
    for (let r = 0; r < G; r++)
      for (let c = 0; c < G; c++) {
        const sd = signedDist(line.m, line.b, c + 0.5, r + 0.5);
        const d = Math.abs(sd);
        if (d <= PHI) out.push({ r, c, d, sd, w: gauss(d) });
      }
    return out.sort((a, b) => b.w - a.w);
  }, [line]);

  const nextQuery = useCallback(() => {
    setQuery(([r, c]) => [(r * 5 + c * 3 + 7) % G, (c * 7 + r * 2 + 5) % G]);
  }, []);

  // Phase machine: advance through the four steps, then move to the next query while AUTO is on.
  useEffect(() => {
    if (reduce) return;
    const durations: Record<Phase, number> = { 0: 900, 1: 1000, 2: 1300, 3: 2400 };
    timer.current = setTimeout(() => {
      if (phase < 3) setPhase((p) => (p + 1) as Phase);
      else if (auto) {
        nextQuery();
        setPhase(0);
      }
    }, durations[phase]);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phase, auto, reduce, nextQuery]);

  const shown: Phase = reduce ? 3 : phase;

  const pick = (r: number, c: number) => {
    setAuto(false);
    setQuery([r, c]);
    setPhase(0);
  };

  const q = center(LEFT, query[0], query[1]);
  const toPx = (x: number, y: number) => ({ x: RIGHT.x + x * STEP - GAP / 2, y: RIGHT.y + y * STEP - GAP / 2 });
  const p0 = toPx(0, line.b);
  const p1 = toPx(G, line.m * G + line.b);
  const top = keys.slice(0, 7);
  const keyAt = (r: number, c: number) => keys.find((k) => k.r === r && k.c === c);

  // Gradient across the band: constant along the line, Gaussian across it.
  const mid = toPx(G / 2, line.m * (G / 2) + line.b);
  const len = Math.hypot(1, line.m);
  const nx = -line.m / len;
  const ny = 1 / len;
  const bandPx = PHI * STEP;
  const stops = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    const d = (t - 0.5) * 2 * PHI;
    return { offset: t, alpha: 0.55 * gauss(d) };
  });

  // Hover readout: distance and weight of the hovered source patch.
  const hoverInfo = hover
    ? (() => {
        const sd = signedDist(line.m, line.b, hover.c + 0.5, hover.r + 0.5);
        const d = Math.abs(sd);
        return { ...hover, sd, d, w: d <= PHI ? gauss(d) : 0, inBand: d <= PHI };
      })()
    : null;

  const captions: Record<Phase, string> = {
    0: "1 · pick a query patch q in the reference view",
    1: "2 · the fundamental matrix maps q to an epipolar line in the source view",
    2: `3 · keep keys within band φ · weight w = exp(−d²/2σ²) · k = ${keys.length} of ${G * G}`,
    3: "4 · attend only to those keys, then gate the result back: Z″ = g ⊙ Z′ + (1 − g) ⊙ Z",
  };

  // Inset plot geometry (weight vs. signed distance)
  const PW = 220;
  const PH = 104;
  const px0 = 18;
  const px1 = PW - 14;
  const py0 = 82; // w = 0
  const py1 = 16; // w = 1
  const DMAX = 1.9;
  const dx = (d: number) => px0 + ((d + DMAX) / (2 * DMAX)) * (px1 - px0);
  const wy = (w: number) => py0 - w * (py0 - py1);
  const curve = Array.from({ length: 61 }, (_, i) => {
    const d = -DMAX + (i / 60) * 2 * DMAX;
    return `${i === 0 ? "M" : "L"} ${dx(d).toFixed(1)} ${wy(gauss(d)).toFixed(1)}`;
  }).join(" ");
  const bandArea = (() => {
    const pts = Array.from({ length: 41 }, (_, i) => {
      const d = -PHI + (i / 40) * 2 * PHI;
      return `L ${dx(d).toFixed(1)} ${wy(gauss(d)).toFixed(1)}`;
    }).join(" ");
    return `M ${dx(-PHI).toFixed(1)} ${py0} ${pts} L ${dx(PHI).toFixed(1)} ${py0} Z`;
  })();

  return (
    <figure className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-2xl border border-line bg-bg/60"
        role="img"
        aria-label="Step-by-step epipolar attention: a query patch in the reference view maps to an epipolar line in the source view; only patches near that line are attended, weighted by a Gaussian of their distance to the line."
      >
        <defs>
          <clipPath id="xv-clip-right">
            <rect x={RIGHT.x} y={RIGHT.y} width={SIZE} height={SIZE} rx={4} />
          </clipPath>
          <linearGradient
            id="xv-band"
            gradientUnits="userSpaceOnUse"
            x1={mid.x - nx * bandPx}
            y1={mid.y - ny * bandPx}
            x2={mid.x + nx * bandPx}
            y2={mid.y + ny * bandPx}
          >
            {stops.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={VIOLET} stopOpacity={s.alpha} />
            ))}
          </linearGradient>
        </defs>

        <text x={LEFT.x} y={34} fontSize={9} fill={CYAN} fontFamily={MONO} letterSpacing={1.2}>
          REFERENCE VIEW · C1
        </text>
        <text x={RIGHT.x} y={34} fontSize={9} fill={VIOLET} fontFamily={MONO} letterSpacing={1.2}>
          SOURCE VIEW · C4
        </text>

        {/* gated return, drawn between the titles and the grids */}
        {shown === 3 && (
          <motion.path
            d={`M ${RIGHT.x + 4} ${LEFT.y - 8} H ${LEFT.x + SIZE - 4}`}
            stroke={CYAN}
            strokeOpacity={0.7}
            strokeDasharray="3 4"
            fill="none"
            markerEnd="url(#xv-arrow)"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 }}
          />
        )}
        <defs>
          <marker id="xv-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={CYAN} fillOpacity={0.8} />
          </marker>
        </defs>

        {/* reference grid */}
        {Array.from({ length: G * G }, (_, i) => {
          const r = Math.floor(i / G);
          const c = i % G;
          const isQ = r === query[0] && c === query[1];
          return (
            <rect
              key={`l${i}`}
              x={LEFT.x + c * STEP}
              y={LEFT.y + r * STEP}
              width={CELL}
              height={CELL}
              rx={2}
              fill={isQ ? CYAN : "#1e293b"}
              fillOpacity={isQ ? 1 : 0.7}
              className="cursor-pointer"
              onClick={() => pick(r, c)}
            />
          );
        })}
        {!reduce && (
          <motion.rect
            key={`pulse-${query[0]}-${query[1]}`}
            x={q.x - CELL / 2 - 3}
            y={q.y - CELL / 2 - 3}
            width={CELL + 6}
            height={CELL + 6}
            rx={4}
            fill="none"
            stroke={CYAN}
            initial={{ opacity: 0, scale: 1.4 }}
            animate={{ opacity: [0, 1, 0.6], scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ transformOrigin: `${q.x}px ${q.y}px` }}
          />
        )}
        <text x={q.x} y={q.y - CELL / 2 - 7} textAnchor="middle" fontSize={9} fill={CYAN} fontFamily={MONO}>
          q
        </text>

        {/* source grid */}
        {Array.from({ length: G * G }, (_, i) => {
          const r = Math.floor(i / G);
          const c = i % G;
          const k = keyAt(r, c);
          const inBand = shown >= 2 && k;
          const dimmed = shown >= 2 && !k;
          const isHover = hover?.r === r && hover?.c === c;
          return (
            <rect
              key={`r${i}`}
              x={RIGHT.x + c * STEP}
              y={RIGHT.y + r * STEP}
              width={CELL}
              height={CELL}
              rx={2}
              fill={inBand ? VIOLET : "#1e293b"}
              fillOpacity={inBand ? 0.25 + 0.75 * k.w : dimmed ? 0.22 : 0.7}
              stroke={isHover ? ORANGE : "none"}
              strokeWidth={1.5}
              style={{ transition: "fill .4s, fill-opacity .4s" }}
              onMouseEnter={() => setHover({ r, c })}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}

        {/* Gaussian band + epipolar line */}
        <g clipPath="url(#xv-clip-right)">
          {shown >= 2 && (
            <motion.line
              key={`band-${query[0]}-${query[1]}`}
              x1={p0.x}
              y1={p0.y}
              x2={p1.x}
              y2={p1.y}
              stroke="url(#xv-band)"
              strokeWidth={PHI * 2 * STEP}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.6 }}
            />
          )}
          <AnimatePresence>
            {shown >= 1 && (
              <motion.line
                key={`line-${query[0]}-${query[1]}`}
                x1={p0.x}
                y1={p0.y}
                x2={p1.x}
                y2={p1.y}
                stroke={ORANGE}
                strokeWidth={1.5}
                initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.7, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </g>

        {/* footnotes under the grids */}
        <text x={LEFT.x} y={LEFT.y + SIZE + 15} fontSize={8} fill="#7c889e" fontFamily={MONO} letterSpacing={1}>
          click a patch to choose q
        </text>
        {shown >= 1 && (
          <text x={RIGHT.x + SIZE} y={RIGHT.y + SIZE + 15} textAnchor="end" fontSize={8} fill={ORANGE} fontFamily={MONO} letterSpacing={1}>
            l = F · q
          </text>
        )}
        {shown >= 2 && (
          <text x={RIGHT.x} y={RIGHT.y + SIZE + 15} fontSize={8} fill="#7c889e" fontFamily={MONO} letterSpacing={1}>
            hover a key for d, w
          </text>
        )}

        {/* attention rays to the highest-weighted keys */}
        <AnimatePresence>
          {shown === 3 &&
            top.map((k, i) => {
              const t = center(RIGHT, k.r, k.c);
              return (
                <motion.line
                  key={`ray-${k.r}-${k.c}`}
                  x1={q.x}
                  y1={q.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={CYAN}
                  strokeWidth={1}
                  initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.15 + 0.6 * k.w }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : i * 0.06 }}
                />
              );
            })}
        </AnimatePresence>

      </svg>
      <p className="mt-2 min-h-[2.25rem] px-1 font-mono text-[11px] leading-snug text-ink-2" aria-live="polite">
        {captions[shown]}
      </p>

      {/* Soft Gaussian mask: formula, live readout and weight profile */}
      <div className="mt-2 rounded-2xl border border-line bg-bg/60 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="annot">soft gaussian mask · epipolar weight</p>
          <div className="flex items-center gap-1 rounded-full border border-line p-1">
            <button
              type="button"
              onClick={() => {
                setAuto(false);
                setPhase((p) => (p >= 3 ? 0 : ((p + 1) as Phase)));
              }}
              className="rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider text-ink-2 hover:text-ink"
              aria-label="Next step"
            >
              STEP {shown + 1}/4 ›
            </button>
            <button
              type="button"
              onClick={() => {
                setAuto(true);
                nextQuery();
                setPhase(0);
              }}
              aria-pressed={auto}
              className={cn("rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider", auto ? "bg-white/[0.08] text-ink" : "text-muted hover:text-ink-2")}
            >
              AUTO
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 font-serif text-2xl text-ink" aria-label="w epi q k equals exp of minus d of k and l q squared over two sigma squared">
              <span className="flex items-start">
                <span className="italic">w</span>
                <span className="ml-0.5 flex flex-col font-mono text-[9px] leading-[1.1] text-ink-2">
                  <span>epi</span>
                  <span>qk</span>
                </span>
              </span>
              <span className="mx-1 text-xl text-ink-2">=</span>
              <span>exp</span>
              <span className="text-4xl font-light leading-none text-ink-2">(</span>
              <span className="flex flex-col items-center text-lg leading-tight">
                <span className="border-b border-ink/60 px-1.5 pb-0.5">
                  −<span className="italic">d</span>(<span className="italic">k</span>, <span className="italic">l</span>
                  <sub className="font-mono text-[10px] not-italic">q</sub>)²
                </span>
                <span className="px-1.5 pt-0.5">2σ²</span>
              </span>
              <span className="text-4xl font-light leading-none text-ink-2">)</span>
              <span className="ml-2 font-mono text-[10px] text-muted">for d ≤ φ, else masked out</span>
            </div>

            <p className="mt-3 min-h-[2.5rem] font-mono text-[11px] leading-relaxed text-ink-2" role="status" aria-live="polite">
              {hoverInfo ? (
                hoverInfo.inBand ? (
                  <>
                    <span className="text-orange">k = ({hoverInfo.r}, {hoverInfo.c})</span>
                    <span className="text-muted"> · </span>d = {hoverInfo.d.toFixed(2)} patches
                    <span className="text-muted"> · </span>
                    <span className="text-violet">w = {hoverInfo.w.toFixed(2)}</span>
                    {top.some((t) => t.r === hoverInfo.r && t.c === hoverInfo.c) && <span className="text-cyan"> · attended</span>}
                  </>
                ) : (
                  <>
                    <span className="text-orange">k = ({hoverInfo.r}, {hoverInfo.c})</span>
                    <span className="text-muted"> · </span>d = {hoverInfo.d.toFixed(2)} &gt; φ
                    <span className="text-muted"> · </span>
                    <span className="text-muted">masked out, w = 0, never computed</span>
                  </>
                )
              ) : (
                <span className="text-muted">
                  d is the perpendicular distance from key patch k to the epipolar line of q. σ sets the softness; φ cuts the band. Hover a source patch to read its values.
                </span>
              )}
            </p>
          </div>

          <svg viewBox={`0 0 ${PW} ${PH}`} className="h-auto w-full max-w-[240px] sm:w-[220px]" role="img" aria-label="Gaussian weight versus signed distance to the epipolar line, with the band edges at plus and minus phi.">
            <defs>
              <linearGradient id="xv-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={VIOLET} stopOpacity={0.55} />
                <stop offset="1" stopColor={VIOLET} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            {/* axes */}
            <line x1={px0} y1={py0} x2={px1} y2={py0} stroke="rgba(148,163,184,0.35)" />
            <line x1={dx(0)} y1={py1 - 4} x2={dx(0)} y2={py0} stroke="rgba(148,163,184,0.2)" strokeDasharray="2 3" />
            {/* band + curve */}
            <path d={bandArea} fill="url(#xv-area)" />
            <path d={curve} fill="none" stroke={VIOLET} strokeWidth={1.4} />
            {/* cutoff outside the band */}
            <rect x={px0} y={py1 - 6} width={dx(-PHI) - px0} height={py0 - py1 + 6} fill="#060a14" fillOpacity={0.55} />
            <rect x={dx(PHI)} y={py1 - 6} width={px1 - dx(PHI)} height={py0 - py1 + 6} fill="#060a14" fillOpacity={0.55} />
            <line x1={dx(-PHI)} y1={py1 - 6} x2={dx(-PHI)} y2={py0} stroke={ORANGE} strokeDasharray="3 3" strokeOpacity={0.9} />
            <line x1={dx(PHI)} y1={py1 - 6} x2={dx(PHI)} y2={py0} stroke={ORANGE} strokeDasharray="3 3" strokeOpacity={0.9} />
            {/* sigma tick */}
            <line x1={dx(SIGMA)} y1={py0} x2={dx(SIGMA)} y2={wy(gauss(SIGMA))} stroke={CYAN} strokeOpacity={0.5} strokeDasharray="1 2" />
            {/* keys on the curve */}
            {shown >= 2 &&
              keys.map((k) => {
                const isTop = top.some((t) => t.r === k.r && t.c === k.c);
                return (
                  <circle
                    key={`${k.r}-${k.c}`}
                    cx={dx(k.sd)}
                    cy={wy(k.w)}
                    r={isTop && shown === 3 ? 2.6 : 1.8}
                    fill={isTop && shown === 3 ? CYAN : VIOLET}
                    fillOpacity={isTop && shown === 3 ? 0.95 : 0.6}
                  />
                );
              })}
            {hoverInfo && Math.abs(hoverInfo.sd) <= DMAX && (
              <g>
                <line x1={dx(hoverInfo.sd)} y1={py0} x2={dx(hoverInfo.sd)} y2={wy(hoverInfo.w)} stroke={ORANGE} strokeOpacity={0.7} />
                <circle cx={dx(hoverInfo.sd)} cy={wy(hoverInfo.w)} r={4} fill={ORANGE} />
              </g>
            )}
            {/* labels */}
            <text x={dx(-PHI)} y={PH - 8} textAnchor="middle" fontSize={8} fill={ORANGE} fontFamily={MONO}>
              −φ
            </text>
            <text x={dx(0)} y={PH - 8} textAnchor="middle" fontSize={8} fill="#7c889e" fontFamily={MONO}>
              d = 0
            </text>
            <text x={dx(PHI)} y={PH - 8} textAnchor="middle" fontSize={8} fill={ORANGE} fontFamily={MONO}>
              +φ
            </text>
            <text x={dx(SIGMA) + 3} y={wy(gauss(SIGMA)) - 4} fontSize={8} fill={CYAN} fontFamily={MONO}>
              σ
            </text>
            <text x={px0 - 2} y={py1 + 3} textAnchor="end" fontSize={7.5} fill="#7c889e" fontFamily={MONO}>
              1
            </text>
            <text x={px0 - 2} y={py0 + 3} textAnchor="end" fontSize={7.5} fill="#7c889e" fontFamily={MONO}>
              0
            </text>
            <text x={px1} y={py1 - 6} textAnchor="end" fontSize={7.5} fill="#7c889e" fontFamily={MONO} letterSpacing={1}>
              w vs. d
            </text>
          </svg>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          The band here is narrowed so the patches stay readable. In the thesis, φ = 65 px on the 16×16 DINOv2 grid keeps roughly 43 to 54% of the patches per query, tuned per category with Bayesian optimization.
        </p>
      </div>

      <figcaption className="sr-only">
        For each query patch in the reference view, the fundamental matrix gives an epipolar line in the source view. Only key patches within a threshold band of that line take part in attention, weighted by a Gaussian of their distance to the line, and a learned gate blends the result back into the query token.
      </figcaption>
    </figure>
  );
}
