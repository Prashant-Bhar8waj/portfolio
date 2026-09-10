import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { skillLayers } from "@/content/skills";
import { journey } from "@/content/journey";
import { achievements } from "@/content/achievements";

export const dynamic = "force-static";

/** Structured résumé, loosely following the JSON Resume schema. */
export function GET() {
  const body = {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: site.name,
      label: site.role,
      email: site.email,
      url: site.url,
      summary: site.seo.description,
      location: { city: "Saarbrücken", countryCode: "DE" },
      profiles: [
        { network: "LinkedIn", url: site.links.linkedin },
        { network: "GitHub", url: site.links.github },
      ],
    },
    work: [
      {
        name: "K|Lens GmbH",
        position: "Computer Vision Engineer, AI Group",
        location: "Saarbrücken, Germany",
        startDate: "2023-06",
        summary: journey.find((j) => j.org.startsWith("K|Lens"))?.body,
      },
      {
        name: "Global Instrumentation",
        position: "Engineering Intern",
        location: "Ghaziabad, India",
        startDate: "2019-05",
        endDate: "2019-07",
        summary: "Developed a real-time simulation environment to safely test control algorithms before deployment on hardware.",
      },
    ],
    education: [
      {
        institution: "Saarland University",
        area: "Visual Computing",
        studyType: "M.Sc.",
        startDate: "2022-03",
        endDate: "2026",
        score: "Thesis grade 1.0",
      },
      {
        institution: "Sharda University",
        area: "Electrical and Electronics Engineering",
        studyType: "B.Tech",
        startDate: "2017-08",
        endDate: "2021-05",
        score: "CGPA 9.42/10, Vice-Chancellor's Gold Medal",
      },
    ],
    publications: achievements
      .filter((a) => a.kind === "Publication")
      .map((a) => ({ name: a.title, summary: `${a.meta}. ${a.body}` })),
    awards: achievements
      .filter((a) => a.kind === "Award" || a.kind === "Scholarship")
      .map((a) => ({ title: a.title, awarder: a.meta, summary: a.body })),
    skills: skillLayers.map((l) => ({ name: l.label, keywords: l.skills.map((s) => s.name) })),
    projects: projects.map((p) => ({
      name: p.title,
      description: p.summary,
      highlights: p.stats.map((s) => `${s.label}: ${s.value}`),
      keywords: p.tags,
      url: p.links?.[0]?.href,
    })),
    meta: { canonical: `${site.url}/resume.json`, lastModified: new Date().toISOString().slice(0, 10) },
  };
  return Response.json(body, { headers: { "Cache-Control": "public, max-age=3600" } });
}
