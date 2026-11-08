/**
 * Crystal snowflake shapes, shared by the canvas snowfall and the snow globe.
 * Each variant describes one arm pointing up, in a unit circle; it is repeated
 * six times around the centre. Paths are plain SVG strings so the canvas can
 * reuse them through Path2D.
 */
type Seg = [number, number, number, number];

const rad = (deg: number) => (deg * Math.PI) / 180;

/** A pair of side branches leaving the arm at distance `at`, length `len`, angle `deg`. */
function branches(at: number, len: number, deg = 45): Seg[] {
  const dx = Math.sin(rad(deg)) * len;
  const dy = Math.cos(rad(deg)) * len;
  return [
    [0, -at, -dx, -at - dy],
    [0, -at, dx, -at - dy],
  ];
}

const sixth = (r: number): [number, number] => [Math.sin(rad(60)) * r, -Math.cos(rad(60)) * r];

const ARMS: Seg[][] = [
  // Fern: long arm with three pairs of branches
  [[0, 0, 0, -1], ...branches(0.36, 0.32), ...branches(0.6, 0.24), ...branches(0.8, 0.13)],
  // Star: one wide pair of branches, diamond tip, inner hexagon
  [
    [0, 0, 0, -1],
    ...branches(0.5, 0.32, 60),
    [0, -0.78, -0.1, -0.89], [-0.1, -0.89, 0, -1], [0, -0.78, 0.1, -0.89], [0.1, -0.89, 0, -1],
    [0, -0.3, ...sixth(0.3)],
  ],
  // Plate: short arms ending in small crosses, double inner hexagon
  [
    [0, 0, 0, -0.9],
    ...branches(0.28, 0.3, 35),
    ...branches(0.62, 0.2, 55),
    [-0.12, -0.8, 0.12, -0.8],
    [0, -0.2, ...sixth(0.2)],
    [0, -0.48, ...sixth(0.48)],
  ],
];

function rotate([x, y]: [number, number], deg: number): [number, number] {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [x * c - y * s, x * s + y * c];
}

const f = (n: number) => (Math.round(n * 1000) / 1000).toString();

function toPath(arm: Seg[]): string {
  let d = "";
  for (let k = 0; k < 6; k++) {
    for (const [x1, y1, x2, y2] of arm) {
      const [a, b] = rotate([x1, y1], k * 60);
      const [c, e] = rotate([x2, y2], k * 60);
      d += `M${f(a)} ${f(b)}L${f(c)} ${f(e)}`;
    }
  }
  return d;
}

/** One SVG path per variant, drawn in a -1..1 box, meant to be stroked. */
export const FLAKE_PATHS: readonly string[] = ARMS.map(toPath);
