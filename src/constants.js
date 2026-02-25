export const SHAPES = ["circle", "triangle", "rectangle"];
export const COLORS = ["red", "black", "brown", "blue"];

export const BOARD_RATIO = 1.5; // height = 1.5 * width
export const TOTAL_TIME = 45;
export const STREAK_BONUS = 7;
export const STREAK_NEEDED = 4;

// Used in the legend dots — the only place hex is still needed
// (Tailwind can't generate dynamic bg colors from arbitrary strings)
export const COLOR_HEX = {
  red: "#e53e3e",
  black: "#1a1a1a",
  brown: "#8b4513",
  blue: "#2b6cb0",
};