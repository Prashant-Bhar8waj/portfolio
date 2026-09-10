import Link from "next/link";
import { nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="annot mb-2">end of stream</p>
          <p className="text-sm text-ink-2">
            © {new Date().getFullYear()} {site.name} · {site.location}
          </p>
          <p className="mt-2 font-mono text-[11px] text-muted">
            Machine-readable:{" "}
            <Link className="hover:text-cyan" href="/llms.txt">
              /llms.txt
            </Link>{" "}
            ·{" "}
            <Link className="hover:text-cyan" href="/resume.json">
              /resume.json
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-2">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-ink">
              {n.label}
            </a>
          ))}
          <a href={`mailto:${site.email}`} className="hover:text-ink">
            Email
          </a>
          <a href={site.links.github} target="_blank" rel="noreferrer noopener" className="hover:text-ink">
            GitHub ↗
          </a>
          <a href={site.links.linkedin} target="_blank" rel="noreferrer noopener" className="hover:text-ink">
            LinkedIn ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
