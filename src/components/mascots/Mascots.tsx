/**
 * Hand-drawn SVG mascots. Each one is drawn around its own origin
 * (0,0 = bottom centre, about 90 units tall) so it can be placed in any scene
 * with a transform, or shown alone with <MascotIcon>.
 * Animations live in globals.css and stop under prefers-reduced-motion.
 */

const INK = "#2a1a1f";
const SKIN = "#f6c9a8";
const CHEEK = "#f08a8a";

export function Santa({ pose = "wave", glasses = false }: { pose?: "wave" | "hold"; glasses?: boolean } = {}) {
  return (
    <g className="mascot-breathe">
      {/* boots */}
      <rect x={-20} y={-12} width={15} height={12} rx={4} fill={INK} />
      <rect x={5} y={-12} width={15} height={12} rx={4} fill={INK} />
      {/* left arm, resting */}
      {pose === "wave" && (
        <>
          <path d="M-22 -44 Q-34 -34 -31 -24" stroke="#c41e3a" strokeWidth={10} strokeLinecap="round" fill="none" />
          <circle cx={-31} cy={-22} r={5.5} fill={INK} />
        </>
      )}
      {/* body */}
      <path d="M-27 -12 Q-31 -52 0 -58 Q31 -52 27 -12 Z" fill="#c41e3a" />
      <path d="M-2 -56 L-2 -14" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
      <rect x={-28} y={-19} width={56} height={9} rx={4.5} fill="#fff" />
      <rect x={-27} y={-37} width={54} height={6} fill={INK} />
      <rect x={-6} y={-39} width={12} height={10} rx={2} fill="none" stroke="#d4a64a" strokeWidth={2.5} />
      {/* right arm, waving */}
      {pose === "wave" && (
        <g className="santa-wave">
          <path d="M21 -46 Q34 -54 40 -68" stroke="#c41e3a" strokeWidth={10} strokeLinecap="round" fill="none" />
          <circle cx={41} cy={-71} r={5.5} fill={INK} />
        </g>
      )}
      {/* beard + face */}
      <path d="M-17 -62 Q-20 -38 0 -32 Q20 -38 17 -62 Z" fill="#fff" />
      <circle cx={0} cy={-66} r={13} fill={SKIN} />
      <circle cx={-8} cy={-62} r={3} fill={CHEEK} opacity={0.6} />
      <circle cx={8} cy={-62} r={3} fill={CHEEK} opacity={0.6} />
      <g className="mascot-blink">
        <circle cx={-5} cy={-68} r={1.8} fill={INK} />
        <circle cx={5} cy={-68} r={1.8} fill={INK} />
      </g>
      <path d="M-9 -59 Q-4 -64 0 -60 Q4 -64 9 -59 Q4 -56 0 -58 Q-4 -56 -9 -59 Z" fill="#fff" />
      <circle cx={0} cy={-63} r={2.4} fill="#e8a088" />
      {glasses && (
        <g stroke="#d4a64a" strokeWidth={1.4} fill="rgba(255,255,255,0.25)">
          <circle cx={-5.5} cy={-68} r={4.2} />
          <circle cx={5.5} cy={-68} r={4.2} />
          <path d="M-1.3 -68 H1.3" fill="none" />
        </g>
      )}
      {/* arms forward, holding something in front */}
      {pose === "hold" && (
        <>
          <path d="M-22 -46 Q-28 -36 -12 -32" stroke="#c41e3a" strokeWidth={10} strokeLinecap="round" fill="none" />
          <path d="M22 -46 Q28 -36 12 -32" stroke="#c41e3a" strokeWidth={10} strokeLinecap="round" fill="none" />
          <circle cx={-10} cy={-32} r={5.5} fill={INK} />
          <circle cx={10} cy={-32} r={5.5} fill={INK} />
        </>
      )}
      {/* hat */}
      <path d="M-14 -75 Q-2 -102 22 -88 L15 -75 Z" fill="#c41e3a" />
      <rect x={-17} y={-80} width={34} height={8} rx={4} fill="#fff" />
      <circle cx={23} cy={-88} r={5.5} fill="#fff" />
    </g>
  );
}

