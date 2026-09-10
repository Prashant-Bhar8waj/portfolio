import { achievements } from "@/content/achievements";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const kindColor: Record<string, string> = {
  Thesis: "text-cyan",
  Publication: "text-violet",
  Award: "text-orange",
  Scholarship: "text-orange",
  Project: "text-cyan",
};

export function Achievements() {
  return (
    <section id="achievements" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24 md:py-32">
      <SectionHeader
        index="05"
        tag="publications & achievements"
        title={
          <>
            Evidence, <span className="serif-accent text-violet">peer-reviewed</span> and otherwise.
          </>
        }
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {achievements.map((a, i) => (
          <Reveal key={`${a.kind}-${a.title}`} delay={(i % 2) * 0.06}>
            <li className="glass group relative h-full rounded-2xl p-6 transition-colors hover:border-white/20">
              <div className="mb-3 flex items-center justify-between">
                <span className={cn("annot", kindColor[a.kind])}>{a.kind}</span>
                <span className="font-mono text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="text-lg font-semibold leading-snug tracking-tight text-ink">
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noreferrer noopener" className="underline-offset-4 hover:underline">
                    {a.title} <span aria-hidden>↗</span>
                  </a>
                ) : (
                  a.title
                )}
              </h3>
              <p className="mt-2 text-sm text-ink-2">{a.meta}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{a.body}</p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
