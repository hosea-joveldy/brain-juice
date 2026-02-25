import { SHAPES, COLORS, BOARD_RATIO } from "./constants";

const QUESTION_TEMPLATES = [
  (c)    => ({ text: `How many ${c} shapes?`,   filter: (s)  => s.color === c }),
  (s)    => ({ text: `How many ${s}s?`,          filter: (sh) => sh.shape === s }),
  (c, s) => ({ text: `How many ${c} ${s}s?`,    filter: (sh) => sh.color === c && sh.shape === s }),
];

export function generateQuestion(shapes) {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const q = QUESTION_TEMPLATES[0](color);
    return { ...q, answer: shapes.filter(q.filter).length };
  }

  if (type === 1) {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const q = QUESTION_TEMPLATES[1](shape);
    return { ...q, answer: shapes.filter(q.filter).length };
  }

  // Type 2 — color + shape combo. Re-pick if the answer would be 0 (poor UX:
  // the player memorises shapes only to find nothing matched).
  const MAX_ATTEMPTS = 20;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const q     = QUESTION_TEMPLATES[2](color, shape);
    const answer = shapes.filter(q.filter).length;
    if (answer > 0) return { ...q, answer };
  }

  // Fallback to type 0 if no non-zero combo found after MAX_ATTEMPTS
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const q = QUESTION_TEMPLATES[0](color);
  return { ...q, answer: shapes.filter(q.filter).length };
}

/**
 * @param {number} count      - number of shapes to generate
 * @param {number} boardWidth  - used for accurate x-axis bounds
 * @param {number} boardHeight - used for accurate y-axis bounds
 */
export function generateShapes(count = 7, boardWidth = 420, boardHeight = 630) {
  return Array.from({ length: count }, (_, i) => {
    const size = 28 + Math.random() * 18;
    return {
      id:    i,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      // Spawn within the board using actual dimensions so shapes never start OOB
      x:  size + Math.random() * (boardWidth  - size * 2),
      y:  size + Math.random() * (boardHeight - size * 2),
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      size,
    };
  });
}