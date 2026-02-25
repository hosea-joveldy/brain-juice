// Overlay shown for ~900ms after each answer: ✓ or ✗ with a glow effect.
export default function FeedbackScreen({ correct }) {
  const glowColor  = correct ? "#68d391" : "#fc4444";
  const bgGradient = correct
    ? "radial-gradient(ellipse at center, rgba(72,187,120,0.25) 0%, rgba(0,0,0,0.85) 70%)"
    : "radial-gradient(ellipse at center, rgba(245,101,101,0.25) 0%, rgba(0,0,0,0.85) 70%)";

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-xl"
      style={{ background: bgGradient }}
    >
      <div
        className="text-7xl leading-none"
        style={{
          filter:    `drop-shadow(0 0 20px ${glowColor})`,
          animation: "pop 0.3s cubic-bezier(0.175,0.885,0.32,1.275)",
        }}
      >
        {correct ? "✓" : "✗"}
      </div>
      <p
        className="mt-3 text-2xl font-black tracking-widest uppercase font-mono"
        style={{ color: glowColor }}
      >
        {correct ? "Correct!" : "Wrong!"}
      </p>
    </div>
  );
}