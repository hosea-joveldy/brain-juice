import { TOTAL_TIME, STREAK_BONUS, STREAK_NEEDED } from "../constants";
import { useEnterKey } from "../hooks/useEnterKey";

export default function StartScreen({ onStart }) {
  useEnterKey(onStart);
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center font-mono text-white p-6"
      style={{ background: "linear-gradient(135deg, #0a1015 0%, #0f1e2e 100%)" }}
    >
      <div className="text-5xl mb-2">🔷</div>

      <h1
        className="text-4xl font-black tracking-[6px] uppercase m-0"
        style={{
          background: "linear-gradient(90deg, #63b3ed, #fbb6ce)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Color Count
      </h1>

      <p className="text-white/50 text-sm mt-2 tracking-widest text-center max-w-xs">
        Count the shapes. Beat the clock. Chain {STREAK_NEEDED} correct answers for bonus time.
      </p>

      <div className="mt-8 flex flex-col gap-2.5 text-sm text-white/40 tracking-wide">
        <span>⏱ {TOTAL_TIME} seconds on the clock</span>
        <span>🔥 {STREAK_NEEDED}-streak = +{STREAK_BONUS} seconds</span>
      </div>

      <button
        onClick={onStart}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        className="mt-10 px-12 py-3.5 text-base font-black tracking-[4px] uppercase font-mono text-white rounded-lg border-none cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #2b6cb0, #3182ce)",
          boxShadow: "0 0 30px rgba(49,130,206,0.4)",
          transition: "transform 0.1s",
        }}
      >
        Start
      </button>
    </div>
  );
}