export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const accentText = {
  cyan: "text-cyan",
  violet: "text-violet",
  orange: "text-orange",
} as const;

export const accentBg = {
  cyan: "bg-cyan",
  violet: "bg-violet",
  orange: "bg-orange",
} as const;

export const accentBorder = {
  cyan: "border-cyan/40",
  violet: "border-violet/40",
  orange: "border-orange/40",
} as const;

export const accentHex = {
  cyan: "#22d3ee",
  violet: "#a78bfa",
  orange: "#fb923c",
} as const;
