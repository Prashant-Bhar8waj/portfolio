"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

const W = 480;
const H = 250;

const stages = [
  { id: "data", label: "DATA", sub: "S3 · Label Studio", detail: "Versioned datasets with balanced train/test splits. Low-confidence samples flow back for annotation in Label Studio (active learning)." },
  { id: "train", label: "TRAIN", sub: "SageMaker · DDP · AMP", detail: "Distributed multi-GPU training with mixed precision, Optuna hyperparameter search with median pruning, fixed seeds for reproducibility." },
  { id: "pack", label: "PACKAGE", sub: "Docker · registry", detail: "Training and inference run from the same container image, so what was validated on the workstation is what ships to the line." },
  { id: "deploy", label: "DEPLOY", sub: "Lambda · TorchServe · edge", detail: "Serverless inference on AWS Lambda for the SageMaker project; real-time inference on production hardware at K|Lens (100 FPS for IV-bag inspection)." },
  { id: "monitor", label: "MONITOR", sub: "CI/CD · thresholds", detail: "GitHub Actions pipelines, confidence-threshold optimization and ablation reports feed decisions back into the next dataset iteration." },
];

export function PipelineViz() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(1);
  const gap = W / stages.length;
  const cy = 90;

  return (
    <figure className="rounded-2xl border border-line bg-bg/60 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="ML pipeline from data to training, packaging, deployment and monitoring, with a feedback loop back to data.">
        <defs>
          <marker id="pipe-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#7c889e" />
          </marker>
        </defs>

        {/* main path */}
        <path id="pipe-main" d={`M ${gap / 2 + 26} ${cy} L ${W - gap / 2 - 26} ${cy}`} stroke="rgba(148,163,184,0.35)" strokeWidth={1} fill="none" />
        {/* feedback loop */}
        <path
          id="pipe-loop"
          d={`M ${W - gap / 2} ${cy + 28} C ${W - gap / 2} ${cy + 80}, ${gap / 2} ${cy + 80}, ${gap / 2} ${cy + 28}`}
          stroke="rgba(167,139,250,0.5)"
          strokeWidth={1}
          strokeDasharray="3 5"
          fill="none"
          markerEnd="url(#pipe-arrow)"
        />
        <text x={W / 2} y={cy + 72} textAnchor="middle" fontSize={8} fill="#a78bfa" fontFamily="var(--font-geist-mono), monospace" letterSpacing={1.2}>
          ACTIVE-LEARNING FEEDBACK
        </text>

        {!reduce &&
          [0, 1, 2].map((n) => (
            <circle key={n} r={3} fill="#22d3ee">
              <animateMotion dur="4.5s" begin={`${n * 1.5}s`} repeatCount="indefinite">
                <mpath href="#pipe-main" />
              </animateMotion>
            </circle>
          ))}
        {!reduce && (
          <circle r={2.5} fill="#a78bfa">
            <animateMotion dur="5s" begin="1s" repeatCount="indefinite">
              <mpath href="#pipe-loop" />
            </animateMotion>
          </circle>
        )}

        {stages.map((s, i) => {
          const x = gap / 2 + i * gap;
          const on = active === i;
          return (
            <g
              key={s.id}
              transform={`translate(${x}, ${cy})`}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={`${s.label}: ${s.sub}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="cursor-pointer outline-none"
            >
              <rect x={-26} y={-26} width={52} height={52} rx={12} fill="#0d1526" stroke={on ? "#22d3ee" : "rgba(148,163,184,0.3)"} strokeWidth={on ? 1.5 : 1} />
              {on && <rect x={-30} y={-30} width={60} height={60} rx={14} fill="none" stroke="#22d3ee" strokeOpacity={0.3} />}
              <text textAnchor="middle" y={-4} fontSize={8} fill={on ? "#22d3ee" : "#e6edf7"} fontFamily="var(--font-geist-mono), monospace" letterSpacing={1.2}>
                {s.label}
              </text>
              <text textAnchor="middle" y={9} fontSize={6.5} fill="#7c889e" fontFamily="var(--font-geist-mono), monospace">
                {s.sub.split(" · ")[0]}
              </text>
              <text textAnchor="middle" y={-40} fontSize={8} fill="#7c889e" fontFamily="var(--font-geist-mono), monospace">
                0{i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-2 min-h-[5.5rem] rounded-xl border border-line bg-bg/70 p-4">
        <p className="annot mb-1.5 flex items-center gap-2">
          <span className="text-cyan">{stages[active].label}</span>
          <span>{stages[active].sub}</span>
        </p>
        <p className={cn("text-sm leading-relaxed text-ink-2")}>{stages[active].detail}</p>
      </div>
      <figcaption className="sr-only">Hover or focus a stage to read what it involves.</figcaption>
    </figure>
  );
}
