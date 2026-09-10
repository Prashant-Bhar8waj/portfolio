"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { skillLayers } from "@/content/skills";
import { projects, type ProjectId } from "@/content/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { accentHex, cn } from "@/lib/cn";

type Line = { x1: number; y1: number; x2: number; y2: number; color: string };

/**
 * Skills laid out like the layers of a network. Hovering or focusing a skill lights up
 * the projects (output layer) where it was used; hovering a project lights up its skills.
 */
export function Skills() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const skillRefs = useRef(new Map<string, HTMLButtonElement>());
  const projectRefs = useRef(new Map<string, HTMLAnchorElement>());

  const skillMap = new Map(skillLayers.flatMap((l) => l.skills.map((s) => [s.name, { ...s, accent: l.accent }] as const)));

  const highlightedProjects = new Set<ProjectId>(activeSkill ? skillMap.get(activeSkill)?.usedIn ?? [] : []);
  const highlightedSkills = new Set<string>(
    activeProject ? [...skillMap.values()].filter((s) => s.usedIn.includes(activeProject)).map((s) => s.name) : [],
  );

  const compute = useCallback(() => {
    const root = wrap.current;
    if (!root || window.innerWidth < 1024) {
      setLines([]);
      return;
    }
    const rb = root.getBoundingClientRect();
    const out: Line[] = [];
    const pairs: [string, ProjectId][] = [];
    if (activeSkill) skillMap.get(activeSkill)?.usedIn.forEach((p) => pairs.push([activeSkill, p]));
    else if (activeProject) highlightedSkills.forEach((s) => pairs.push([s, activeProject]));
    for (const [s, p] of pairs) {
      const a = skillRefs.current.get(s)?.getBoundingClientRect();
      const b = projectRefs.current.get(p)?.getBoundingClientRect();
      if (!a || !b) continue;
      out.push({
        x1: a.right - rb.left,
        y1: a.top + a.height / 2 - rb.top,
        x2: b.left - rb.left,
        y2: b.top + b.height / 2 - rb.top,
        color: accentHex[skillMap.get(s)?.accent ?? "cyan"],
      });
    }
    setLines(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSkill, activeProject]);

  useLayoutEffect(compute, [compute]);
  useEffect(() => {
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [compute]);

  return (
    <section id="skills" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <SectionHeader
        index="03"
        tag="capabilities"
        title={
          <>
            A network of skills, <span className="serif-accent text-orange">wired</span> to real work.
          </>
        }
        lead="Hover a skill to see where it was used. Hover a project to see what it took."
      />

      <div ref={wrap} className="relative grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-20">
        <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible lg:block">
          {lines.map((l, i) => (
            <path
              key={i}
              d={`M ${l.x1} ${l.y1} C ${l.x1 + 80} ${l.y1}, ${l.x2 - 80} ${l.y2}, ${l.x2} ${l.y2}`}
              fill="none"
              stroke={l.color}
              strokeOpacity={0.6}
              strokeWidth={1.2}
              className="animate-dash"
              strokeDasharray="4 6"
            />
          ))}
        </svg>

        <div className="space-y-6">
          {skillLayers.map((layer, li) => (
            <Reveal key={layer.id} delay={li * 0.05}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                <div className="w-36 shrink-0 pt-1.5">
                  <p className="annot flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: accentHex[layer.accent] }} />
                    {layer.label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted/70">layer {li + 1}</p>
                </div>
                <ul className="flex flex-wrap gap-2" aria-label={`${layer.label} skills`}>
                  {layer.skills.map((s) => {
                    const dim = (activeSkill && activeSkill !== s.name) || (activeProject && !highlightedSkills.has(s.name));
                    const lit = activeSkill === s.name || highlightedSkills.has(s.name);
                    return (
                      <li key={s.name}>
                        <button
                          type="button"
                          ref={(el) => {
                            if (el) skillRefs.current.set(s.name, el);
                          }}
                          onMouseEnter={() => setActiveSkill(s.name)}
                          onMouseLeave={() => setActiveSkill(null)}
                          onFocus={() => setActiveSkill(s.name)}
                          onBlur={() => setActiveSkill(null)}
                          aria-describedby={`skill-desc-${layer.id}`}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-300",
                            lit ? "border-transparent text-bg" : "border-line bg-white/[0.03] text-ink-2 hover:border-white/20 hover:text-ink",
                            dim && "opacity-35",
                          )}
                          style={lit ? { background: accentHex[layer.accent], boxShadow: `0 0 24px -6px ${accentHex[layer.accent]}` } : undefined}
                        >
                          {s.name}
                          <span className="sr-only">
                            , used in {s.usedIn.map((id) => projects.find((p) => p.id === id)?.title).join(", ")}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p id={`skill-desc-${layer.id}`} className="sr-only">
                  Activating highlights the projects where this skill was used.
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="lg:pt-1.5">
          <p className="annot mb-3">output layer · projects</p>
          <ul className="space-y-2">
            {projects.map((p) => {
              const lit = highlightedProjects.has(p.id) || activeProject === p.id;
              const dim = (activeSkill && !lit) || (activeProject && activeProject !== p.id);
              return (
                <li key={p.id}>
                  <a
                    href={`#project-${p.id}`}
                    ref={(el) => {
                      if (el) projectRefs.current.set(p.id, el);
                    }}
                    onMouseEnter={() => setActiveProject(p.id)}
                    onMouseLeave={() => setActiveProject(null)}
                    onFocus={() => setActiveProject(p.id)}
                    onBlur={() => setActiveProject(null)}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-300",
                      lit ? "border-white/25 bg-white/[0.06] text-ink" : "border-line bg-white/[0.02] text-ink-2",
                      dim && "opacity-35",
                    )}
                    style={lit ? { boxShadow: `0 0 30px -12px ${accentHex[p.accent]}` } : undefined}
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted">{p.index}</span>
                      {p.title}
                    </span>
                    <span
                      className={cn("h-2 w-2 rounded-full transition-transform", lit && "scale-125")}
                      style={{ background: lit ? accentHex[p.accent] : "rgba(148,163,184,0.3)" }}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
