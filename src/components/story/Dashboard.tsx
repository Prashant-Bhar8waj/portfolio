"use client";

import { chapters, chips } from "@/content/story";
import { DotMatrix } from "./DotMatrix";
import { Counter } from "./Counter";
import { cn } from "@/lib/cn";

export function Dashboard({ index, compact = false }: { index: number; compact?: boolean }) {
  const ch = chapters[index];
  return (
    <div className={cn("rounded-xl border-[1.5px] border-ink/60 bg-bg p-3 font-mono text-[11px] text-ink", compact && "p-2.5")}>
      <div className="relative">
        <div key={ch.year} className="absolute left-2 top-2 z-10 rounded-sm border border-ink bg-bg px-1.5 py-0.5 text-[11px] font-semibold tracking-wide motion-safe:[animation:scrub-enter-right_.45s_cubic-bezier(.2,.7,.2,1)_both]">
          {ch.year}
        </div>
        <div className="rounded-md border border-ink/30 bg-bg-2 p-1.5">
          <DotMatrix kind={ch.scene} />
        </div>
        <p key={`${ch.id}-cap`} className="mt-2 px-1 text-[10.5px] leading-snug text-ink-2 motion-safe:[animation:details-in_.5s_ease_both]">
          {ch.caption}
        </p>
      </div>

      <dl className={cn("mt-3 grid gap-x-3 gap-y-2.5 border-t border-ink/20 pt-3", ch.metrics.length > 3 ? "grid-cols-2" : "grid-cols-3")}>
        {ch.metrics.map((m) => (
          <div key={m.label} className="min-w-0">
            <dd className="truncate text-[15px] font-semibold leading-none tracking-tight text-ink">
              {"value" in m ? <Counter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} /> : m.text}
            </dd>
            <dt className="mt-1 text-[9.5px] uppercase tracking-[0.12em] text-muted">{m.label}</dt>
          </div>
        ))}
      </dl>

      {!compact && (
        <>
          <div className="mt-3 border-t border-ink/20 pt-3">
            <p className="mb-2 text-[9.5px] uppercase tracking-[0.12em] text-muted">toolbox</p>
            <div className="grid grid-cols-5 gap-1.5">
              {chips.map((c) => {
                const on = c.since <= index;
                const fresh = c.since === index;
                return (
                  <div
                    key={c.label}
                    title={c.label}
                    className={cn(
                      "grid aspect-square place-items-center rounded-[5px] border text-center text-[8px] leading-none transition-colors duration-500",
                      on ? "border-red bg-red/[0.06] text-red" : "border-ink/25 text-ink/25",
                      fresh && "motion-safe:[animation:chip-pop_.5s_ease_both]",
                    )}
                  >
                    <span className="px-0.5">{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 border-t border-ink/20 pt-3">
            <div className="flex gap-1">
              {chapters.map((c, i) => (
                <span key={c.id} className={cn("h-1.5 w-1.5 rounded-full border border-ink/50 transition-colors duration-500", i <= index ? "bg-red border-red" : "bg-transparent")} />
              ))}
            </div>
            <span className="text-[9.5px] uppercase tracking-[0.12em] text-muted">
              {index + 1} / {chapters.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
