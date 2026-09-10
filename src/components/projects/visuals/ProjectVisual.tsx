"use client";

import dynamic from "next/dynamic";
import type { ProjectId } from "@/content/projects";

const Skeleton = () => <div className="aspect-[4/3] w-full animate-pulse rounded-2xl border border-line bg-white/[0.02]" />;

const LuminaViz = dynamic(() => import("./LuminaViz").then((m) => m.LuminaViz), { loading: Skeleton });
const CrossViewViz = dynamic(() => import("./CrossViewViz").then((m) => m.CrossViewViz), { loading: Skeleton });
const ModelCompareViz = dynamic(() => import("./ModelCompareViz").then((m) => m.ModelCompareViz), { loading: Skeleton });
const XaiSlider = dynamic(() => import("./XaiSlider").then((m) => m.XaiSlider), { loading: Skeleton });
const PipelineViz = dynamic(() => import("./PipelineViz").then((m) => m.PipelineViz), { loading: Skeleton });

export function ProjectVisual({ id }: { id: ProjectId }) {
  switch (id) {
    case "lumina":
      return <LuminaViz />;
    case "cross-view":
      return <CrossViewViz />;
    case "lightweight":
      return <ModelCompareViz />;
    case "xai":
      return <XaiSlider />;
    case "mlops":
      return <PipelineViz />;
  }
}
