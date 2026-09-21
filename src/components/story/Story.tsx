"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { chapters, storyMeta } from "@/content/story";
import { site } from "@/content/site";
import { Dashboard } from "./Dashboard";
import { Expandables } from "./Expandables";
import { RichText } from "./RichText";
import { TocRail } from "./TocRail";

export function Story() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = els.indexOf(e.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const ch = chapters[active];

  return (
    <>
      <TocRail active={active} />

      <div className="mx-auto max-w-[1180px] px-6 pb-24 md:px-10">
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-14 lg:pt-7">
          <p className="text-[1.05rem] tracking-wide text-ink">{storyMeta.kicker}</p>
          <nav aria-label="Links" className="flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem] text-ink-2">
            <Link href="/" className="hover:text-red">
              Portfolio
            </Link>
            <a href={site.links.github} target="_blank" rel="noreferrer noopener" className="hover:text-red">
              GitHub
            </a>
            <a href={site.links.linkedin} target="_blank" rel="noreferrer noopener" className="hover:text-red">
              LinkedIn
            </a>
            <a href={`mailto:${site.email}`} className="hover:text-red">
              Email
            </a>
          </nav>
        </header>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,42rem)_1fr] lg:gap-16">
          <div className="min-w-0">
            <h1 className="text-[clamp(2.6rem,7vw,4.4rem)] leading-[1.02] tracking-[-0.01em] text-ink">{storyMeta.title}</h1>
            <p className="mt-4 text-[1.05rem] italic text-ink-2">{storyMeta.byline}</p>

            <div className="mt-8 space-y-5 text-[1.2rem] leading-[1.6] text-ink">
              {storyMeta.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Expandables items={storyMeta.expandables} />

            <div className="mt-8 lg:hidden">
              <Dashboard index={active} compact />
            </div>

            {chapters.map((c) => (
              <section key={c.id} id={c.id} className="scroll-mt-20 pt-20">
                <h2 className="text-[clamp(2rem,5vw,2.6rem)] leading-[1.05] text-ink">
                  {c.year}: {c.title}
                </h2>
                <div className="mt-6 space-y-5 text-[1.2rem] leading-[1.6] text-ink">
                  {c.paragraphs.map((p, i) => (
                    <p key={i}>
                      <RichText text={p} />
                    </p>
                  ))}
                </div>
                {c.aside && (
                  <aside className="mt-7 rounded-md border border-ink/70 bg-bg-2/60 px-5 py-4">
                    <h3 className="text-[1.4rem] leading-tight text-ink">{c.aside.title}</h3>
                    <p className="mt-2 text-[1.05rem] leading-relaxed text-ink-2">{c.aside.body}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {c.aside.tags.map((t) => (
                        <li key={t} className="rounded-[4px] border border-ink/60 px-2 py-0.5 text-[0.9rem] leading-tight text-ink">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </section>
            ))}

            <footer className="mt-24 border-t border-ink/20 pt-6 text-[0.95rem] text-muted">
              <p>
                © 2026 {site.name}. The short version lives at the{" "}
                <Link href="/" className="border-b border-ink/30 text-ink hover:border-red hover:text-red">
                  portfolio
                </Link>
                .
              </p>
            </footer>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-8 w-[330px]">
              <Dashboard index={active} />
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 top-0 z-30 border-b border-ink/15 bg-bg/90 px-6 py-2 font-mono text-[11px] text-ink backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate">
            <span className="font-semibold">{ch.year}</span> · {ch.title}
          </span>
          <span className="flex gap-1">
            {chapters.map((c, i) => (
              <span key={c.id} className={`h-1.5 w-1.5 rounded-full border border-ink/50 ${i <= active ? "bg-red border-red" : ""}`} />
            ))}
          </span>
        </div>
      </div>
    </>
  );
}
