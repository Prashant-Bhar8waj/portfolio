export type Milestone = {
  period: string;
  title: string;
  org: string;
  body: string;
  accent: "cyan" | "violet" | "orange";
  current?: boolean;
};

export const journey: Milestone[] = [
  {
    period: "2017 to 2021",
    title: "Electrical engineering foundation",
    org: "Sharda University · B.Tech, Electrical & Electronics",
    body: "Graduated first in the programme with the Vice-Chancellor's Gold Medal (CGPA 9.42). Published on power-quality control. Exchange semester at Manisa Celal Bayar University, Turkey, and an internship building a real-time simulation environment for control algorithms.",
    accent: "orange",
  },
  {
    period: "2021 to 2022",
    title: "Transition into computer vision & AI",
    org: "Self-directed",
    body: "Trained ResNet, EfficientNet, Swin, MobileNet and RegNet from scratch and studied their Grad-CAM evidence. Built a model-explainability and adversarial-robustness toolkit, and a SageMaker CI/CD pipeline with serverless deployment.",
    accent: "violet",
  },
  {
    period: "2022 to 2026",
    title: "M.Sc. Visual Computing",
    org: "Saarland University, Saarbrücken",
    body: "Image processing, high-level computer vision, numerical algorithms, image acquisition, computer graphics and machine learning. Co-wrote a physically-based renderer for the rendering competition and built an autonomous plant-care robot with a vision-language pipeline.",
    accent: "cyan",
  },
  {
    period: "June 2023 to present",
    title: "Computer Vision Engineer, AI Group",
    org: "K|Lens GmbH, Saarbrücken",
    body: "End-to-end calibration of multi-view camera systems, stereo rectification and 3D reconstruction pipelines, and real-time deep-learning inspection models deployed on production lines: IV-bag particle detection at 100 FPS and wheel-bead defect segmentation.",
    accent: "orange",
  },
  {
    period: "2025 to 2026",
    title: "Multi-view anomaly-detection research",
    org: "Master's thesis · K|Lens GmbH / DFKI",
    body: "LUMINA: geometry-aware fusion of five cameras with sparse epipolar attention over frozen DINOv2 features. 97.17% average AUROC on REAL-IAD, first supervised method on the benchmark. Graded 1.0; manuscript under submission.",
    accent: "cyan",
  },
  {
    period: "Now",
    title: "Advanced AI systems & new opportunities",
    org: "Open to AI and computer vision roles",
    body: "Current focus: 3D understanding, multi-view and multimodal anomaly detection, vision-language models with geometric priors, and the foundation-model stack from distributed training to agentic systems.",
    accent: "violet",
    current: true,
  },
];
