"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  label: string;
  confidence?: number;
  children: ReactNode;
  className?: string;
  accent?: "cyan" | "violet" | "orange";
  /** Keep the brackets visible after the reveal (default: fade to a faint state). */
  persistent?: boolean;
};

const colors = { cyan: "#22d3ee", violet: "#a78bfa", orange: "#fb923c" };

/**
 * Wraps content in an animated object-detection box that "identifies" it when scrolled into view.
 */
export function DetectionBox({ label, confidence = 0.98, children, className, accent = "cyan", persistent }: Props) {
  const reduce = useReducedMotion();
  const c = colors[accent];
  return (
    <motion.div
      className={cn("relative", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
    >
      {children}
      <motion.div
        aria-hidden
        className="corners pointer-events-none absolute inset-0"
        style={{ ["--c" as string]: c, ["--s" as string]: "16px" }}
        variants={{
          hidden: { opacity: 0, scale: reduce ? 1 : 1.06 },
          show: {
            opacity: persistent ? [0, 1, 1] : [0, 1, 0.45],
            scale: 1,
            transition: { duration: reduce ? 0 : 1.6, times: [0, 0.35, 1], ease: "easeOut" },
          },
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-3 left-0 flex items-center gap-2 rounded-sm px-1.5 py-0.5 font-mono text-[10px] tracking-widest"
        style={{ background: c, color: "#060a14" }}
        variants={{
          hidden: { opacity: 0, y: 6 },
          show: {
            opacity: persistent ? 1 : [0, 1, 1, 0.85],
            y: 0,
            transition: { duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 0.4 },
          },
        }}
      >
        <span>{label}</span>
        <span className="opacity-70">{confidence.toFixed(2)}</span>
      </motion.div>
    </motion.div>
  );
}
