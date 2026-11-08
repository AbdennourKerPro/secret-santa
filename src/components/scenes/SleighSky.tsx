import { Reindeer, Santa } from "../mascots/Mascots";

/** Santa's sleigh, pulled by two reindeer, drawn facing right. */
export function Sleigh() {
  return (
    <svg viewBox="0 0 330 120" className="h-full w-full overflow-visible" aria-hidden="true">
      {/* sparkle trail */}
      {[[8, 74, 2], [22, 66, 3], [34, 78, 2.2], [46, 70, 2.6], [12, 86, 1.6]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#f3c34a" className="twinkle" style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
      {/* gift sack behind Santa */}
      <path d="M66 62 Q60 34 80 30 Q98 34 92 62 Z" fill="#8e1328" />
      <rect x={70} y={24} width={14} height={12} rx={2} fill="#d4a64a" />
      <rect x={82} y={28} width={11} height={10} rx={2} fill="#fff" />
      {/* Santa sitting, lower body hidden by the sleigh */}
      <g transform="translate(112 92) scale(0.72)"><Santa /></g>
      {/* sleigh */}
      <path d="M56 58 Q42 40 60 36" stroke="#c41e3a" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M54 58 Q52 92 84 92 L138 92 Q150 92 152 80 L156 56 Q128 64 100 60 Z" fill="#c41e3a" />
      <path d="M58 66 Q100 72 154 62" stroke="#d4a64a" strokeWidth={3} fill="none" />
      <path d="M68 92 L66 102 M136 92 L138 102" stroke="#d4a64a" strokeWidth={3} />
      <path d="M48 104 L146 104 Q166 104 168 90" stroke="#d4a64a" strokeWidth={4.5} strokeLinecap="round" fill="none" />
      {/* harness */}
      <path d="M154 70 Q190 82 214 76 M214 76 Q250 72 276 70" stroke="#d4a64a" strokeWidth={1.8} fill="none" />
      {/* reindeer, galloping */}
      <g className="gallop" style={{ animationDelay: "-0.3s" }}><g transform="translate(208 104) scale(0.72)"><Reindeer /></g></g>
      <g className="gallop"><g transform="translate(272 98) scale(0.72)"><Reindeer /></g></g>
    </svg>
  );
}

/** A thin strip of sky where the sleigh crosses the screen from time to time. Decorative. */
export function SleighSky({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden ${className}`} aria-hidden="true">
      <div className="sleigh-fly absolute top-6 left-0 h-[72px] w-[200px] sm:h-[96px] sm:w-[264px]">
        <Sleigh />
      </div>
    </div>
  );
}
