import { FLAKE_PATHS } from "@/lib/flakes";
import { Elf, Reindeer, Santa } from "./mascots/Mascots";

// Deterministic "random" so server and client render the same flakes.
function seeded(n: number) {
  let s = 7;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, () => ({
    x: 50 + r() * 300,
    y: 30 + r() * 120,
    size: 3 + r() * 5,
    dur: 6 + r() * 6,
    delay: -r() * 12,
    variant: Math.floor(r() * 3),
    spin: 4 + r() * 6,
  }));
}
const FLAKES = seeded(26);

/** Animated snow globe with Santa, a reindeer and an elf. Purely decorative. */
export function SnowGlobe({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 450" className={`snow-globe ${className}`} role="img" aria-label="Boule à neige avec le Père Noël, un renne et un lutin">
      <defs>
        <radialGradient id="g-halo" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#ff2b40" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#c41e3a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#c41e3a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-glass" cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ff6b78" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#b3122a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5a0815" stopOpacity="0.85" />
        </radialGradient>
        <linearGradient id="g-base" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f3e3c3" />
          <stop offset="45%" stopColor="#d4a64a" />
          <stop offset="100%" stopColor="#8a6420" />
        </linearGradient>
        <linearGradient id="g-ground" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f3d7da" />
        </linearGradient>
        <radialGradient id="g-window" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#f0a83a" />
        </radialGradient>
        {FLAKE_PATHS.map((d, i) => (
          <path key={i} id={`g-flake-${i}`} d={d} stroke="#fff" strokeWidth="0.13" strokeLinecap="round" fill="none" />
        ))}
        <clipPath id="g-clip">
          <circle cx="200" cy="200" r="166" />
        </clipPath>
      </defs>

      <circle cx="200" cy="205" r="205" fill="url(#g-halo)" className="globe-halo" />

      {/* glass + scene */}
      <circle cx="200" cy="200" r="170" fill="url(#g-glass)" />
      <g clipPath="url(#g-clip)">
        {/* far hills */}
        <path d="M20 240 Q110 206 200 228 Q300 248 380 214 L380 400 L20 400 Z" fill="#f7e4e6" opacity="0.55" />

        {/* tree */}
        <g transform="translate(104 282)">
          <rect x="-6" y="-14" width="12" height="16" fill="#6b3e26" />
          <path d="M-46 -12 L0 -62 L46 -12 Z" fill="#a3132b" />
          <path d="M-38 -48 L0 -96 L38 -48 Z" fill="#b8172f" />
          <path d="M-28 -82 L0 -124 L28 -82 Z" fill="#c41e3a" />
          <path d="M-46 -12 Q-23 -22 0 -16 Q23 -22 46 -12 L40 -18 Q20 -26 0 -21 Q-20 -26 -40 -18 Z" fill="#fff" />
          <path d="M-38 -48 Q-19 -57 0 -52 Q19 -57 38 -48 L33 -53 Q16 -60 0 -56 Q-16 -60 -33 -53 Z" fill="#fff" />
          <path d="M-28 -82 Q-14 -89 0 -86 Q14 -89 28 -82 L24 -86 Q12 -92 0 -89 Q-12 -92 -24 -86 Z" fill="#fff" />
          {[[-20, -30], [18, -36], [-12, -66], [14, -70], [0, -100]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.2" fill="#f3e3c3" className="twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
          ))}
          <path d="M0 -140 L4 -130 L15 -130 L6 -124 L9 -113 L0 -120 L-9 -113 L-6 -124 L-15 -130 L-4 -130 Z" fill="#f3c34a" className="star-glow" />
        </g>

        {/* house */}
        <g transform="translate(292 270)">
          <rect x="-34" y="-46" width="68" height="48" fill="#8e1328" />
          <path d="M-44 -42 L0 -82 L44 -42 Z" fill="#6d0d1d" />
          <path d="M-48 -40 L0 -86 L48 -40 L40 -38 L0 -76 L-40 -38 Z" fill="#fff" />
          <rect x="16" y="-86" width="10" height="22" fill="#6d0d1d" />
          <rect x="14" y="-90" width="14" height="6" rx="2" fill="#fff" />
          <rect x="-24" y="-34" width="16" height="16" rx="2" fill="url(#g-window)" className="window-flicker" />
          <rect x="8" y="-34" width="16" height="16" rx="2" fill="url(#g-window)" className="window-flicker" style={{ animationDelay: "1.3s" }} />
          <path d="M-24 -26 H-8 M-16 -34 V-18 M8 -26 H24 M16 -34 V-18" stroke="#6d0d1d" strokeWidth="2" />
          <rect x="-7" y="-14" width="14" height="16" rx="7" fill="#3a0a12" />
          <circle cx="-25" cy="-58" r="0" />
        </g>

        {/* ground */}
        <path d="M20 290 Q100 266 200 278 Q300 290 380 268 L380 400 L20 400 Z" fill="url(#g-ground)" />

        {/* mascots */}
        <g transform="translate(102 326) scale(1.1)"><Reindeer /></g>
        <g transform="translate(196 334) scale(1.3)"><Santa /></g>
        <g transform="translate(300 328) scale(1.15)"><Elf /></g>

        <path d="M20 344 Q110 328 200 338 Q290 348 380 330 L380 400 L20 400 Z" fill="#fff" />

        {/* snow inside the globe */}
        <g className="globe-snow">
          {FLAKES.map((f, i) => (
            <g key={i} className="globe-flake" style={{ animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}>
              <g transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)}) scale(${f.size.toFixed(2)})`}>
                <use href={`#g-flake-${f.variant}`} className="flake-spin" style={{ animationDuration: `${f.spin}s` }} />
              </g>
            </g>
          ))}
        </g>
      </g>

      {/* glass rim and highlights */}
      <circle cx="200" cy="200" r="170" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" />
      <path d="M78 140 Q100 70 170 46" stroke="#fff" strokeOpacity="0.55" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M70 176 Q70 166 72 158" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="292" cy="100" rx="16" ry="7" fill="#fff" opacity="0.18" transform="rotate(40 292 100)" />
      {/* base, in front of the glass like a real snow globe */}
      <path d="M92 352 Q200 392 308 352 L330 418 Q200 452 70 418 Z" fill="url(#g-base)" />
      <path d="M78 400 Q200 432 322 400" stroke="#8e1328" strokeWidth="9" fill="none" />
      <path d="M78 400 Q200 432 322 400" stroke="#f3e3c3" strokeWidth="1.5" strokeDasharray="2 10" fill="none" />

    </svg>
  );
}
