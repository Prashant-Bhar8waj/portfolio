import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { skillLayers } from "@/content/skills";
import { journey } from "@/content/journey";
import { achievements } from "@/content/achievements";

export const dynamic = "force-static";

/** Machine-readable profile for AI agents and crawlers (llms.txt convention). */
export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.role}. ${site.seo.description}`,
    "",
    `- Location: ${site.location}`,
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.links.linkedin}`,
    `- GitHub: ${site.links.github}`,
    `- Résumé (JSON): ${site.url}/resume.json`,
    "",
    "## Projects",
    "",
    ...projects.flatMap((p) => [
      `### ${p.title}: ${p.kicker}`,
      p.summary,
      ...p.sections.map((s) => `- ${s.title}: ${s.body.join(" ")}`),
      `- Stats: ${p.stats.map((s) => `${s.label} ${s.value}`).join("; ")}`,
      "",
    ]),
    "## Skills",
    "",
    ...skillLayers.map((l) => `- ${l.label}: ${l.skills.map((s) => s.name).join(", ")}`),
    "",
    "## Journey",
    "",
    ...journey.map((m) => `- ${m.period}: ${m.title} (${m.org}). ${m.body}`),
    "",
    "## Publications & achievements",
    "",
    ...achievements.map((a) => `- [${a.kind}] ${a.title}. ${a.meta}. ${a.body}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
