import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Button({ href, children, variant = "primary", className, ...rest }: Props) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-[transform,box-shadow,background-color] duration-300 focus-visible:outline-cyan active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-ink text-bg hover:bg-cyan hover:shadow-glow-cyan"
      : "glass text-ink hover:border-cyan/40 hover:bg-white/[0.06]";
  const external = href.startsWith("http");
  const Comp = external || href.endsWith(".pdf") ? "a" : Link;
  return (
    <Comp
      href={href}
      className={cn(base, styles, className)}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      {...rest}
    >
      {children}
    </Comp>
  );
}
