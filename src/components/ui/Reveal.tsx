"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { easeOut } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

export function Reveal({ delay = 0, y = 24, children, ...rest }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: reduce ? 0.01 : 0.75, ease: easeOut, delay: reduce ? 0 : delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
