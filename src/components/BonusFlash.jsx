import { STREAK_BONUS } from "../constants";

// Shown for 2 seconds when the player hits a 6-streak.
// `show` is a boolean controlled by the parent.
export default function BonusFlash({ show }) {
  if (!show) return null;

  return (
    <div
      className="fixed top-6 z-50 font-black text-sm tracking-[3px] uppercase px-7 py-2.5 rounded-lg whitespace-nowrap font-mono"
      style={{
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(135deg, #d69e2e, #f6ad55)",
        color: "#1a1a00",
        boxShadow: "0 0 30px rgba(246,173,85,0.5)",
        animation: "bonusPop 0.4s cubic-bezier(0.175,0.885,0.32,1.275)",
      }}
    >
      +{STREAK_BONUS}s Bonus! 🔥
    </div>
  );
}