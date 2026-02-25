/**
 * Board.jsx
 *
 * HOW TO USE YOUR OWN IMAGES
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Place your images in src/assets/ and name them:
 *      {color}-{shape}.png
 *    e.g.  red-circle.png  |  brown-triangle.png  |  black-rectangle.png
 *
 * 2. The full set of 12 filenames you need:
 *      red-circle.png       blue-circle.png       black-circle.png       brown-circle.png
 *      red-triangle.png     blue-triangle.png     black-triangle.png     brown-triangle.png
 *      red-rectangle.png    blue-rectangle.png    black-rectangle.png    brown-rectangle.png
 *
 * 3. Import them all below in the IMAGE_MAP section and you're done.
 *    The component automatically picks the right image from color + shape.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { useId } from "react";

// ── Import your images here ──────────────────────────────────────────────────
import redCircle      from "../assets/red-circle.png";
import redTriangle    from "../assets/red-triangle.png";
import redRectangle   from "../assets/red-rectangle.png";
import blueCircle     from "../assets/blue-circle.png";
import blueTriangle   from "../assets/blue-triangle.png";
import blueRectangle  from "../assets/blue-rectangle.png";
import blackCircle    from "../assets/black-circle.png";
import blackTriangle  from "../assets/black-triangle.png";
import blackRectangle from "../assets/black-rectangle.png";
import brownCircle    from "../assets/brown-circle.png";
import brownTriangle  from "../assets/brown-triangle.png";
import brownRectangle from "../assets/brown-rectangle.png";

// ── Map: "color-shape" → image src ──────────────────────────────────────────
const IMAGE_MAP = {
  "red-circle":       redCircle,
  "red-triangle":     redTriangle,
  "red-rectangle":    redRectangle,
  "blue-circle":      blueCircle,
  "blue-triangle":    blueTriangle,
  "blue-rectangle":   blueRectangle,
  "black-circle":     blackCircle,
  "black-triangle":   blackTriangle,
  "black-rectangle":  blackRectangle,
  "brown-circle":     brownCircle,
  "brown-triangle":   brownTriangle,
  "brown-rectangle":  brownRectangle,
};

// ── Board ────────────────────────────────────────────────────────────────────
export default function Board({ shapes, width, height }) {
  // useId() produces a unique, stable id per component instance — avoids the
  // duplicate id="grid" conflict if Board ever renders more than once at a time.
  const uid     = useId();
  const gridId  = `grid-${uid}`;

  return (
    <div
      className="relative rounded-xl border-2 border-white/8 overflow-hidden"
      style={{
        width,
        height,
        background: "linear-gradient(135deg, #0f1923 0%, #1a2a3a 100%)",
        boxShadow: "0 0 60px rgba(0,0,0,0.5) inset",
      }}
    >
      {/* Subtle grid overlay */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
      </svg>

      {/* Shapes — positioned absolutely using physics x/y */}
      {shapes.map((s) => {
        const key = `${s.color}-${s.shape}`;
        const src = IMAGE_MAP[key];

        // Warn loudly in dev if a combo is missing rather than silently showing
        // a broken-image icon.
        if (!src) {
          console.warn(`[Board] Missing image for "${key}". Add it to IMAGE_MAP.`);
          return null;
        }

        const diameter = s.size * 2;
        return (
          <img
            key={s.id}
            src={src}
            alt={`${s.color} ${s.shape}`}
            className="absolute pointer-events-none select-none"
            style={{
              width:  diameter,
              height: diameter,
              left:   s.x - s.size,
              top:    s.y - s.size,
              objectFit: "contain",
            }}
          />
        );
      })}
    </div>
  );
}