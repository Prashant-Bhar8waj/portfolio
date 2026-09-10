import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";

type Props = {
  index: string;
  tag: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ index, tag, title, lead, align = "left", className }: Props) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      <div className={cn("annot mb-4 flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="whitespace-nowrap text-cyan">{`// ${index}`}</span>
        <span className="h-px w-8 bg-line" />
        <span>{tag}</span>
      </div>
      <h2 className="headline text-balance text-4xl text-ink sm:text-5xl md:text-6xl">{title}</h2>
      {lead ? (
        <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed text-ink-2", align === "center" && "mx-auto")}>
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}
