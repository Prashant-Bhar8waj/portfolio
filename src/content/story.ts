/**
 * The /story long read: one chapter per year, plus the dashboard state the right-hand panel
 * shows while that chapter is on screen. Facts come from the CV and thesis only.
 */

export type Scene = "signal" | "control" | "peak" | "gradcam" | "detect" | "render" | "epipolar" | "fusion" | "open";

export type Metric =
  | { label: string; value: number; prefix?: string; suffix?: string; decimals?: number }
  | { label: string; text: string };

export type Chapter = {
  id: string;
  year: string;
  title: string;
  paragraphs: string[];
  aside?: { title: string; body: string; tags: string[] };
  scene: Scene;
  caption: string;
  metrics: Metric[];
};

export const storyMeta = {
  kicker: "Prashant Bhardwaj",
  title: "Teaching Machines to See",
  byline: "A chronological account, 2017 to 2026 · Saarbrücken, Germany",
  intro: [
    "I build systems that look at things for a living: five cameras around a machined part, a stream of IV bags at a hundred frames a second, a wheel rim with a bead of rubber that may or may not be seated. This page is the long version of how I got here, told the way I think about it, one year at a time.",
    "The panel on the right is what the machine sees. It changes as you scroll: a signal, a heat map, a bounding box, an epipolar line, a decision.",
    "Everything here is work I did or studied. The figures are the ones in my thesis and CV, nothing rounded up.",
  ],
  expandables: [
    {
      label: "Who is this for?",
      body: "Anyone deciding whether to work with me: hiring managers, research groups, collaborators. The [portfolio](/) has the project-by-project detail with interactive figures. This page has the story and the order things happened in.",
    },
    {
      label: "Why a timeline?",
      body: "Because the interesting part of a career is the sequence. Signals came before images, calibration came before transformers, and the thesis only made sense after two years on factory floors watching real cameras fail in real ways.",
    },
    {
      label: "Where am I now?",
      body: "Saarbrücken, Germany. Computer Vision Engineer in the AI Group at K|Lens GmbH since June 2023. M.Sc. Visual Computing from Saarland University, finished in 2026 with a thesis graded 1.0. Open to AI and computer vision roles.",
    },
  ],
} as const;

