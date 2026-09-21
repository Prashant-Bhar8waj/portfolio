import Link from "next/link";
import type { ReactNode } from "react";

/** Renders a paragraph with [text](href) links. Internal hrefs go through next/link so the base path applies. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    const cls = "border-b border-ink/30 pb-px text-ink hover:border-red hover:text-red";
    parts.push(
      href.startsWith("/") ? (
        <Link key={m.index} href={href} className={cls}>
          {label}
        </Link>
      ) : (
        <a key={m.index} href={href} className={cls} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noreferrer noopener">
          {label}
        </a>
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