export function Reindeer() {
  return (
    <g>
      {/* legs */}
      {[-22, -12, 10, 20].map((x) => (
        <rect key={x} x={x} y={-22} width={6} height={22} rx={2} fill="#6b3e26" />
      ))}
      {[-22, -12, 10, 20].map((x) => (
        <rect key={`h${x}`} x={x - 0.5} y={-4} width={7} height={4} rx={1.5} fill={INK} />
      ))}
      {/* body */}
      <ellipse cx={0} cy={-30} rx={29} ry={15} fill="#9a5b34" />
      <ellipse cx={2} cy={-24} rx={18} ry={7} fill="#c8935a" />
      <circle cx={-29} cy={-36} r={4.5} fill="#fff" />
      {/* head, bobbing */}
      <g className="deer-bob">
        <path d="M14 -38 Q20 -50 26 -54" stroke="#9a5b34" strokeWidth={11} strokeLinecap="round" fill="none" />
        <path d="M16 -42 Q22 -40 26 -46" stroke="#c41e3a" strokeWidth={5} strokeLinecap="round" fill="none" />
        <path d="M27 -64 L22 -82 M23 -76 L15 -80 M24 -70 L18 -71 M35 -64 L40 -82 M39 -76 L47 -80 M38 -70 L44 -71"
          stroke="#d9b98c" strokeWidth={3} strokeLinecap="round" fill="none" />
        <ellipse cx={23} cy={-62} rx={5} ry={2.6} fill="#6b3e26" transform="rotate(-30 23 -62)" />
        <ellipse cx={30} cy={-56} rx={11} ry={9.5} fill="#9a5b34" />
        <ellipse cx={40} cy={-52} rx={8} ry={6} fill="#c8935a" />
        <g className="mascot-blink">
          <circle cx={31} cy={-59} r={1.8} fill={INK} />
        </g>
        <circle cx={47} cy={-53} r={4} fill="#ff3b4e" className="nose-glow" />
        <path d="M37 -48 Q40 -46 43 -48" stroke={INK} strokeWidth={1.2} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function Elf({ pose = "hold" }: { pose?: "hold" | "work" } = {}) {
  return (
    <g className={pose === "hold" ? "elf-hop" : undefined}>
      {/* curly shoes */}
      <path d="M-13 0 L-3 0 L-3 -6 L-11 -6 Q-17 -6 -17 -11" stroke="#c41e3a" strokeWidth={4} fill="#c41e3a" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 0 L3 0 L3 -6 L11 -6 Q17 -6 17 -11" stroke="#c41e3a" strokeWidth={4} fill="#c41e3a" strokeLinecap="round" strokeLinejoin="round" />
      {/* legs */}
      <rect x={-8} y={-16} width={5} height={11} fill="#fff" />
      <rect x={3} y={-16} width={5} height={11} fill="#fff" />
      <rect x={-8} y={-12} width={5} height={3} fill="#c41e3a" />
      <rect x={3} y={-12} width={5} height={3} fill="#c41e3a" />
      {/* tunic */}
      <path d="M-15 -14 L-10 -42 L10 -42 L15 -14 Z" fill="#1f6b45" />
      <rect x={-12} y={-26} width={24} height={4} fill="#d4a64a" />
      <path d="M-11 -42 L-7 -37 L-3 -42 L1 -37 L5 -42 L9 -37 L11 -42 Z" fill="#c41e3a" />
      {pose === "hold" ? (
        <>
          {/* arms holding a gift */}
          <path d="M-10 -38 Q-16 -30 -6 -26" stroke="#1f6b45" strokeWidth={6} strokeLinecap="round" fill="none" />
          <path d="M10 -38 Q16 -30 6 -26" stroke="#1f6b45" strokeWidth={6} strokeLinecap="round" fill="none" />
          <rect x={-8} y={-33} width={16} height={12} rx={1.5} fill="#c41e3a" />
          <rect x={-1.5} y={-33} width={3} height={12} fill="#d4a64a" />
          <path d="M0 -33 Q-6 -39 -3 -34 M0 -33 Q6 -39 3 -34" stroke="#d4a64a" strokeWidth={2} fill="none" />
        </>
      ) : (
        <>
          {/* arms reaching to the right, busy wrapping */}
          <g className="elf-work-a">
            <path d="M8 -38 Q20 -38 26 -30" stroke="#1f6b45" strokeWidth={6} strokeLinecap="round" fill="none" />
            <circle cx={27} cy={-29} r={3.4} fill="#f6c9a8" />
          </g>
          <g className="elf-work-b">
            <path d="M-8 -36 Q12 -26 24 -24" stroke="#1f6b45" strokeWidth={6} strokeLinecap="round" fill="none" />
            <circle cx={25} cy={-24} r={3.4} fill="#f6c9a8" />
          </g>
        </>
      )}
      {/* head */}
      <path d="M-11 -52 L-19 -58 L-10 -47 Z" fill={SKIN} />
      <path d="M11 -52 L19 -58 L10 -47 Z" fill={SKIN} />
      <circle cx={0} cy={-51} r={11} fill={SKIN} />
      <g className="mascot-blink">
        <circle cx={-4} cy={-53} r={1.6} fill={INK} />
        <circle cx={4} cy={-53} r={1.6} fill={INK} />
      </g>
      <circle cx={-7} cy={-48} r={2.4} fill={CHEEK} opacity={0.6} />
      <circle cx={7} cy={-48} r={2.4} fill={CHEEK} opacity={0.6} />
      <path d="M-3.5 -47 Q0 -44 3.5 -47" stroke={INK} strokeWidth={1.3} fill="none" strokeLinecap="round" />
      {/* hat */}
      <path d="M-12 -57 Q-4 -92 22 -80 L12 -58 Z" fill="#1f6b45" />
      <rect x={-13} y={-61} width={26} height={6} rx={3} fill="#c41e3a" />
      <circle cx={23} cy={-80} r={3.8} fill="#d4a64a" className="bell-ring" />
    </g>
  );
}

const views = {
  santa: { el: Santa, box: "-40 -104 88 108" },
  reindeer: { el: Reindeer, box: "-38 -86 92 90" },
  elf: { el: Elf, box: "-26 -96 54 100" },
} as const;

export function MascotIcon({ kind, size = 96, className = "" }: { kind: keyof typeof views; size?: number; className?: string }) {
  const { el: El, box } = views[kind];
  return (
    <svg viewBox={box} width={size} height={size} className={`mascot ${className}`} aria-hidden="true" overflow="visible">
      <El />
    </svg>
  );
}
