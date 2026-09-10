"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/content/projects";
import { accentText, cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "./visuals/ProjectVisual";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function CaseStudy({ project, flip }: { project: Project; flip?: boolean }) {
  const [tab, setTab] = useState(0);
  const id = useId();
  const reduce = useReducedMotion();
  const accent = accentText[project.accent];

  const onKey = (e: React.KeyboardEvent) => {
    const n = project.sections.length;
    if (e.key === "ArrowRight") setTab((t) => (t + 1) % n);
    else if (e.key === "ArrowLeft") setTab((t) => (t - 1 + n) % n);
    else if (e.key === "Home") setTab(0);
    else if (e.key === "End") setTab(n - 1);
    else return;
    e.preventDefault();
    requestAnimationFrame(() => {
      (document.getElementById(`${id}-tab-${tab}`) as HTMLElement | null)?.focus();
    });
  };

  return (
    <Reveal>
      <article
        id={`project-${project.id}`}
        className="glass relative overflow-hidden rounded-3xl p-6 md:p-10"
        aria-labelledby={`${id}-title`}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-40 h-80 w-80 rounded-full blur-[110px]",
            flip ? "-left-20" : "-right-20",
            project.accent === "cyan" && "bg-cyan/15",
            project.accent === "violet" && "bg-violet/15",
            project.accent === "orange" && "bg-orange/15",
          )}
        />

        <header className="relative mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="annot mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className={cn("whitespace-nowrap", accent)}>{`// ${project.index}`}</span>
              <span>{project.kicker}</span>
            </p>
            <h3 id={`${id}-title`} className="headline text-3xl text-ink sm:text-4xl md:text-5xl">
              {project.title}
            </h3>
          </div>
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.tags.map((t) => (
              <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-2">
                {t}
              </li>
            ))}
          </ul>
        </header>

        <div className={cn("relative grid gap-8 lg:grid-cols-2 lg:gap-12", flip && "lg:[&>*:first-child]:order-2")}>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProjectVisual id={project.id} />
            <p className="mt-5 text-base leading-relaxed text-ink-2">{project.summary}</p>
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
              {project.stats.map((s) => (
                <div key={s.label} className="bg-bg/70 p-3">
                  <dt className="annot text-[10px]">{s.label}</dt>
                  <dd className={cn("mt-1 font-mono text-sm font-medium", accent)}>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <div role="tablist" aria-label={`${project.title} details`} className="flex flex-wrap gap-1 border-b border-line" onKeyDown={onKey}>
              {project.sections.map((s, i) => (
                <button
                  key={s.title}
                  id={`${id}-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === i}
                  aria-controls={`${id}-panel-${i}`}
                  tabIndex={tab === i ? 0 : -1}
                  onClick={() => setTab(i)}
                  className={cn(
                    "relative -mb-px px-3 py-2.5 text-sm transition-colors",
                    tab === i ? "text-ink" : "text-muted hover:text-ink-2",
                  )}
                >
                  {s.title}
                  {tab === i && (
                    <motion.span
                      layoutId={`${id}-underline`}
                      className={cn("absolute inset-x-2 -bottom-px h-px", project.accent === "cyan" ? "bg-cyan" : project.accent === "violet" ? "bg-violet" : "bg-orange")}
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="relative min-h-[14rem] pt-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab}
                  id={`${id}-panel-${tab}`}
                  role="tabpanel"
                  aria-labelledby={`${id}-tab-${tab}`}
                  initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                  transition={{ duration: reduce ? 0.01 : 0.28 }}
                  className="space-y-4 text-[15px] leading-relaxed text-ink-2 md:text-base"
                >
                  {project.sections[tab].body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {project.links && (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn("inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline", accent)}
                  >
                    {l.label} <span aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
