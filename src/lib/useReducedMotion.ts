"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * Hydration-safe reduced-motion preference.
 * Returns `false` during SSR and the first client render (so markup matches),
 * then the real value once mounted. Prefer this over framer-motion's hook wherever
 * the flag changes what gets rendered, not just how it animates.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
