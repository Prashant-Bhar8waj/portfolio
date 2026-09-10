"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Milestone comparison from the LUMINA development track (real numbers from the thesis),
 * plus efficiency figures for the final model. Single measure per chart, one hue, direct labels.
 */

const milestones = [
  { label: "Single-view CNN (YOLOv8-inspired)", auroc: 84, note: "Milestone 1" },
  { label: "Multi-view CNN, early fusion", auroc: 91, note: "Milestone 3" },
  { label: "LUMINA, hybrid epipolar transformer", auroc: 97.17, note: "Final" },
];

const efficiency = [
  { label: "Trainable parameters", value: "12.9%", sub: "of the full model" },
  { label: "Attention compute", value: "−46–57%", sub: "vs. dense cross-view" },
  { label: "Latency per 5-view sample", value: "60–80 ms", sub: "RTX 6000" },
];

export function ModelCompareViz() {
  const reduce = useReducedMotion();
  const max = 100;

  return (
    <figure className="rounded-2xl border border-line bg-bg/60 p-5 md:p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <p className="annot">avg. auroc · study categories</p>
        <p className="font-mono text-[10px] tracking-widest text-muted">0 to 100%</p>
      </div>

      <ol className="space-y-4" aria-label="Accuracy across model milestones">
        {milestones.map((m, i) => {
          const last = i === milestones.length - 1;
          return (
            <li key={m.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="text-ink-2">
                  <span className="mr-2 font-mono text-[10px] text-muted">{m.note}</span>
                  {m.label}
                </span>
                <span className="font-mono text-sm tabular-nums text-ink">{m.auroc.toFixed(m.auroc % 1 ? 2 : 0)}%</span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.05]" role="presentation">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-r-[4px]"
                  style={{ background: last ? "#22d3ee" : "rgba(34,211,238,0.45)" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(m.auroc / max) * 100}%` }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        {efficiency.map((e) => (
          <div key={e.label} className="bg-bg/70 p-3">
            <p className="annot text-[9px]">{e.label}</p>
            <p className="mt-1.5 font-mono text-base text-ink">{e.value}</p>
            <p className="text-[11px] text-muted">{e.sub}</p>
          </div>
        ))}
      </div>

      <figcaption className="mt-4 text-[11px] leading-relaxed text-muted">
        Accuracy of the three development milestones on the LUMINA study categories, as reported in the thesis. Production figures for the K|Lens detection and segmentation models are listed in the stats below.
      </figcaption>

      <table className="sr-only">
        <caption>Average AUROC by milestone</caption>
        <thead>
          <tr>
            <th>Model</th>
            <th>AUROC</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((m) => (
            <tr key={m.label}>
              <td>{m.label}</td>
              <td>{m.auroc}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
