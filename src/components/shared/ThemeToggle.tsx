"use client";

import { useTheme } from "@/src/providers/ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  const classes = `rounded-full border px-3 py-2 transition ${isLight ? 'border-slate-300 bg-white text-slate-900 hover:bg-slate-50' : 'border-white/25 bg-white/10 text-white hover:bg-white/20'}`;

  return (
    <button onClick={toggleTheme} className={classes} aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}>
      {isLight ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;
