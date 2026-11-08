import { Santa } from "../mascots/Mascots";

/** Santa with his glasses on, reading a very long list. */
export function SantaList({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-70 -120 140 150" className={className} role="img" aria-label="Le Père Noël lit sa liste">
      <ellipse cx={0} cy={2} rx={56} ry={7} fill="#000" opacity={0.25} />
      <Santa pose="hold" glasses />
      {/* the list, swinging gently */}
      <g className="list-sway">
        <path d="M-16 -34 H16 L18 -2 Q24 10 34 6 Q42 4 40 -4 Q30 2 26 -6 L22 -34" fill="#fbf6ef" stroke="#d4a64a" strokeWidth={1.2} />
        <rect x={-18} y={-38} width={36} height={6} rx={3} fill="#f3e3c3" stroke="#d4a64a" strokeWidth={1.2} />
        {[-26, -20, -14, -8].map((y) => (
          <path key={y} d={`M-10 ${y} H${y % 12 === 0 ? 6 : 10}`} stroke="#8e1328" strokeWidth={1.6} strokeLinecap="round" />
        ))}
        <path d="M-12 -26 l2 2 l3 -4 M-12 -14 l2 2 l3 -4" stroke="#1f6b45" strokeWidth={1.4} fill="none" />
      </g>
      <circle cx={-10} cy={-32} r={5.5} fill="#2a1a1f" />
      <circle cx={10} cy={-32} r={5.5} fill="#2a1a1f" />
    </svg>
  );
}
