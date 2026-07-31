import { createContext, useContext, useEffect, useState, useCallback } from "react";

// ---------------------------------------------
// Theme mode: light | dark | coffee
// Persisted in localStorage, applied via a
// data-theme attribute so plain CSS variables
// (referenced from theme.js COLORS) cascade
// through every inline style automatically —
// no need to touch each page/component.
// ---------------------------------------------

const THEME_KEY = "obficebase_theme";
const THEMES = [
  { key: "light", label: "สว่าง" },
  { key: "dark", label: "มืด" },
  { key: "coffee", label: "กาแฟ" },
  { key: "matcha", label: "มัทฉะ" },
  { key: "space", label: "อวกาศ" },
];

function loadTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw && THEMES.some((t) => t.key === raw)) return raw;
  } catch {
    // ignore
  }
  return "light";
}

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => loadTheme());

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, mode);
    } catch {
      // ignore storage errors
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", mode);
    }
  }, [mode]);

  const cycleTheme = useCallback(() => {
    setMode((current) => {
      const idx = THEMES.findIndex((t) => t.key === current);
      return THEMES[(idx + 1) % THEMES.length].key;
    });
  }, []);

  const value = { mode, setMode, cycleTheme, themes: THEMES };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within a ThemeProvider");
  return ctx;
}

export { ThemeProvider, useThemeMode, THEMES };
