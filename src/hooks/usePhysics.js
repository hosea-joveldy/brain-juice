import { useRef, useCallback, useEffect } from "react";

export function usePhysics(boardWidth, boardHeight, onFrame) {
  const animRef   = useRef(null);
  // Keep onFrame in a ref so stale closures never become an issue
  const onFrameRef = useRef(onFrame);
  useEffect(() => { onFrameRef.current = onFrame; }, [onFrame]);

  const start = useCallback(() => {
    // Cancel any existing loop before starting a new one (prevents double-loop bug)
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const W = boardWidth;
    const H = boardHeight;
    let lastTime = performance.now();

    const tick = (now) => {
      // Delta-time: normalise to 60 fps so physics speed is monitor-independent
      const dt = Math.min((now - lastTime) / (1000 / 60), 2);
      lastTime = now;

      onFrameRef.current((prev) => {
        const arr = prev.map((s) => ({ ...s }));

        // ── Move ────────────────────────────────────────────────────────────
        for (const s of arr) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
        }

        // ── Shape-vs-shape collisions (elastic, equal mass) ─────────────────
        for (let i = 0; i < arr.length; i++) {
          for (let j = i + 1; j < arr.length; j++) {
            const a = arr[i];
            const b = arr[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = a.size + b.size;
            if (dist < minDist && dist > 0) {
              const nx = dx / dist;
              const ny = dy / dist;
              // Separate overlapping shapes
              const overlap = (minDist - dist) / 2;
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;
              // Reflect velocities along collision normal
              const dot = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
              if (dot > 0) {
                a.vx -= dot * nx;
                a.vy -= dot * ny;
                b.vx += dot * nx;
                b.vy += dot * ny;
              }
            }
          }
        }

        // ── Wall collisions — run AFTER collision resolution ────────────────
        // (running after prevents separation from pushing shapes through walls)
        for (const s of arr) {
          if (s.x - s.size < 0)  { s.x = s.size;    s.vx =  Math.abs(s.vx); }
          if (s.x + s.size > W)  { s.x = W - s.size; s.vx = -Math.abs(s.vx); }
          if (s.y - s.size < 0)  { s.y = s.size;    s.vy =  Math.abs(s.vy); }
          if (s.y + s.size > H)  { s.y = H - s.size; s.vy = -Math.abs(s.vy); }
        }

        return arr;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
  }, [boardWidth, boardHeight]); // onFrame intentionally excluded — handled via ref

  const stop = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  return { start, stop };
}