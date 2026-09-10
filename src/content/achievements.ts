export type Achievement = {
  kind: "Thesis" | "Publication" | "Award" | "Scholarship" | "Project";
  title: string;
  meta: string;
  body: string;
  href?: string;
};

export const achievements: Achievement[] = [
  {
    kind: "Thesis",
    title: "LUMINA: Learning Unified Multi-View Industrial Inspection with Neural Attention",
    meta: "M.Sc. thesis · Saarland University · Grade 1.0 · 2026",
    body: "Supervised by Prof. Dr.-Ing. Philipp Slusallek (Saarland University / DFKI), Dr.-Ing. Faranak Shamsafar (K|Lens GmbH) and M.Sc. Noshaba Cheema. Industry–academia thesis on geometry-aware multi-view anomaly detection.",
  },
  {
    kind: "Publication",
    title: "LUMINA: Learning Unified Multi-View Industrial Inspection with Neural Attention",
    meta: "P. Bhardwaj, P. Slusallek, F. Shamsafar, N. Cheema · Manuscript under submission, 2026",
    body: "First supervised method evaluated on REAL-IAD, with all baselines retrained on identical splits.",
  },
  {
    kind: "Publication",
    title: "Synchronized Control Strategy of UPQC to Mitigate the Sag and Swell of Voltage",
    meta: "P. Bhardwaj, A. Verma, S. P. Jaiswal, S. L. Dhar · Macromolecular Symposia, February 2023",
    body: "Power-electronics work from the electrical-engineering years. 5 citations.",
  },
  {
    kind: "Award",
    title: "Vice-Chancellor's Gold Medal",
    meta: "Sharda University · 1st rank, B.Tech Electrical & Electronics Engineering · 2021",
    body: "Awarded for the highest standing across the entire programme (CGPA 9.42 / 10).",
  },
  {
    kind: "Scholarship",
    title: "Merit and exchange scholarships",
    meta: "2017 to 2021",
    body: "60% merit scholarship throughout the B.Tech, Uttar Pradesh State Government scholarship, and a Mevlana exchange scholarship for a semester at Manisa Celal Bayar University, Turkey.",
  },
  {
    kind: "Project",
    title: "MemorySynthesizer, a physically-based renderer",
    meta: "Saarland University rendering competition, WS 2024/25",
    body: "Thin-lens depth of field, area lights, rough-dielectric microfacet BSDF, thin-film iridescence, Halton sampling, denoising and ACES post-processing. Competition scene \"Cyberfreak\" under the theme \"Chaos in Harmony\".",
    href: "https://graphics.cg.uni-saarland.de/courses/cg1-2024/RC/chansey/features.html",
  },
];
