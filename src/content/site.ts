/**
 * Single source of truth for personal details. Edit here, not in components.
 */
export const site = {
  name: "Prashant Bhardwaj",
  role: "AI & Computer Vision Engineer",
  tagline: "I Teach Machines to See.",
  subline:
    "AI and Computer Vision Engineer building intelligent visual systems, from multi-view inspection and anomaly detection to transformers and production-ready ML pipelines.",
  statusBadge: "Open to AI & Computer Vision Opportunities",
  location: "Saarbrücken, Germany",
  email: "prashant.bhar8waj@gmail.com",
  url: "https://prashantbhardwaj.dev", // update to the deployed domain
  photo: "/prashant.jpg",
  links: {
    linkedin: "https://www.linkedin.com/in/prashant-bhar8waj/",
    github: "https://github.com/Prashant-Bhar8waj",
  },
  seo: {
    title: "Prashant Bhardwaj · AI & Computer Vision Engineer",
    description:
      "AI and Computer Vision Engineer with an M.Sc. in Visual Computing (Saarland University) and 3+ years at K|Lens GmbH. Multi-view anomaly detection, vision transformers, and production ML pipelines.",
    keywords: [
      "Computer Vision Engineer",
      "AI Engineer",
      "Deep Learning",
      "Vision Transformers",
      "DINOv2",
      "Anomaly Detection",
      "Multi-view",
      "PyTorch",
      "Saarbrücken",
    ],
  },
} as const;

export const nav = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#journey", label: "Journey" },
  { href: "#achievements", label: "Achievements" },
] as const;
