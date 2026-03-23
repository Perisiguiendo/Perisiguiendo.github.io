/** Theme style presets */
export const THEMES = ["minimal", "cyberpunk", "literary"] as const;
export type Theme = (typeof THEMES)[number];
export type Mode = "light" | "dark";

export const THEME_LABELS: Record<Theme, string> = {
  minimal: "极简现代",
  cyberpunk: "赛博朋克",
  literary: "文艺清新",
};

/** Read stored preferences or fall back to defaults */
export function getStoredTheme(): Theme {
  if (typeof localStorage === "undefined") return "minimal";
  return (localStorage.getItem("theme") as Theme) || "minimal";
}

export function getStoredMode(): Mode {
  if (typeof localStorage === "undefined") return "light";
  const stored = localStorage.getItem("mode") as Mode | null;
  if (stored) return stored;
  if (
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function applyTheme(theme: Theme, mode: Mode) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-mode", mode);
  localStorage.setItem("theme", theme);
  localStorage.setItem("mode", mode);
}
