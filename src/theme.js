// Design tokens: brand colors and gradients used across the app.
// Values are CSS variables so the whole app can switch between
// Light / Dark / Coffee mode (see index.css + themeStore.jsx)
// without touching every component that imports COLORS.
const COLORS = {
  bg: "var(--color-bg)",
  card: "var(--color-card)",
  cardAlt: "var(--color-card-alt)",
  cardBorder: "var(--color-card-border)",
  navBg: "var(--color-nav-bg)",
  text: "var(--color-text)",
  textDim: "var(--color-text-dim)",
  red: "#ff0421",
  redDark: "#c9031a",
  redSoft: "rgba(255,4,33,0.08)",
  redSoft2: "rgba(255,4,33,0.14)",
  // LexCase product accent — orange (overridable via --lc-orange* vars,
  // e.g. by .lexcase-retro in index.css — falls back to the same
  // hardcoded orange everywhere else, so nothing else changes).
  orange: "var(--lc-orange, #f97316)",
  orangeDark: "var(--lc-orange-dark, #c2410c)",
  orangeSoft: "var(--lc-orange-soft, rgba(249,115,22,0.10))",
  orangeSoft2: "var(--lc-orange-soft2, rgba(249,115,22,0.18))",
  // AccounTrack product accent — blue
  blue: "#0ea5e9",
  blueDark: "#0369a1",
  blueSoft: "rgba(14,165,233,0.10)",
  blueSoft2: "rgba(14,165,233,0.18)",
  // TaxPlan Pro product accent — green
  green: "#16a34a",
  greenDark: "#15803d",
  greenSoft: "rgba(22,163,74,0.10)",
  greenSoft2: "rgba(22,163,74,0.18)",
  // FinInsight product accent — purple
  purple: "#8b5cf6",
  purpleDark: "#6d28d9",
  purpleSoft: "rgba(139,92,246,0.10)",
  purpleSoft2: "rgba(139,92,246,0.18)",
  // LINE brand accent
  line: "#06c755",
  lineDark: "#05a648",
  lineSoft: "rgba(6,199,85,0.10)",
  lineSoft2: "rgba(6,199,85,0.18)",
};

const GRADIENT_BRAND = `linear-gradient(135deg, ${COLORS.red}, ${COLORS.redDark})`;
const GRADIENT_ORANGE = `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`;
const GRADIENT_BLUE = `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`;
const GRADIENT_GREEN = `linear-gradient(135deg, ${COLORS.green}, ${COLORS.greenDark})`;
const GRADIENT_PURPLE = `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.purpleDark})`;
const GRADIENT_LINE = `linear-gradient(135deg, ${COLORS.line}, ${COLORS.lineDark})`;

// ---------------------------------------------
// Global keyframes for subtle, tasteful motion
// ---------------------------------------------

export {
  COLORS,
  GRADIENT_BRAND,
  GRADIENT_ORANGE,
  GRADIENT_BLUE,
  GRADIENT_GREEN,
  GRADIENT_PURPLE,
  GRADIENT_LINE,
};