export const chapters: Chapter[] = [
  {
    id: "y2017",
    year: "2017",
    title: "Signals and Systems",
    paragraphs: [
      "In August 2017 I started a Bachelor of Technology in Electrical and Electronics Engineering at Sharda University in Greater Noida, on a 60% merit scholarship that held for the whole degree, topped up by a scholarship from the Uttar Pradesh state government.",
      "The first thing engineering school teaches you is to stop seeing objects and start seeing signals. A voltage is a function of time. A filter is a system that reshapes it. A control loop is a system that watches its own output and corrects it. I did not know it yet, but every image I would later work with is the same thing: a signal, sampled on a grid, passed through a system.",
      "I liked the parts where the mathematics made a physical thing behave. That preference never left.",
    ],
    scene: "signal",
    caption: "A signal, sampled. Fourier, filters, loops.",
    metrics: [
      { label: "Merit scholarship", value: 60, suffix: "%" },
      { label: "Degree", text: "B.Tech EEE" },
      { label: "Place", text: "Greater Noida, India" },
    ],
  },
  {
    id: "y2019",
    year: "2019",
    title: "A Summer in a Lab, a Semester Abroad",
    paragraphs: [
      "From May to July 2019 I interned at Global Instrumentation in Ghaziabad. My job was to build a real-time simulation environment so control algorithms could be tested safely before they touched hardware. It was the first time I saw software stand between a design and something that could physically break, and the first time I understood why engineers are paranoid about the gap between a model and the machine.",
      "That September I left India for the first time, on a Mevlana exchange scholarship to Manisa Celal Bayar University in Turkey, and stayed until January 2020. Living in a language I did not speak taught me more about attention than any course: you learn what to look at when you cannot read the labels.",
    ],
    scene: "control",
    caption: "A step response, settling. Test in simulation first.",
    metrics: [
      { label: "Internship", text: "May to July 2019" },
      { label: "Exchange", text: "Manisa, Turkey" },
      { label: "Countries lived in", value: 2 },
    ],
  },
  {
    id: "y2021",
    year: "2021",
    title: "Gold",
    paragraphs: [
      "I graduated in May 2021 with a CGPA of 9.42 out of 10 and the Vice-Chancellor's Gold Medal for first rank across the entire programme.",
      "The research I did in those years was on power quality: a synchronized control strategy for a unified power quality conditioner, the device that catches voltage sags and swells before they reach sensitive equipment. The paper, written with Anuj Verma, Shiva Pujan Jaiswal and Suman Lata Dhar, was published in Macromolecular Symposia in February 2023 and has been cited five times.",
      "By then I had already decided that the signals I wanted to work on next were images. I spent the following months teaching myself deep learning from the ground up.",
    ],
    scene: "peak",
    caption: "First in the programme. Then a change of signal.",
    metrics: [
      { label: "CGPA", value: 9.42, decimals: 2, suffix: " / 10" },
      { label: "Programme rank", value: 1 },
      { label: "Citations", value: 5 },
    ],
  },
  {
    id: "y2022",
    year: "2022",
    title: "Saarbrücken",
    paragraphs: [
      "In March 2022 I moved to Germany for a Master of Science in Visual Computing at Saarland University. The coursework was the whole pipeline of seeing: image acquisition, image processing and computer vision, high-level computer vision, numerical algorithms for visual computing, image compression, computer graphics, digital signal processing, embedded systems, machine learning, and a seminar on machine learning for language.",
      "My first real deep-learning project that year was deliberately unglamorous. I trained ResNet, EfficientNet, Swin, MobileNet and RegNet from scratch on the same data and then used Grad-CAM to ask each one what it had actually looked at. Some of them were right for the wrong reasons. That lesson, that a good number says nothing about the evidence behind it, became a habit I carried into everything after.",
    ],
    scene: "gradcam",
    caption: "Grad-CAM: where the network looked, not just what it said.",
    metrics: [
      { label: "Architectures trained", value: 5 },
      { label: "Attribution", text: "Grad-CAM" },
      { label: "Programme start", text: "March 2022" },
    ],
  },
  {
    id: "y2023",
    year: "2023",
    title: "The Factory Floor",
    paragraphs: [
      "In June 2023 I joined the AI Group at K|Lens GmbH in Saarbrücken as a Computer Vision Engineer, and the images stopped being datasets and started being production lines.",
      "The first responsibility was geometry. I calibrated the K|Lens multi-view camera systems end to end: motorized calibration screens at working distances from 0 to 70 mm, aperture and focal length tuned by hand, grid sizes profiled until reprojection error was sub-pixel, then intrinsics, extrinsics and distortion. On top of that I wrote the Python pipelines for stereo rectification, dense point clouds and 3D reconstruction that everything downstream depends on.",
      "The second was inspection. For IV-bag particle detection I developed and deployed real-time object detectors over more than a terabyte of data from several lines, reaching 98%+ detection with under 1% false positives at 100 frames per second, roughly a hundred thousand bags a day per line. For wheel-bead defect segmentation the models reached 99%+ accuracy, again under 1% false positives. The same year I built a SageMaker CI/CD pipeline on AWS, with distributed training, Lambda inference and an active-learning loop through Label Studio.",
    ],
    aside: {
      title: "What shipping a model means here",
      body: "A model is not done when the validation curve looks good. It is done when the dataset has balanced splits, the confidence threshold has been optimized against the line's false-positive budget, the ablations say which parts earn their latency, and the whole thing runs from the same Docker image on the workstation and on the line.",
      tags: ["Balanced splits", "Threshold tuning", "Ablations", "Docker", "100 FPS"],
    },
    scene: "detect",
    caption: "A particle, boxed, at 100 frames per second.",
    metrics: [
      { label: "Detection", value: 98, suffix: "%+" },
      { label: "False positives", text: "< 1%" },
      { label: "Throughput", value: 100, suffix: " FPS" },
      { label: "Data", text: "1 TB+" },
    ],
  },
  {
    id: "y2024",
    year: "2024",
    title: "Light, for Fun",
    paragraphs: [
      "Rendering is inspection run backwards. Instead of asking what a camera saw, you decide what light does and compute what a camera would record. In the winter semester of 2024/25, with a co-author, I wrote MemorySynthesizer, a physically based renderer, for the computer graphics course and its rendering competition.",
      "It has a thin-lens camera with depth of field, area lights, a rough-dielectric microfacet BSDF, thin-film iridescence, normal mapping, Halton low-discrepancy sampling, and a post-processing chain of denoising, bloom and ACES tone mapping. Our competition scene, Cyberfreak, answered the theme \"Chaos in Harmony\". The [feature page](https://graphics.cg.uni-saarland.de/courses/cg1-2024/RC/chansey/features.html) is still up.",
      "Building a camera model from the equations forward made me much better at trusting, and distrusting, the real cameras at work.",
    ],
    scene: "render",
    caption: "Thin lens, shallow focus. Light computed forwards.",
    metrics: [
      { label: "BSDF", text: "Rough dielectric" },
      { label: "Sampling", text: "Halton" },
      { label: "Camera", text: "Thin lens" },
      { label: "Theme", text: "Chaos in Harmony" },
    ],
  },
  {
    id: "y2025",
    year: "2025",
    title: "Five Cameras",
    paragraphs: [
      "My thesis brought the two halves together: the factory geometry from K|Lens and the transformers from the university. It was an industry–academia project with K|Lens GmbH and DFKI, supervised by Prof. Dr.-Ing. Philipp Slusallek, Dr.-Ing. Faranak Shamsafar and M.Sc. Noshaba Cheema.",
      "The benchmark was REAL-IAD: 30 industrial categories, about 150,000 images, each object photographed by five synchronized cameras, four calibrated at 45° azimuth and one uncalibrated top-down view. A supervised single-view model with the same backbone and labels reaches only 69.51% average AUROC. Defects hide from single cameras.",
      "The idea was to let geometry constrain attention. A patch in one camera may only attend to patches in another camera that lie near its epipolar line, the line where its true correspondence must fall. The mask is soft, a Gaussian in the distance to the line, so calibration error is forgiven, and pairs beyond a threshold are never computed at all. Attention goes from O(N²) to O(N·k) and costs 46 to 57% less. Underneath, a frozen DINOv2-ViT-B/14 supplies features from block 3 for texture and block 12 for semantics, fused with learned per-patch weights, and a learned gate falls back to the single view when a camera is occluded.",
    ],
    aside: {
      title: "The rule the transformer has to obey",
      body: "For a query patch q in camera i, the fundamental matrix gives its epipolar line in camera j. Every key patch k gets the weight w = exp(−d(k, l)² / 2σ²), where d is the distance from k to the line. Beyond the threshold φ the pair is dropped before any score exists.",
      tags: ["Fundamental matrix", "Gaussian band", "Segment softmax", "Gated residual"],
    },
    scene: "epipolar",
    caption: "A query, its epipolar line, and the only keys allowed to answer.",
    metrics: [
      { label: "Cameras", value: 5 },
      { label: "Categories", value: 30 },
      { label: "Images", value: 150, suffix: "k" },
      { label: "Attention compute", text: "−46 to 57%" },
    ],
  },
  {
    id: "y2026",
    year: "2026",
    title: "97.17",
    paragraphs: [
      "After Bayesian optimization over eight hyperparameters with median pruning, 600 GPU-hours on four RTX 6000 cards, worth 4.3 points of AUROC over the default configuration, the unified model reached 97.17% average AUROC across all 30 REAL-IAD categories. It is the first supervised method evaluated on the benchmark, with every baseline retrained on identical splits: PatchCore 87.02%, MVAD 83.89%, SimpleNet 68.22%. Twenty-five categories are at or above 95%, two at 100%.",
      "The same architecture runs in three supervision regimes. With a memory bank of normal patches, PCA, coreset and FAISS, it needs no labels at inference and still reaches 95.48%. Trained fully unsupervised by masked cross-view reconstruction, 89.45%. Both beat the best external unsupervised baseline. One model for all categories stays within 1.22% of thirty per-category specialists at 73% lower training cost, with 12.9% of parameters trainable and 60 to 80 ms per five-view sample.",
      "The thesis, LUMINA: Learning Unified Multi-View Industrial Inspection with Neural Attention, was graded 1.0. The manuscript is under submission with my supervisors as co-authors. The same year, for an interactive-systems course, I built a plant-care robot with a camera, a vision-language model for species and health, a light-seeking rail and a Telegram interface, and ran a user study on it. It is a small thing, but it sees.",
    ],
    scene: "fusion",
    caption: "Five views, one gated decision.",
    metrics: [
      { label: "Avg. AUROC", value: 97.17, decimals: 2, suffix: "%" },
      { label: "Categories ≥ 95%", text: "25 / 30" },
      { label: "Latency", text: "60 to 80 ms" },
      { label: "Trainable params", value: 12.9, decimals: 1, suffix: "%" },
    ],
  },
  {
    id: "now",
    year: "Now",
    title: "What Comes Next",
    paragraphs: [
      "I am in Saarbrücken, still at K|Lens, and open to AI and computer vision roles where the problems are hard and the cameras are real. The things I want to work on: 3D understanding, multi-view and multimodal anomaly detection, vision-language models with geometric priors, and the foundation-model stack from distributed training to fine-tuning, serving and agentic systems.",
      "If any of this is relevant to what you are building, [write to me](mailto:prashant.bhar8waj@gmail.com). The [portfolio](/) has the figures, the [GitHub](https://github.com/Prashant-Bhar8waj) has the code, and [LinkedIn](https://www.linkedin.com/in/prashant-bhar8waj/) has the timeline in its usual form.",
    ],
    scene: "open",
    caption: "Field of view: open.",
    metrics: [
      { label: "Based in", text: "Saarbrücken" },
      { label: "Status", text: "Open to roles" },
      { label: "Languages", text: "Hindi · English · German" },
    ],
  },
];

/** Skills as they entered the toolbox, by chapter index. */
export const chips: { label: string; since: number }[] = [
  { label: "Signals", since: 0 },
  { label: "MATLAB", since: 0 },
  { label: "Control", since: 1 },
  { label: "Python", since: 1 },
  { label: "C++", since: 2 },
  { label: "PyTorch", since: 3 },
  { label: "Grad-CAM", since: 3 },
  { label: "OpenCV", since: 4 },
  { label: "Calibration", since: 4 },
  { label: "Docker", since: 4 },
  { label: "AWS", since: 4 },
  { label: "Rendering", since: 5 },
  { label: "DINOv2", since: 6 },
  { label: "Epipolar", since: 6 },
  { label: "Optuna", since: 7 },
];
