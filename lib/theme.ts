"use client";

export type ThemeChoice = "system" | "light" | "dark";
const KEY = "sums_theme";

export function getTheme(): ThemeChoice {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(choice: ThemeChoice = getTheme()) {
  const dark = choice === "dark" || (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function setTheme(choice: ThemeChoice) {
  try {
    if (choice === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, choice);
  } catch {}
  applyTheme(choice);
  window.dispatchEvent(new CustomEvent("sums:theme", { detail: choice }));
}
