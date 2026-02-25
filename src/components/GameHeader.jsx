import TimerRing from "./TimerRing";
import { TOTAL_TIME } from "../constants";

export default function GameHeader({ timeLeft, stats, streak, boardWidth, onRestart }) {
  return (
    <div className="flex items-center gap-5 mb-4" style={{ width: boardWidth }}>
      <TimerRing timeLeft={timeLeft} total={TOTAL_TIME} />

      {/* Score */}
      <div className="flex-1">
        <div className="text-[11px] tracking-[3px] text-white/35 uppercase">Score</div>
        <div className="text-[22px] font-black" style={{ color: "#63b3ed" }}>
          {stats.correct}
          <span className="text-sm text-white/30">/{stats.total}</span>
        </div>
      </div>

      {/* Streak */}
      <div className="text-right">
        <div className="text-[11px] tracking-[3px] text-white/35 uppercase">Streak</div>
        <div
          className="text-[22px] font-black"
          style={{ color: streak >= 4 ? "#f6ad55" : "white" }}
        >
          {streak}{streak > 0 ? "🔥" : ""}
        </div>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        title="Restart (R)"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(245,101,101,0.15)";
          e.currentTarget.style.color = "#fc4444";
          e.currentTarget.style.borderColor = "rgba(245,101,101,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "rgba(255,255,255,0.45)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        }}
        className="px-2.5 py-1.5 text-[11px] font-black tracking-wide uppercase font-mono rounded-md cursor-pointer text-center leading-snug"
        style={{
          background: "rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.45)",
          border: "1px solid rgba(255,255,255,0.1)",
          transition: "all 0.15s",
        }}
      >
        ↺<br />[R]
      </button>
    </div>
  );
}