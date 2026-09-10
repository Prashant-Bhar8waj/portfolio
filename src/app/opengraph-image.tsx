import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const mono = { fontSize: 22, color: "#7c889e", letterSpacing: 4 } as const;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #060a14 0%, #0b1226 60%, #120f2a 100%)",
          color: "#e6edf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", ...mono }}>
          <div style={{ display: "flex" }}>PRASHANT BHARDWAJ</div>
          <div style={{ display: "flex" }}>CONF 0.99</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            <div style={{ display: "flex", marginRight: 24 }}>I Teach Machines</div>
            <div style={{ display: "flex", color: "#22d3ee" }}>to See.</div>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#aab4c8", maxWidth: 900, lineHeight: 1.35 }}>
            {`${site.role} · Multi-view anomaly detection · Vision transformers · Production ML`}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, ...mono }}>
          <div style={{ display: "flex", width: 14, height: 14, background: "#a78bfa" }} />
          <div style={{ display: "flex" }}>Saarbrücken, Germany</div>
          <div style={{ display: "flex", width: 14, height: 14, background: "#fb923c", marginLeft: 24 }} />
          <div style={{ display: "flex" }}>Open to opportunities</div>
        </div>
      </div>
    ),
    size,
  );
}
