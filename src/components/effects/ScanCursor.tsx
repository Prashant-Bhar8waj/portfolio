"use client";

import { useEffect, useRef } from "react";

/**
 * A subtle vision-system crosshair that follows a fine pointer.
 * Disabled on touch devices and for users who prefer reduced motion.
 */
export function ScanCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let raf = 0;
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (label.current) label.current.textContent = `${Math.round(tx)}, ${Math.round(ty)}`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden mix-blend-screen will-change-transform [@media(pointer:fine)]:block motion-reduce:hidden"
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div className="h-8 w-8 rounded-full border border-cyan/35" />
        <div className="absolute left-1/2 top-1/2 h-px w-3 -translate-x-1/2 -translate-y-1/2 bg-cyan/60" />
        <div className="absolute left-1/2 top-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-cyan/60" />
        <span
          ref={label}
          className="absolute left-6 top-5 whitespace-nowrap font-mono text-[9px] tracking-widest text-cyan/50"
        />
      </div>
    </div>
  );
}
