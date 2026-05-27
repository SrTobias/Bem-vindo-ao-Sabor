export type ThemeId = "warm-sand" | "ocean" | "forest" | "midnight" | "rose";

export interface Theme {
  id: ThemeId;
  name: string;
  swatch: string[];
  vars: Record<string, string>;
}

export const THEMES: Theme[] = [
  {
    id: "warm-sand",
    name: "Areia Quente",
    swatch: ["#faf8f5", "#c9b99a", "#8b7355", "#2d2d2d"],
    vars: {
      "--background": "oklch(0.985 0.008 80)",
      "--foreground": "oklch(0.28 0.025 60)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.28 0.025 60)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.28 0.025 60)",
      "--primary": "oklch(0.49 0.04 60)",
      "--primary-foreground": "oklch(0.985 0.008 80)",
      "--secondary": "oklch(0.94 0.015 80)",
      "--secondary-foreground": "oklch(0.35 0.03 60)",
      "--muted": "oklch(0.94 0.015 80)",
      "--muted-foreground": "oklch(0.5 0.025 60)",
      "--accent": "oklch(0.78 0.04 80)",
      "--accent-foreground": "oklch(0.28 0.025 60)",
      "--border": "oklch(0.88 0.018 80)",
      "--input": "oklch(0.88 0.018 80)",
      "--ring": "oklch(0.49 0.04 60)",
    },
  },
  {
    id: "ocean",
    name: "Oceano",
    swatch: ["#e8f0f8", "#5cbdb9", "#1a4a6e", "#0c2340"],
    vars: {
      "--background": "oklch(0.97 0.015 230)",
      "--foreground": "oklch(0.22 0.04 240)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.22 0.04 240)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.22 0.04 240)",
      "--primary": "oklch(0.45 0.09 235)",
      "--primary-foreground": "oklch(0.98 0.01 230)",
      "--secondary": "oklch(0.92 0.025 220)",
      "--secondary-foreground": "oklch(0.28 0.05 240)",
      "--muted": "oklch(0.92 0.025 220)",
      "--muted-foreground": "oklch(0.5 0.03 230)",
      "--accent": "oklch(0.75 0.09 195)",
      "--accent-foreground": "oklch(0.22 0.04 240)",
      "--border": "oklch(0.86 0.025 220)",
      "--input": "oklch(0.86 0.025 220)",
      "--ring": "oklch(0.45 0.09 235)",
    },
  },
  {
    id: "forest",
    name: "Floresta",
    swatch: ["#f5f0e8", "#a8c0a0", "#2d5a3d", "#1a3c2a"],
    vars: {
      "--background": "oklch(0.96 0.015 95)",
      "--foreground": "oklch(0.25 0.04 145)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.25 0.04 145)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.25 0.04 145)",
      "--primary": "oklch(0.42 0.08 145)",
      "--primary-foreground": "oklch(0.97 0.015 95)",
      "--secondary": "oklch(0.92 0.025 110)",
      "--secondary-foreground": "oklch(0.3 0.05 145)",
      "--muted": "oklch(0.92 0.025 110)",
      "--muted-foreground": "oklch(0.5 0.03 130)",
      "--accent": "oklch(0.78 0.06 140)",
      "--accent-foreground": "oklch(0.25 0.04 145)",
      "--border": "oklch(0.86 0.025 110)",
      "--input": "oklch(0.86 0.025 110)",
      "--ring": "oklch(0.42 0.08 145)",
    },
  },
  {
    id: "midnight",
    name: "Meia-Noite",
    swatch: ["#0a0a1a", "#1e1e5a", "#4f46e5", "#e8ecf1"],
    vars: {
      "--background": "oklch(0.16 0.03 270)",
      "--foreground": "oklch(0.95 0.015 270)",
      "--card": "oklch(0.22 0.04 270)",
      "--card-foreground": "oklch(0.95 0.015 270)",
      "--popover": "oklch(0.22 0.04 270)",
      "--popover-foreground": "oklch(0.95 0.015 270)",
      "--primary": "oklch(0.6 0.2 275)",
      "--primary-foreground": "oklch(0.98 0.01 270)",
      "--secondary": "oklch(0.28 0.05 270)",
      "--secondary-foreground": "oklch(0.95 0.015 270)",
      "--muted": "oklch(0.28 0.05 270)",
      "--muted-foreground": "oklch(0.72 0.03 270)",
      "--accent": "oklch(0.5 0.15 280)",
      "--accent-foreground": "oklch(0.98 0.01 270)",
      "--border": "oklch(0.32 0.05 270)",
      "--input": "oklch(0.32 0.05 270)",
      "--ring": "oklch(0.6 0.2 275)",
    },
  },
  {
    id: "rose",
    name: "Rosa Suave",
    swatch: ["#f8e8ee", "#e8c5d0", "#c9a0dc", "#9b72cf"],
    vars: {
      "--background": "oklch(0.97 0.015 350)",
      "--foreground": "oklch(0.3 0.05 320)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.3 0.05 320)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.3 0.05 320)",
      "--primary": "oklch(0.58 0.15 310)",
      "--primary-foreground": "oklch(0.98 0.01 350)",
      "--secondary": "oklch(0.93 0.03 340)",
      "--secondary-foreground": "oklch(0.35 0.06 320)",
      "--muted": "oklch(0.93 0.03 340)",
      "--muted-foreground": "oklch(0.52 0.04 330)",
      "--accent": "oklch(0.78 0.09 320)",
      "--accent-foreground": "oklch(0.3 0.05 320)",
      "--border": "oklch(0.88 0.03 340)",
      "--input": "oklch(0.88 0.03 340)",
      "--ring": "oklch(0.58 0.15 310)",
    },
  },
];

const STORAGE_KEY = "sabor-theme";

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "warm-sand";
  return (localStorage.getItem(STORAGE_KEY) as ThemeId) || "warm-sand";
}

export function applyTheme(id: ThemeId) {
  if (typeof window === "undefined") return;
  const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  localStorage.setItem(STORAGE_KEY, theme.id);
}
