import type { ReactNode } from "react";
import { EB_Garamond } from "next/font/google";
import { PaperTheme } from "@/components/story/PaperTheme";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export default function StoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${garamond.variable} paper relative min-h-screen font-[family-name:var(--font-garamond)]`}>
      <PaperTheme />
      {children}
    </div>
  );
}
