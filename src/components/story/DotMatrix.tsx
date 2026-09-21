"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Scene } from "@/content/story";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A 24×24 field of dots, like a dot-matrix chart. Each scene is a function that assigns every
 * dot an intensity (and sometimes a radius), plus a thin overlay drawn on top. Dots animate
 * between scenes with CSS transitions staggered along the diagonal.
 */

const N = 24;
const S = 240;
const STEP = S / N;
const RED = "#a11a1a";
const GREEN = "#2a623d";
const INK = "#111";

type Dot = { v: number; r?: number; c?: string };

const gauss = (d: number, s: number) => Math.exp(-(d * d) / (2 * s * s));
const hash = (x: number, y: number) => {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

function scene(kind: Scene, x: number, y: number): Dot {
  switch (kind) {
    case "signal": {
      const c = 0.5 + 0.22 * Math.sin(x * Math.PI * 3);
      return { v: 0.12 + 0.9 * gauss(y - c, 0.035) };
    }
    case "control": {
      const t = x * 1.15;
      const f = 0.62 - 0.32 * (1 - Math.exp(-4.2 * t) * Math.cos(15 * t));
      const target = gauss(y - 0.3, 0.012) * 0.35;
      return { v: 0.1 + Math.max(0.92 * gauss(y - f, 0.03), target) };
    }
    case "peak": {
      const bars = 8;
      const b = Math.min(bars - 1, Math.floor(x * bars));
      const h = 0.18 + 0.72 * Math.pow((b + 1) / bars, 1.6);
      const inBar = y > 1 - h && (x * bars) % 1 > 0.12 && (x * bars) % 1 < 0.88;
      const last = b === bars - 1;
      return inBar ? { v: last ? 1 : 0.62, c: last ? "#b8860b" : RED } : { v: 0.08 };
    }
    case "gradcam": {
      const heat = gauss(Math.hypot(x - 0.55, y - 0.42), 0.13) + 0.45 * gauss(Math.hypot(x - 0.3, y - 0.68), 0.09);
      return { v: 0.16 + 0.85 * Math.min(1, heat), r: 2 + 1.3 * Math.min(1, heat) };
    }
    case "detect": {
      const noise = hash(x, y);
      const particle = gauss(Math.hypot(x - 0.62, y - 0.56), 0.045);
      return { v: 0.1 + 0.12 * noise + 0.9 * particle, c: particle > 0.4 ? RED : INK };
    }
    case "render": {
      const d = Math.hypot(x - 0.42, y - 0.5);
      const blur = Math.min(1, Math.max(0, (d - 0.2) * 2.2));
      return { v: 0.55 - 0.32 * blur, r: 1.6 + 3.2 * blur, c: INK };
    }
    case "epipolar": {
      const m = -0.32;
      const b0 = 0.66;
      const d = Math.abs(m * x - y + b0) / Math.hypot(m, 1);
      const w = gauss(d, 0.05);
      const outside = d > 0.14;
      return { v: outside ? 0.1 : 0.2 + 0.85 * w, c: outside ? INK : RED };
    }
    case "fusion": {
      const core = gauss(Math.hypot(x - 0.5, y - 0.56), 0.12);
      const ring = gauss(Math.abs(Math.hypot(x - 0.5, y - 0.56) - 0.34), 0.02);
      return { v: 0.1 + 0.95 * Math.max(core, 0.6 * ring), c: core > 0.5 ? GREEN : RED, r: 2 + 1.5 * core };
    }
    case "open":
    default:
      return { v: 0.42, c: INK };
  }
}

function Overlay({ kind, reduce }: { kind: Scene; reduce: boolean }) {
  const draw = { initial: { pathLength: reduce ? 1 : 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 } };
  const t = { duration: reduce ? 0 : 1.1, ease: "easeInOut" as const, delay: reduce ? 0 : 0.35 };
  const mono = "var(--font-geist-mono), monospace";
  switch (kind) {
    case "detect":
      return (
        <g>
          <motion.rect x={S * 0.5} y={S * 0.44} width={S * 0.24} height={S * 0.24} fill="none" stroke={RED} strokeWidth={1.5} {...draw} transition={t} />
          <motion.text x={S * 0.5} y={S * 0.41} fontSize={7} fill={RED} fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 1.2 }}>
            particle · 0.98
          </motion.text>
          {!reduce && (
            <motion.line x1={0} x2={S} y1={0} y2={0} stroke={RED} strokeOpacity={0.35} initial={{ y: 0 }} animate={{ y: [0, S, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }} />
          )}
        </g>
      );
    case "epipolar": {
      const m = -0.32;
      const b0 = 0.66;
      return (
        <g>
          <motion.line x1={0} y1={S * b0} x2={S} y2={S * (m + b0)} stroke={RED} strokeWidth={1.4} {...draw} transition={t} />
          <motion.circle cx={S * 0.12} cy={S * 0.24} r={4.5} fill={INK} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: reduce ? 0 : 0.4 }} style={{ transformOrigin: `${S * 0.12}px ${S * 0.24}px` }} />
          <motion.path d={`M ${S * 0.12} ${S * 0.24} L ${S * 0.55} ${S * (m * 0.55 + b0)}`} stroke={INK} strokeWidth={0.8} strokeDasharray="2 3" fill="none" {...draw} transition={{ ...t, delay: reduce ? 0 : 1.3 }} />
          <text x={S * 0.12 - 3} y={S * 0.24 - 8} fontSize={8} fill={INK} fontFamily={mono}>q</text>
          <text x={S - 4} y={S * (m + b0) - 5} textAnchor="end" fontSize={7} fill={RED} fontFamily={mono}>l = F·q</text>
        </g>
      );
    }
    case "render":
      return (
        <g>
          <motion.circle cx={S * 0.42} cy={S * 0.5} r={S * 0.2} fill="none" stroke={INK} strokeWidth={0.8} strokeDasharray="3 4" {...draw} transition={t} />
          <text x={S * 0.42} y={S * 0.5 + S * 0.2 + 12} textAnchor="middle" fontSize={7} fill={INK} fontFamily={mono}>focal plane</text>
        </g>
      );
    case "fusion": {
      const pts = [
        [0.5, 0.1],
        [0.14, 0.34],
        [0.86, 0.34],
        [0.18, 0.86],
        [0.82, 0.86],
      ];
      return (
        <g>
          {pts.map(([px, py], i) => (
            <motion.line key={i} x1={S * px} y1={S * py} x2={S * 0.5} y2={S * 0.56} stroke={RED} strokeWidth={0.9} strokeOpacity={0.7} {...draw} transition={{ ...t, delay: reduce ? 0 : 0.2 + i * 0.12 }} />
          ))}
          {pts.map(([px, py], i) => (
            <text key={`l${i}`} x={S * px + (px < 0.5 ? -9 : px > 0.5 ? 6 : -4)} y={S * py + (py < 0.2 ? -6 : 4)} fontSize={7} fill={INK} fontFamily={mono}>
              C{i + 1}
            </text>
          ))}
          <motion.text x={S * 0.5} y={S * 0.56 + 3} textAnchor="middle" fontSize={8} fill="#fffff8" fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 1.2 }}>
            OK
          </motion.text>
        </g>
      );
    }
    case "peak":
      return (
        <motion.text x={S * 0.93} y={S * 0.06 + 4} textAnchor="middle" fontSize={7} fill="#b8860b" fontFamily={mono} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.8 }}>
          9.42
        </motion.text>
      );
    case "signal":
      return <text x={6} y={S - 6} fontSize={7} fill={INK} fontFamily={mono}>x(t)</text>;
    case "control":
      return (
        <g>
          <text x={S - 6} y={S * 0.3 - 5} textAnchor="end" fontSize={7} fill={INK} fontFamily={mono}>setpoint</text>
          <text x={S - 6} y={S - 6} textAnchor="end" fontSize={7} fill={INK} fontFamily={mono}>t →</text>
        </g>
      );
    case "gradcam":
      return <text x={6} y={S - 6} fontSize={7} fill={INK} fontFamily={mono}>grad-cam · resnet</text>;
    default:
      return null;
  }
}

export function DotMatrix({ kind }: { kind: Scene }) {
  const reduce = useReducedMotion();
  const dots = useMemo(() => {
    const out: (Dot & { x: number; y: number; i: number })[] = [];
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const x = (i + 0.5) / N;
        const y = (j + 0.5) / N;
        out.push({ ...scene(kind, x, y), x: (i + 0.5) * STEP, y: (j + 0.5) * STEP, i: i + j });
      }
    return out;
  }, [kind]);

  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="h-auto w-full" role="img" aria-label={`Dot-matrix illustration: ${kind}`}>
      {dots.map((d, k) => (
        <circle
          key={k}
          className="dot"
          cx={d.x}
          cy={d.y}
          r={d.r ?? 2.1}
          fill={d.c ?? RED}
          fillOpacity={Math.min(1, d.v)}
          style={{ transitionDelay: reduce ? "0s" : `${(d.i / (2 * N)) * 0.45}s` }}
        />
      ))}
      <g key={kind}>
        <Overlay kind={kind} reduce={reduce} />
      </g>
    </svg>
  );
}
