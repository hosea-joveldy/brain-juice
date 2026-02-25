// SVG attributes (cx, cy, stroke, etc.) are SVG props — Tailwind doesn't apply to them.
// The wrapper div is position:relative so the number overlay can sit centred on top.
export default function TimerRing({ timeLeft, total }) {
  const r    = 28;
  const circ = 2 * Math.PI * r;
  // Clamp to [0,1] — streak bonuses can push timeLeft above total, which would
  // make pct > 1 and cause the arc to draw past the full circle and wrap backwards.
  const pct   = Math.min(1, Math.max(0, timeLeft / total));
  const color = timeLeft <= 10 ? "#fc4444" : timeLeft <= 20 ? "#f6ad55" : "#68d391";

  return (
    // Wrapper keeps the SVG ring and the number perfectly centred on each other
    // without relying on SVG <text> + double-rotation (unreliable in Safari).
    <div className="relative" style={{ width: 72, height: 72 }}>
      {/* Ring — rotated -90° so arc starts at the top */}
      <svg
        width={72}
        height={72}
        className="absolute inset-0 -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={36} cy={36} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={5}
        />
        {/* Progress arc */}
        <circle
          cx={36} cy={36} r={r}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s linear, stroke 0.3s" }}
        />
      </svg>

      {/* Number — plain div overlay, no rotation tricks needed */}
      <div
        className="absolute inset-0 flex items-center justify-center text-sm font-bold font-mono"
        style={{ color }}
      >
        {timeLeft}
      </div>
    </div>
  );
}