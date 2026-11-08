import { Elf } from "../mascots/Mascots";

/** An elf wrapping a present on a workbench: the ribbon ties itself, the bow pops, sparkles. */
export function ElfWorkshop({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 190" className={className} role="img" aria-label="Un lutin emballe un cadeau">
      {/* soft spotlight */}
      <ellipse cx={150} cy={170} rx={130} ry={16} fill="#000" opacity={0.25} />
      {/* workbench */}
      <rect x={108} y={128} width={160} height={10} rx={3} fill="#9a5b34" />
      <rect x={118} y={138} width={8} height={34} fill="#6b3e26" />
      <rect x={250} y={138} width={8} height={34} fill="#6b3e26" />
      {/* paper roll and ribbon spool on the bench */}
      <rect x={226} y={114} width={36} height={14} rx={7} fill="#f3e3c3" />
      <path d="M232 114 V128 M240 114 V128 M248 114 V128 M256 114 V128" stroke="#c41e3a" strokeWidth={2} />
      <circle cx={122} cy={121} r={7} fill="#d4a64a" />
      <circle cx={122} cy={121} r={2.5} fill="#8a6420" />
      {/* the present being wrapped */}
      <g>
        <rect x={146} y={78} width={66} height={50} rx={3} fill="#c41e3a" />
        <rect x={142} y={70} width={74} height={14} rx={3} fill="#b3122a" />
        {/* ribbon that ties itself */}
        <path d="M179 70 V128" stroke="#d4a64a" strokeWidth={7} className="ribbon-draw" pathLength={1} />
        <path d="M142 100 H216" stroke="#d4a64a" strokeWidth={7} className="ribbon-draw ribbon-late" pathLength={1} />
        {/* bow */}
        <g className="bow-pop">
          <path d="M179 70 Q160 50 166 66 Q170 74 179 70 Q198 50 192 66 Q188 74 179 70 Z" fill="#f3c34a" stroke="#d4a64a" strokeWidth={2} />
          <circle cx={179} cy={69} r={4} fill="#d4a64a" />
        </g>
        {[[150, 52], [206, 46], [180, 34], [222, 66]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 6} L${x + 1.6} ${y - 1.6} L${x + 6} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 6} L${x - 1.6} ${y + 1.6} L${x - 6} ${y} L${x - 1.6} ${y - 1.6} Z`}
            fill="#f3c34a" className="sparkle" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </g>
      {/* the elf, standing on a little stool */}
      <rect x={82} y={150} width={44} height={22} rx={4} fill="#6b3e26" />
      <g transform="translate(104 150) scale(1.25)"><Elf pose="work" /></g>
    </svg>
  );
}
