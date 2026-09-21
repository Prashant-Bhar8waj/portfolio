import type { Metadata } from "next";
import { Story } from "@/components/story/Story";
import { storyMeta } from "@/content/story";

export const metadata: Metadata = {
  title: storyMeta.title,
  description: "Prashant Bhardwaj, one year at a time: from signals and control to multi-view anomaly detection and a 97.17% AUROC thesis. The long version of the portfolio.",
  alternates: { canonical: "/story" },
  openGraph: { title: `${storyMeta.title} · Prashant Bhardwaj`, url: "/story" },
};

export default function StoryPage() {
  return <Story />;
}
