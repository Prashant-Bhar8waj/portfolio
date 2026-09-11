import { projects } from "@/content/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CaseStudy } from "./CaseStudy";

export function Projects() {
  return (
    <section id="work" className="relative scroll-mt-24 py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-line to-transparent" />
        <div className="absolute right-0 top-1/4 h-[40vh] w-[40vw] rounded-full bg-violet/[0.07] blur-[120px]" />
      </div>
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="02"
          tag="featured work"
          title={
            <>
              Case studies in <span className="serif-accent text-cyan">machine perception.</span>
            </>
          }
          lead="Four systems, from a thesis that set a new benchmark result to models running on production lines. Each one is presented the way I'd brief a team: the problem, the approach, and what actually happened."
        />
        <div className="space-y-8 md:space-y-12">
          {projects.map((p, i) => (
            <CaseStudy key={p.id} project={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
