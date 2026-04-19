// frontend/src/components/landing/hero-bg.tsx

export function HeroBg() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 480"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient mask: nodes fully visible top half, fade to transparent bottom 30% */}
        <linearGradient id="hero-node-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="1" />
          <stop offset="60%"  stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="hero-node-mask">
          <rect width="1200" height="480" fill="url(#hero-node-fade)" />
        </mask>

        {/* Pulse keyframe for key nodes */}
        <style>{`
          .node-pulse-a { animation: node-pulse 5s ease-in-out infinite; }
          .node-pulse-b { animation: node-pulse 4s ease-in-out infinite 0.8s; }
          .node-pulse-c { animation: node-pulse 6s ease-in-out infinite 1.6s; }
          .node-pulse-d { animation: node-pulse 4.5s ease-in-out infinite 2.4s; }
          @keyframes node-pulse {
            0%, 100% { opacity: 0.40; }
            50%       { opacity: 0.65; }
          }
          @media (prefers-reduced-motion: reduce) {
            .node-pulse-a,
            .node-pulse-b,
            .node-pulse-c,
            .node-pulse-d { animation: none; opacity: 0.50; }
          }
        `}</style>
      </defs>

      {/* All nodes and edges are masked so they fade at the bottom */}
      <g mask="url(#hero-node-mask)">

        {/* ── Edges ─────────────────────────────────────── */}
        <line x1="120" y1="80"  x2="300" y2="140" stroke="rgba(245,158,11,0.11)" strokeWidth="1" />
        <line x1="300" y1="140" x2="520" y2="60"  stroke="rgba(245,158,11,0.10)" strokeWidth="1" />
        <line x1="520" y1="60"  x2="680" y2="170" stroke="rgba(245,158,11,0.10)" strokeWidth="1" />
        <line x1="680" y1="170" x2="850" y2="90"  stroke="rgba(245,158,11,0.09)" strokeWidth="1" />
        <line x1="850" y1="90"  x2="1050" y2="150" stroke="rgba(245,158,11,0.09)" strokeWidth="1" />
        <line x1="1050" y1="150" x2="1150" y2="80" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
        <line x1="300"  y1="140" x2="200"  y2="260" stroke="rgba(245,158,11,0.09)" strokeWidth="1" />
        <line x1="680"  y1="170" x2="430"  y2="300" stroke="rgba(245,158,11,0.08)" strokeWidth="1" strokeDasharray="5 6" />
        <line x1="520"  y1="60"  x2="430"  y2="300" stroke="rgba(245,158,11,0.07)" strokeWidth="1" strokeDasharray="5 6" />
        <line x1="430"  y1="300" x2="650"  y2="340" stroke="rgba(245,158,11,0.09)" strokeWidth="1" />
        <line x1="650"  y1="340" x2="820"  y2="280" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
        <line x1="820"  y1="280" x2="1000" y2="310" stroke="rgba(245,158,11,0.08)" strokeWidth="1" />
        <line x1="200"  y1="260" x2="430"  y2="300" stroke="rgba(245,158,11,0.07)" strokeWidth="1" />

        {/* ── Glow halos (static, behind the node dots) ── */}
        <circle cx="300"  cy="140" r="14" fill="rgba(245,158,11,0.06)" />
        <circle cx="680"  cy="170" r="12" fill="rgba(245,158,11,0.05)" />
        <circle cx="1050" cy="150" r="13" fill="rgba(245,158,11,0.05)" />
        <circle cx="430"  cy="300" r="12" fill="rgba(245,158,11,0.05)" />

        {/* ── Nodes — small (static) ────────────────────── */}
        <circle cx="120"  cy="80"  r="3"   fill="rgba(245,158,11,0.28)" />
        <circle cx="520"  cy="60"  r="3.5" fill="rgba(245,158,11,0.32)" />
        <circle cx="850"  cy="90"  r="3"   fill="rgba(245,158,11,0.28)" />
        <circle cx="1150" cy="80"  r="2.5" fill="rgba(245,158,11,0.22)" />
        <circle cx="200"  cy="260" r="3"   fill="rgba(245,158,11,0.26)" />
        <circle cx="650"  cy="340" r="3"   fill="rgba(245,158,11,0.26)" />
        <circle cx="820"  cy="280" r="3.5" fill="rgba(245,158,11,0.28)" />
        <circle cx="1000" cy="310" r="3"   fill="rgba(245,158,11,0.24)" />

        {/* ── Nodes — key (pulse animated) ─────────────── */}
        <circle cx="300"  cy="140" r="5.5" fill="rgba(245,158,11,0.52)" className="node-pulse-a" />
        <circle cx="680"  cy="170" r="4.5" fill="rgba(245,158,11,0.45)" className="node-pulse-b" />
        <circle cx="1050" cy="150" r="5"   fill="rgba(245,158,11,0.48)" className="node-pulse-c" />
        <circle cx="430"  cy="300" r="4.5" fill="rgba(245,158,11,0.42)" className="node-pulse-d" />
      </g>
    </svg>
  );
}

export default HeroBg;
