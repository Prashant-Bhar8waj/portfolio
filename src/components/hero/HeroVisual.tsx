"use client";

import { useEffect, useRef } from "react";

/**
 * A five-camera inspection rig observing an industrial flange, rendered as a point cloud on a 2D canvas
 * with a hand-rolled perspective projection (no Three.js needed). Moving the pointer orbits the rig,
 * activates the nearest camera, and reveals its attention rays, epipolar connections and a detection box.
 */

type V3 = [number, number, number];
type Cam = { pos: V3; up: V3; id: string; calibrated: boolean };

const CYAN = "34, 211, 238";
const VIOLET = "167, 139, 250";
const ORANGE = "251, 146, 60";

function buildObject(): V3[] {
  const pts: V3[] = [];
  // Flange ring (torus)
  const R = 1.0;
  const r = 0.28;
  for (let i = 0; i < 520; i++) {
    const u = (i / 520) * Math.PI * 2;
    const v = ((i * 7.31) % 1) * Math.PI * 2;
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const z = (R + r * Math.cos(v)) * Math.sin(u);
    const y = r * Math.sin(v) * 0.8;
    pts.push([x, y, z]);
  }
  // Central hub disc
  for (let i = 0; i < 160; i++) {
    const a = (i * 2.399963) % (Math.PI * 2);
    const rad = 0.62 * Math.sqrt((i + 0.5) / 160);
    pts.push([rad * Math.cos(a), 0.12, rad * Math.sin(a)]);
    if (i % 3 === 0) pts.push([rad * Math.cos(a), -0.12, rad * Math.sin(a)]);
  }
  // Six bolt studs
  for (let b = 0; b < 6; b++) {
    const a = (b / 6) * Math.PI * 2;
    const cx = Math.cos(a) * 1.0;
    const cz = Math.sin(a) * 1.0;
    for (let i = 0; i < 26; i++) {
      const t = (i / 26) * Math.PI * 2;
      const h = 0.22 + ((i * 5) % 3) * 0.08;
      pts.push([cx + 0.09 * Math.cos(t), h, cz + 0.09 * Math.sin(t)]);
    }
  }
  return pts;
}

function buildCams(): Cam[] {
  const cams: Cam[] = [];
  const el = 0.58; // elevation
  const rad = 2.3;
  for (let i = 0; i < 4; i++) {
    const az = (Math.PI / 4) + (i * Math.PI) / 2;
    cams.push({
      id: `C${i + 1}`,
      calibrated: true,
      pos: [rad * Math.cos(el) * Math.cos(az), rad * Math.sin(el), rad * Math.cos(el) * Math.sin(az)],
      up: [0, 1, 0],
    });
  }
  cams.push({ id: "C5", calibrated: false, pos: [0, 1.9, 0.001], up: [0, 0, -1] });
  return cams;
}

const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const add = (a: V3, b: V3, s = 1): V3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];

