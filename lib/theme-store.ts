"use client";

import { create } from "zustand";

export type Theme = "dark" | "light";

export const defaultTheme: Theme = "dark";

/** Shared with the inline script in app/layout.tsx — keep the two in sync. */
export const THEME_STORAGE_KEY = "portfolio-theme";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function apply(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: defaultTheme,

  setTheme: (theme) => {
    set({ theme });
    apply(theme);
  },

  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));

/**
 * What the inline script already put on `<html>`. Read after mount so the
 * store agrees with the DOM instead of assuming the default.
 */
export function appliedTheme(): Theme {
  if (typeof document === "undefined") return defaultTheme;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export const useTheme = () => useThemeStore((s) => s.theme);
