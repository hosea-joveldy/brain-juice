import { useEffect } from "react";

function Row({ label, children }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/50 text-xs tracking-widest">{label}</span>
      {children}
    </div>
  );
}

export default function ResultScreen({ correct, total, elapsed, onRestart }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const scoreColor = pct >= 75 ? "#68d391" : pct >= 50 ? "#f6ad55" : "#fc4444";
  const emoji = pct >= 75 ? "🏆" : pct >= 50 ? "🎯" : "💀";

  // Press Enter to play again
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Enter") onRestart(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRestart]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-mono text-white p-6"
      style={{ background: "linear-gradient(135deg, #0a1015 0%, #0f1e2e 100%)" }}
    >
      <div className="text-5xl">{emoji}</div>

      <h2 className="text-3xl font-black tracking-[4px] mt-3 uppercase" style={{ color: "#63b3ed" }}>
        Results
      </h2>

      <div className="mt-8 px-12 py-7 rounded-xl flex flex-col gap-4 min-w-65 border border-white/8 bg-white/4">
        <Row label="CORRECT">
          <span className="text-2xl font-black" style={{ color: scoreColor }}>
            {correct} / {total}
          </span>
        </Row>
        <Row label="ACCURACY">
          <span className="text-2xl font-black">{pct}%</span>
        </Row>
        <Row label="TIME PLAYED">
          <span className="text-2xl font-black">{elapsed}s</span>
        </Row>
      </div>

      <button
        onClick={onRestart}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(49,130,206,0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        className="mt-8 px-10 py-3 text-sm font-black tracking-[4px] uppercase font-mono rounded-lg cursor-pointer border-2 border-blue-600"
        style={{ background: "transparent", color: "#63b3ed", transition: "background 0.2s" }}
      >
        Play Again ↵
      </button>
    </div>
  );
}