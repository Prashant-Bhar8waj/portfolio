import type { ProjectId } from "./projects";

export type Skill = { name: string; usedIn: ProjectId[] };
export type SkillLayer = {
  id: string;
  label: string;
  accent: "cyan" | "violet" | "orange";
  skills: Skill[];
};

export const skillLayers: SkillLayer[] = [
  {
    id: "vision",
    label: "Vision",
    accent: "cyan",
    skills: [
      { name: "OpenCV", usedIn: ["mlops"] },
      { name: "Object detection", usedIn: [] },
      { name: "Classification", usedIn: ["xai", "mlops"] },
      { name: "Anomaly detection", usedIn: ["lumina", "cross-view"] },
      { name: "Multi-view learning", usedIn: ["lumina", "cross-view"] },
      { name: "Camera calibration & 3D", usedIn: ["lumina"] },
    ],
  },
  {
    id: "dl",
    label: "Deep Learning",
    accent: "violet",
    skills: [
      { name: "PyTorch", usedIn: ["lumina", "cross-view", "xai", "mlops"] },
      { name: "CNNs", usedIn: ["xai"] },
      { name: "Vision Transformers", usedIn: ["lumina", "cross-view"] },
      { name: "DINOv2", usedIn: ["lumina", "cross-view"] },
      { name: "Attention mechanisms", usedIn: ["lumina", "cross-view"] },
    ],
  },
  {
    id: "eng",
    label: "Engineering",
    accent: "orange",
    skills: [
      { name: "Python", usedIn: ["lumina", "cross-view", "xai", "mlops"] },
      { name: "C++", usedIn: [] },
      { name: "Linux", usedIn: ["lumina", "mlops"] },
      { name: "Docker", usedIn: ["mlops"] },
      { name: "Git", usedIn: ["lumina", "cross-view", "xai", "mlops"] },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & MLOps",
    accent: "cyan",
    skills: [
      { name: "AWS", usedIn: ["mlops"] },
      { name: "SageMaker", usedIn: ["mlops"] },
      { name: "CI/CD", usedIn: ["mlops"] },
      { name: "Model deployment", usedIn: ["mlops"] },
    ],
  },
  {
    id: "research",
    label: "Research",
    accent: "violet",
    skills: [
      { name: "Experimentation", usedIn: ["lumina", "cross-view", "xai"] },
      { name: "Evaluation", usedIn: ["lumina", "cross-view"] },
      { name: "Explainability", usedIn: ["xai", "lumina"] },
      { name: "Robustness", usedIn: ["xai"] },
    ],
  },
];
