"use client";

import { useEffect, useRef } from "react";
import { FLAKE_PATHS } from "@/lib/flakes";

type Flake = {
  x: number; y: number; r: number; vy: number; drift: number; phase: number; a: number;
  variant: number; angle: number; spin: number;
};

const SPRITE = 64; // css px, drawn once per variant then scaled down

/** Pre-renders each crystal once: white strokes with a soft red edge so they read on cream and on red. */
function makeSprites(dpr: number): HTMLCanvasElement[] {
  return FLAKE_PATHS.map((d) => {
    const c = document.createElement("canvas");
    c.width = c.height = SPRITE * dpr;
    const g = c.getContext("2d")!;
    const half = (SPRITE * dpr) / 2;
    const radius = half * 0.82;
    g.translate(half, half);
    g.scale(radius, radius);
    g.lineCap = "round";
    g.lineJoin = "round";
    const path = new Path2D(d);
    g.strokeStyle = "rgba(142,19,40,0.35)";
    g.lineWidth = 0.2;
    g.stroke(path);
    g.strokeStyle = "#ffffff";
    g.lineWidth = 0.1;
    g.stroke(path);
    return c;
  });
}

/** Decorative snowfall: one canvas, paused when the tab is hidden, off for reduced motion. */
export function Snow({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let flakes: Flake[] = [];
    let w = 0;
    let h = 0;
    let sprites: HTMLCanvasElement[] = [];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sprites = makeSprites(dpr);
      const count = w < 640 ? 32 : 60;
      flakes = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (anywhere: boolean): Flake => {
      // A few big crystals in front, many small ones behind: bigger ones fall faster.
      const big = Math.random() < 0.3;
      const r = big ? 8 + Math.random() * 6 : 3.5 + Math.random() * 3.5;
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -r * 2,
        r,
        vy: 0.25 + r * 0.07 + Math.random() * 0.3,
        drift: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        a: big ? 0.75 + Math.random() * 0.25 : 0.45 + Math.random() * 0.4,
        variant: Math.floor(Math.random() * FLAKE_PATHS.length),
        angle: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.02,
      };
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy;
        f.x += Math.sin(t / 1200 + f.phase) * f.drift * 0.5;
        f.angle += f.spin;
        if (f.y > h + f.r * 2) Object.assign(f, spawn(false));
        const size = (f.r * 2) / 0.82;
        ctx.save();
        ctx.globalAlpha = f.a;
        ctx.translate(f.x, f.y);
        ctx.rotate(f.angle);
        ctx.drawImage(sprites[f.variant], -size / 2, -size / 2, size, size);
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      ctx.clearRect(0, 0, w, h);
    };
    const start = () => {
      if (!raf && enabled && !reduce.matches && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else start();
    };
    const onReduce = () => (reduce.matches ? stop() : start());

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", onReduce);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onReduce);
    };
  }, [enabled]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[15]"
    />
  );
}
