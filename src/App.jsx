import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TOTAL_TIME, STREAK_BONUS, STREAK_NEEDED, BOARD_RATIO } from "./constants";
import { generateShapes, generateQuestion } from "./utils";
import { usePhysics } from "./hooks/usePhysics";
import Board          from "./components/Board";
import GameHeader     from "./components/GameHeader";
import BonusFlash     from "./components/BonusFlash";
import FeedbackScreen from "./components/FeedbackScreen";
import StartScreen    from "./components/StartScreen";
import ResultScreen   from "./components/ResultScreen";

export default function App() {
  // ── Screen / phase state ─────────────────────────────────────────────────
  const [screen, setScreen] = useState("start"); // "start" | "game" | "result"
  const [phase, setPhase]   = useState("question"); // "question" | "board" | "feedback"

  // ── Game data ────────────────────────────────────────────────────────────
  const [shapes, setShapes]     = useState([]);
  const [question, setQuestion] = useState(null);
  const [input, setInput]       = useState("");
  const [feedback, setFeedback] = useState(null); // true | false | null

  // ── Counters ─────────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft]   = useState(TOTAL_TIME);
  const [streak, setStreak]       = useState(0);
  const [stats, setStats]         = useState({ correct: 0, total: 0 });
  const [elapsed, setElapsed]     = useState(0);
  const [bonusText, setBonusText] = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const timerRef      = useRef(null);
  const timeRef       = useRef(TOTAL_TIME);
  const inputRef      = useRef(null);
  const activeRef     = useRef(false);
  const shapeCountRef = useRef(8); // tracks shape count without triggering re-renders

  // ── Board dimensions ─────────────────────────────────────────────────────
  const boardWidth  = useMemo(() => Math.min(420, window.innerWidth - 32), []);
  const boardHeight = useMemo(() => {
    const maxHeight = window.innerHeight - 280;
    return Math.min(Math.round(boardWidth * BOARD_RATIO), maxHeight);
  }, [boardWidth]);

  // ── Physics hook ─────────────────────────────────────────────────────────
  const { start: startPhysics, stop: stopPhysics } = usePhysics(
    boardWidth,
    boardHeight,
    setShapes
  );

  // ── Helpers ──────────────────────────────────────────────────────────────
  const newRound = useCallback(() => {
    shapeCountRef.current = Math.min(shapeCountRef.current + 1, 16);
    const s = generateShapes(shapeCountRef.current, boardWidth, boardHeight);
    setShapes(s);
    setQuestion(generateQuestion(s));
    setInput("");
    setPhase("question");
    stopPhysics();
  }, [stopPhysics, boardWidth, boardHeight]);

  const startGame = useCallback(() => {
    clearInterval(timerRef.current);
    stopPhysics();
    shapeCountRef.current = 8;
    const s = generateShapes(8, boardWidth, boardHeight);
    const q = generateQuestion(s);
    timeRef.current   = TOTAL_TIME;
    activeRef.current = true;
    setShapes(s);
    setQuestion(q);
    setInput("");
    setFeedback(null);
    setPhase("question");
    setTimeLeft(TOTAL_TIME);
    setStreak(0);
    setStats({ correct: 0, total: 0 });
    setElapsed(0);
    setScreen("game");
  }, [stopPhysics, boardWidth, boardHeight]);

  const handleRestart = useCallback(() => {
    clearInterval(timerRef.current);
    stopPhysics();
    activeRef.current = false;
    setScreen("start");
  }, [stopPhysics]);

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "game") return;
    timeRef.current = TOTAL_TIME;
    timerRef.current = setInterval(() => {
      const next = timeRef.current - 1;
      timeRef.current = next;
      setTimeLeft(next);
      setElapsed((e) => e + 1);
      if (next <= 0) {
        clearInterval(timerRef.current);
        stopPhysics();
        activeRef.current = false;
        setScreen("result");
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, stopPhysics]);

  // ── Phase handlers ────────────────────────────────────────────────────────
  const handleShowBoard = useCallback(() => {
    setPhase("board");
    startPhysics();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [startPhysics]);

  const handleSubmit = useCallback(() => {
    if (phase !== "board" || !question) return;
    const val = parseInt(input.trim(), 10);
    if (isNaN(val)) return;
    stopPhysics();
    const isCorrect = val === question.answer;
    setFeedback(isCorrect);
    setPhase("feedback");
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    setStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total:   prev.total + 1,
    }));
    if (newStreak > 0 && newStreak % STREAK_NEEDED === 0) {
      timeRef.current += STREAK_BONUS;
      setTimeLeft((t) => Math.min(t + STREAK_BONUS, TOTAL_TIME * 2));
      setBonusText(true);
      setTimeout(() => setBonusText(false), 2000);
    }
    setTimeout(() => {
      if (!activeRef.current) return;
      setFeedback(null);
      newRound();
    }, 900);
  }, [phase, input, question, streak, stopPhysics, newRound]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "r" || e.key === "R") handleRestart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRestart]);

  const handleKey = useCallback((e) => {
    if (e.key !== "Enter") return;
    if (phase === "question") handleShowBoard();
    else if (phase === "board") handleSubmit();
  }, [phase, handleShowBoard, handleSubmit]);

  // ── Screen routing ────────────────────────────────────────────────────────
  if (screen === "start")  return <StartScreen onStart={startGame} />;
  if (screen === "result") return (
    <ResultScreen
      correct={stats.correct}
      total={stats.total}
      elapsed={elapsed}
      onRestart={() => setScreen("start")}
    />
  );

  // ── Game screen ───────────────────────────────────────────────────────────
  return (
    <div
      className="game-screen min-h-screen w-full flex flex-col items-center justify-start font-mono text-white p-4 pt-8 select-none"
      style={{ background: "linear-gradient(135deg, #0a1015 0%, #0f1e2e 100%)" }}
    >
      <style>{`
        @keyframes pop {
          0%   { transform: scale(0.3); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bonusPop {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.6); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input:focus  { outline: none; }
        button:focus { outline: none; }
      `}</style>

      <BonusFlash show={bonusText} />

      {/* Header — always visible so timer is always shown */}
      <GameHeader
        timeLeft={timeLeft}
        total={TOTAL_TIME}
        stats={stats}
        streak={streak}
        boardWidth={boardWidth}
        onRestart={handleRestart}
      />

      {/* Board + all overlays including input */}
      <div className="relative rounded-xl mt-3">
        <Board
          shapes={phase === "question" ? [] : shapes}
          width={boardWidth}
          height={boardHeight}
        />

        {/* Question overlay — covers board entirely */}
        {phase === "question" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-xl backdrop-blur-xl"
            style={{ background: "rgba(10,16,21,0.88)", animation: "slideIn 0.25s ease" }}
          >
            <p className="text-[11px] tracking-[4px] text-white/35 uppercase mb-3">
              Your Question
            </p>
            <p className="text-[22px] font-bold text-center max-w-[80%] leading-snug text-white capitalize">
              {question?.text}
            </p>
            <button
              onClick={handleShowBoard}
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleShowBoard(); }}
              className="mt-7 px-8 py-2.5 text-[13px] font-black tracking-[4px] uppercase font-mono text-white rounded-md border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg, #2b6cb0, #3182ce)" }}
            >
              Show Board ↵
            </button>
          </div>
        )}

        {/* Feedback overlay */}
        {phase === "feedback" && <FeedbackScreen correct={feedback} />}

        {/* Input overlay — floats over bottom of board so shapes stay visible above */}
        {phase === "board" && (
          <div
            className="absolute bottom-0 left-0 right-0 p-2 rounded-b-xl"
            style={{
              background: "linear-gradient(to top, rgba(10,16,21,0.75) 0%, transparent)",
              animation: "slideIn 0.2s ease",
            }}
          >
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <input
                ref={inputRef}
                type="number"
                min={0}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your answer..."
                className="w-full px-3 py-2 text-sm font-bold font-mono text-white rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,179,237,0.4)")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}