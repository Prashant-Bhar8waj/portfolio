# Prashant Bhardwaj: Portfolio

Personal portfolio for Prashant Bhardwaj, AI and Computer Vision Engineer. Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4 and Framer Motion. The visual concept, "Through the Eyes of AI", frames the site as the view of a computer-vision system: detection boxes, a scanning cursor, a five-camera point-cloud rig in the hero, and interactive case-study visualizations.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start
npm run lint
```

## Where to edit content

Everything personal lives in `src/content/`. Components read from these files, so updating the site rarely requires touching a component.

| File | What it holds |
|---|---|
| `src/content/site.ts` | Name, headline, tagline, status badge, email, links, SEO metadata, deployed URL, navigation |
| `src/content/projects.ts` | The five case studies (problem / approach / architecture / results / contribution), stats, tags, links |
| `src/content/skills.ts` | Skill layers and which projects each skill was used in (drives the hover highlighting) |
| `src/content/journey.ts` | Timeline milestones |
| `src/content/achievements.ts` | Thesis, publications, awards, scholarships |

Static assets:

- `public/prashant.jpg`: portrait used in About
- `public/sketch.jpg`: drawing used in the explainability slider
- `public/og.png`: Open Graph preview image

Before deploying, set `site.url` in `src/content/site.ts` to the real domain. It feeds the sitemap, robots, Open Graph tags, JSON-LD and the machine-readable endpoints.

## Machine-readable endpoints

- `/llms.txt`: plain-text profile for AI agents and crawlers
- `/resume.json`: structured résumé (JSON Resume-style)
- `/sitemap.xml`, `/robots.txt`: generated from content; `/og.png` is the static Open Graph image
- JSON-LD `Person` schema is embedded in the page

## Structure

```
src/
  app/               layout, page, metadata routes (sitemap, robots, llms.txt, resume.json)
  components/
    hero/            Hero + HeroVisual (canvas point-cloud rig, no Three.js)
    sections/        About, Skills, Journey, Achievements
    projects/        Projects list, CaseStudy (tabs), visuals/ (one interactive figure per project)
    layout/          Nav, Footer
    effects/         ScanCursor, DetectionBox
    ui/              Reveal, SectionHeader, Button
  content/           all editable data
  lib/               helpers (motion variants, class utils, reduced-motion hook)
```

## Accessibility and motion

- All interactive figures work with keyboard focus (tabs use roving focus and arrow keys; SVG nodes are focusable buttons; the comparison slider is a native range input).
- `prefers-reduced-motion` disables the auto-orbit, particle flows, cursor and entrance motion; content remains fully visible.
- Skip link, semantic landmarks, and `sr-only` tables/captions for the visualizations.

## Deploy

The site is a static export (`output: "export"` in `next.config.ts`).

**GitHub Pages (configured).** Every push to `main` runs `.github/workflows/deploy.yml`, which builds with `NEXT_PUBLIC_BASE_PATH=/<repo-name>` and publishes the `out/` folder. One-time setup in the repository: Settings, Pages, Source: "GitHub Actions". The site then lives at `https://<user>.github.io/<repo-name>/`. If you rename the repo, update `site.url` in `src/content/site.ts`.

**Custom domain or Vercel.** Leave `NEXT_PUBLIC_BASE_PATH` unset so paths resolve from the root, and set `site.url` to the domain.

Local check of the Pages build:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build && npx serve out
```
