"use client";

import { useEffect } from "react";

/** Flags the document as light-themed so the body background matches the paper wrapper on overscroll. */
export function PaperTheme() {
  useEffect(() => {
    document.documentElement.dataset.theme = "paper";
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, []);
  return null;
}
