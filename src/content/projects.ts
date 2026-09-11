export type ProjectId = "lumina" | "cross-view" | "xai" | "mlops";

export type CaseSection = {
  title: string;
  body: string[];
};

export type Project = {
  id: ProjectId;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  accent: "cyan" | "violet" | "orange";
  tags: string[];
  stats: { label: string; value: string }[];
  sections: CaseSection[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "lumina",
    index: "01",
    title: "LUMINA",
    kicker: "Multi-View Industrial Anomaly Detection",
    summary:
      "Five synchronized cameras, one decision. A geometry-aware transformer that fuses frozen DINOv2 features across views with sparse epipolar attention, confidence-gated fusion, and a memory-bank scorer for label-free inference.",
    accent: "cyan",
    tags: ["DINOv2", "Epipolar attention", "PyTorch", "Optuna", "FAISS", "REAL-IAD"],
    stats: [
      { label: "Avg. AUROC", value: "97.17%" },
      { label: "Categories ≥ 95%", value: "25 / 30" },
      { label: "Trainable params", value: "12.9%" },
      { label: "Inference", value: "60–80 ms" },
    ],
    sections: [
      {
        title: "Problem",
        body: [
          "Single-camera inspection misses defects that are occluded, ambiguous under reflections, or only visible from a specific angle. On REAL-IAD, a supervised single-view model with the same backbone and labels reaches only 69.51% average AUROC.",
          "Standard transformers match patches by appearance, not by where they are in 3D, and attending across five views at once hits a quadratic complexity wall unfit for industrial lines.",
        ],
      },
      {
        title: "Approach",
        body: [
          "Keep the backbone frozen and inject geometry. Cross-view attention is restricted to a soft Gaussian band around each patch's epipolar line, so queries only look where a true correspondence can physically exist. This cuts attention cost by 46–57% and shifts complexity from O(N²) to O(N·k).",
          "Learned confidence gates decide per patch how much to trust cross-view evidence versus the original single-view feature, which prevents fusion collapse when a view is occluded or noisy.",
        ],
      },
      {
        title: "Architecture",
        body: [
          "Frozen DINOv2-ViT-B/14 → multi-scale fusion of block 3 (texture) and block 12 (semantics) with learned per-patch weights → hybrid cross-view reasoning: epipolar transformers for the four calibrated cameras, self-attention for the uncalibrated top-down view → foreground attention aggregation → MLP classifier.",
          "The same trained backbone serves three regimes: a supervised head, a PatchCore-style k-NN memory bank (PCA + coreset + FAISS) that needs no labels at inference, and a fully unsupervised variant trained by masked cross-view reconstruction on normal samples only.",
        ],
      },
      {
        title: "Results",
        body: [
          "97.17% average AUROC across all 30 REAL-IAD categories, the first supervised method evaluated on the benchmark, with every baseline (PatchCore 87.02%, MVAD 83.89%, SimpleNet 68.22%) retrained on identical splits. 25 of 30 categories reach ≥ 95%, two reach 100%.",
          "Memory-bank mode reaches 95.48% with zero test-time labels; the fully unsupervised mode reaches 89.45%, and both beat the best external unsupervised baseline. A single unified model stays within 1.22% of 30 per-category specialists at 73% lower training cost.",
          "Ablations: removing multi-view fusion costs −34.19 pp, confidence gates −32.89, skip connections −15.28, cross-view attention −11.37, foreground attention −3.15.",
        ],
      },
      {
        title: "My contribution",
        body: [
          "Master's thesis (grade 1.0) in collaboration with K|Lens GmbH and DFKI, supervised by Prof. Philipp Slusallek, Dr. Faranak Shamsafar and Noshaba Cheema. I designed the architecture, derived the scaled intrinsics so epipolar lines stay valid after cropping and resizing, built the full PyTorch pipeline with multi-GPU training and AMP, and ran Bayesian hyperparameter search (600 GPU-hours on 4× RTX 6000, +4.3% AUROC).",
          "Manuscript under submission, 2026.",
        ],
      },
    ],
  },
  {
    id: "cross-view",
    index: "02",
    title: "Cross-View Transformer",
    kicker: "Epipolar attention with soft Gaussian masking",
    summary:
      "The attention core of LUMINA: a query patch in one view attends only to patches along its epipolar line in another view, weighted by distance to the line, so cross-view reasoning happens where a true correspondence can physically exist.",
    accent: "violet",
    tags: ["Epipolar attention", "Soft Gaussian mask", "Vision Transformer", "Multi-view fusion", "Gated residuals"],
    stats: [
      { label: "Attention cost", value: "−46–57%" },
      { label: "Complexity", value: "O(N·k)" },
      { label: "Heads × layers", value: "8 × 2" },
      { label: "Token dim", value: "768" },
    ],
    sections: [
      {
        title: "Problem",
        body: [
          "Concatenating multi-view features early (channel stacking) treats views as independent channels and learns geometry only implicitly. It worked for a first CNN milestone (91% on the study categories) but plateaued on defects that are only visible from one camera.",
        ],
      },
      {
        title: "Approach",
        body: [
          "Two levels of attention. Within a view, tokens attend freely to build local context. Across views, a query token attends only to key tokens near its epipolar line in the other view, weighted by exp(−d²/2σ²) so the constraint is soft, differentiable, and tolerant to calibration error.",
          "A learned gate blends the cross-view result back into the original token (Z'' = g ⊙ Z' + (1 − g) ⊙ Z), and foreground attention pools 256 patches per view into one embedding that highlights where the model looked.",
        ],
      },
      {
        title: "Architecture",
        body: [
          "Epipolar attention with soft Gaussian masking. For a query patch q in camera i, the fundamental matrix F_ij maps its centre to the epipolar line l_q in camera j. Every key patch k in camera j gets a weight w_qk = exp(−d(k, l_q)² / 2σ²), where d is the perpendicular distance from the patch centre to the line. Patches farther than the threshold φ are dropped before any attention score is computed, so the valid keys for one query form a narrow band around the line.",
          "Only those valid (q, k) pairs are scored: s_qk = (q·k / √d_h) · w_qk, normalized with a segment-wise softmax over each query's own keys. This turns dense O(N²) cross-view attention into sparse O(N·k) attention, with k typically 43 to 54% of the patches, and cuts attention compute by 46 to 57%. Fundamental matrices are precomputed for all twelve calibrated camera pairs, and the Gaussian keeps the mask differentiable and tolerant to calibration error.",
          "The refined cross-view feature is merged back through a learned gate, Z″ = g ⊙ Z′ + (1 − g) ⊙ Z, so an occluded or noisy view can be ignored, and foreground attention pools the 256 patches of each view into one embedding.",
        ],
      },
      {
        title: "Results",
        body: [
          "The multi-view necessity test isolates the effect of the architecture: with identical backbone and labels, fusion lifts average AUROC from 69.51% to 97.17% (+27.66 pp). Largest gains on angle-dependent defects: regulator +44.45 pp, bottle cap +42.91 pp, woodstick +41.27 pp.",
          "Bayesian optimization learned a physically meaningful epipolar band: the optimal threshold scales linearly with each product's 99th-percentile defect size (R² = 0.61).",
        ],
      },
      {
        title: "My contribution",
        body: [
          "Designed and implemented the sparse epipolar attention, the gated fusion, and the hybrid handling of the uncalibrated fifth camera. Validated each component through per-component ablations and statistical tests (paired t-test and Wilcoxon, p < 0.05, across 30 categories).",
        ],
      },
    ],
  },
  {
    id: "xai",
    index: "03",
    title: "Explainable & Robust AI",
    kicker: "Trust, but verify what the model sees",
    summary:
      "Seven attribution methods, gradient-based adversarial attacks, and a robustness suite applied to ImageNet classifiers to understand what a network attends to and how easily it can be fooled.",
    accent: "violet",
    tags: ["Grad-CAM", "Integrated Gradients", "SHAP", "PGD / FGSM", "Captum", "PyTorch Lightning"],
    stats: [
      { label: "Attribution methods", value: "7" },
      { label: "Attack types", value: "PGD · FGSM" },
      { label: "Robustness tests", value: "4" },
      { label: "Architectures", value: "5" },
    ],
    sections: [
      {
        title: "Problem",
        body: [
          "A 97% number says nothing about whether the model used the defect or the background to decide. For inspection systems that will be trusted with product quality, the evidence behind each prediction has to be visible and the failure modes known.",
        ],
      },
      {
        title: "Approach",
        body: [
          "Built a Hydra-configured PyTorch Lightning toolkit around a ResNet18 backbone with Captum attribution: Integrated Gradients (plain and with a noise tunnel), saliency, occlusion, Gradient SHAP, Grad-CAM and Grad-CAM++.",
          "Adversarial side: PGD and FGSM attacks with targeted labels, plus robustness sweeps under pixel dropout, Gaussian noise and random brightness. Earlier work trained ResNet, EfficientNet, Swin, MobileNet and RegNet from scratch and compared their Grad-CAM evidence.",
        ],
      },
      {
        title: "Results",
        body: [
          "The same interpretability mindset carried into LUMINA: foreground attention weights are visualized so the model shows exactly where it focused when flagging a defect, and confidence gates expose which views it trusted.",
        ],
      },
      {
        title: "My contribution",
        body: ["Sole author of the toolkit and the experiments."],
      },
    ],
    links: [
      { label: "Model_Explainability on GitHub", href: "https://github.com/Prashant-Bhar8waj/Model_Explainability" },
    ],
  },
  {
    id: "mlops",
    index: "04",
    title: "Production ML & AWS",
    kicker: "From dataset to deployed endpoint",
    summary:
      "Training pipelines that scale across GPUs, containerized deployment, active-learning annotation loops and CI/CD, on AWS SageMaker and on factory hardware.",
    accent: "cyan",
    tags: ["AWS SageMaker", "Lambda", "S3", "Docker", "GitHub Actions", "Label Studio", "DDP / AMP"],
    stats: [
      { label: "Multi-GPU training", value: "DDP · AMP" },
      { label: "HPO", value: "Optuna" },
      { label: "Serving", value: "Lambda · TorchServe" },
      { label: "Annotation", value: "Label Studio" },
    ],
    sections: [
      {
        title: "Approach",
        body: [
          "Fine-tuned a timm model on Intel Image Classification with distributed multi-GPU training, wrapped it in a SageMaker CI/CD pipeline, and deployed inference on AWS Lambda. Label Studio closes the loop with active-learning annotation of low-confidence samples.",
          "At K|Lens, training and deployment are containerized with Docker, datasets are versioned with balanced splits, and models ship with tuned confidence thresholds. LUMINA's pipeline adds multi-GPU training with mixed precision, Optuna hyperparameter search with median pruning, and reproducible seeds on a SLURM cluster.",
        ],
      },
      {
        title: "My contribution",
        body: [
          "Built the SageMaker pipeline end to end, and own the training-to-deployment path for the inspection models at K|Lens.",
        ],
      },
    ],
  },
];