export function HeroVisual({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const object = buildObject();
    const cams = buildCams();

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let visible = true;
    let t0 = performance.now();

    // Interaction state
    let yaw = 0.6;
    let pitch = -0.38;
    let targetYaw = yaw;
    let targetPitch = pitch;
    let px = -1;
    let py = -1;
    let hasPointer = false;
    let activeCam = 0;
    let camSwitchAt = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(performance.now());
    };

    const project = (p: V3, cy: number, sy: number, cp: number, sp: number) => {
      // yaw around Y, then pitch around X
      const x1 = p[0] * cy + p[2] * sy;
      const z1 = -p[0] * sy + p[2] * cy;
      const y2 = p[1] * cp - z1 * sp;
      const z2 = p[1] * sp + z1 * cp;
      const d = 5.2;
      const f = d / (d + z2);
      const scale = Math.min(w, h) * 0.22;
      // scene centre sits slightly below the middle so the top-down camera fits above the object
      return { x: w / 2 + x1 * f * scale, y: h * 0.57 - y2 * f * scale, z: z2, f };
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      if (!reduce && !hasPointer) targetYaw = 0.6 + t * 0.12;
      yaw += (targetYaw - yaw) * (reduce ? 1 : 0.06);
      pitch += (targetPitch - pitch) * (reduce ? 1 : 0.06);

      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const P = (p: V3) => project(p, cy, sy, cp, sp);

      ctx.clearRect(0, 0, w, h);

      // --- cameras ---
      const camScreens = cams.map((c) => P(c.pos));
      if (hasPointer) {
        let best = -1;
        let bd = 90;
        camScreens.forEach((s, i) => {
          const d = Math.hypot(s.x - px, s.y - py);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        if (best >= 0) activeCam = best;
      } else if (!reduce && now > camSwitchAt) {
        activeCam = (activeCam + 1) % cams.length;
        camSwitchAt = now + 2600;
      }

      // Object points
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const projected = object.map((p) => {
        const s = P(p);
        if (s.x < minX) minX = s.x;
        if (s.x > maxX) maxX = s.x;
        if (s.y < minY) minY = s.y;
        if (s.y > maxY) maxY = s.y;
        return s;
      });

      // Epipolar / attention connections from the active camera
      const ac = cams[activeCam];
      const as = camScreens[activeCam];
      ctx.lineWidth = 1;
      if (ac.calibrated) {
        cams.forEach((c, i) => {
          if (i === activeCam || !c.calibrated) return;
          const s = camScreens[i];
          ctx.strokeStyle = `rgba(${VIOLET}, 0.35)`;
          ctx.setLineDash([3, 6]);
          ctx.lineDashOffset = reduce ? 0 : -t * 20;
          ctx.beginPath();
          ctx.moveTo(as.x, as.y);
          ctx.lineTo(s.x, s.y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }
      // rays to sampled object points
      for (let i = 0; i < 14; i++) {
        const s = projected[(i * 67 + activeCam * 13) % projected.length];
        ctx.strokeStyle = `rgba(${ac.calibrated ? CYAN : ORANGE}, ${0.10 + 0.06 * Math.sin(t * 2 + i)})`;
        ctx.beginPath();
        ctx.moveTo(as.x, as.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      // Frustums
      cams.forEach((c, i) => {
        const fwd = norm([-c.pos[0], -c.pos[1], -c.pos[2]]);
        const right = norm(cross(fwd, c.up));
        const upv = cross(right, fwd);
        const base = add(c.pos, fwd, 0.42);
        const hs = 0.22;
        const corners: V3[] = [
          add(add(base, right, hs), upv, hs),
          add(add(base, right, -hs), upv, hs),
          add(add(base, right, -hs), upv, -hs),
          add(add(base, right, hs), upv, -hs),
        ].map((p) => p as V3);
        const apex = camScreens[i];
        const cs = corners.map(P);
        const active = i === activeCam;
        const col = active ? (c.calibrated ? CYAN : ORANGE) : "148, 163, 184";
        ctx.strokeStyle = `rgba(${col}, ${active ? 0.95 : 0.35})`;
        ctx.lineWidth = active ? 1.4 : 1;
        ctx.beginPath();
        cs.forEach((s, k) => {
          ctx.moveTo(apex.x, apex.y);
          ctx.lineTo(s.x, s.y);
          const n = cs[(k + 1) % 4];
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(n.x, n.y);
        });
        ctx.stroke();
        // sensor dot
        ctx.fillStyle = `rgba(${col}, ${active ? 1 : 0.6})`;
        ctx.beginPath();
        ctx.arc(apex.x, apex.y, active ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
        if (active) {
          ctx.strokeStyle = `rgba(${col}, 0.35)`;
          ctx.beginPath();
          ctx.arc(apex.x, apex.y, 9 + (reduce ? 0 : 3 * Math.sin(t * 3)), 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.font = "10px var(--font-geist-mono), ui-monospace, monospace";
        ctx.fillStyle = `rgba(${col}, ${active ? 1 : 0.7})`;
        ctx.fillText(`${c.id}${c.calibrated ? "" : " · top-down · uncalibrated"}`, apex.x + 8, apex.y - 8);
      });

      // Points (sorted far -> near for nicer overlap)
      const order = projected.map((_, i) => i).sort((a, b) => projected[b].z - projected[a].z);
      for (const i of order) {
        const s = projected[i];
        const depth = Math.max(0, Math.min(1, (s.z + 1.4) / 2.8)); // 0 near .. 1 far
        const near = hasPointer ? Math.hypot(s.x - px, s.y - py) : 999;
        let col: string;
        let alpha: number;
        if (near < 56) {
          col = ORANGE;
          alpha = 1;
        } else {
          // cyan near -> violet far
          const r = Math.round(34 + (167 - 34) * depth);
          const g = Math.round(211 + (139 - 211) * depth);
          const b = Math.round(238 + (250 - 238) * depth);
          col = `${r}, ${g}, ${b}`;
          alpha = 0.95 - depth * 0.6;
        }
        ctx.fillStyle = `rgba(${col}, ${alpha})`;
        const size = (1.9 - depth * 0.9) * s.f * (near < 56 ? 1.6 : 1);
        ctx.fillRect(s.x - size / 2, s.y - size / 2, size, size);
      }

      // Pointer scanner ring
      if (hasPointer) {
        ctx.strokeStyle = `rgba(${ORANGE}, 0.45)`;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.arc(px, py, 56, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = `rgba(${ORANGE}, 0.9)`;
        ctx.font = "10px var(--font-geist-mono), ui-monospace, monospace";
        ctx.fillText("patch activation", px + 62, py + 4);
      }

      // Detection box around the object
      const pad = 14;
      const bx = minX - pad, by = minY - pad, bw = maxX - minX + pad * 2, bh = maxY - minY + pad * 2;
      const L = 14;
      ctx.strokeStyle = `rgba(${CYAN}, 0.9)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // four corners
      ctx.moveTo(bx, by + L); ctx.lineTo(bx, by); ctx.lineTo(bx + L, by);
      ctx.moveTo(bx + bw - L, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + L);
      ctx.moveTo(bx + bw, by + bh - L); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw - L, by + bh);
      ctx.moveTo(bx + L, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - L);
      ctx.stroke();
      ctx.fillStyle = `rgba(${CYAN}, 1)`;
      ctx.fillRect(bx, by - 16, 118, 14);
      ctx.fillStyle = "#060a14";
      ctx.font = "10px var(--font-geist-mono), ui-monospace, monospace";
      ctx.fillText("flange · OK · 0.97", bx + 6, by - 5);

      // Readout
      const lines = [
        `VIEW ${ac.id} · ${ac.calibrated ? "EPIPOLAR ATTN" : "SELF-ATTN"}`,
        `TOKENS 5 × 256 · D=768`,
        `FUSION gated · σ-band`,
      ];
      ctx.font = "10px var(--font-geist-mono), ui-monospace, monospace";
      lines.forEach((l, i) => {
        ctx.fillStyle = i === 0 ? `rgba(${CYAN}, 0.9)` : "rgba(124, 136, 158, 0.9)";
        ctx.fillText(l, 12, h - 14 - (lines.length - 1 - i) * 14);
      });

      if (!reduce && running && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      hasPointer = true;
      targetYaw = 0.6 + ((px / w) - 0.5) * 1.2;
      targetPitch = -0.38 + ((py / h) - 0.5) * 0.4;
      if (reduce) draw(performance.now());
    };
    const onLeave = () => {
      hasPointer = false;
      px = py = -1;
      targetPitch = -0.38;
      t0 = performance.now() - (yaw - 0.6) / 0.12 * 1000; // continue rotation smoothly
      if (reduce) draw(performance.now());
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce && running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);

    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running && visible && !reduce) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    canvas.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerleave", onLeave);

    if (!reduce) raf = requestAnimationFrame(draw);
    else draw(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive visualization: five virtual cameras observing an industrial flange as a point cloud, with attention rays and a detection box."
      className={className}
    />
  );
}
