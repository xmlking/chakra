export const NodeEnv = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  TEST: "test",
} as const;

export const ThemeMode = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
} as const;

export const ThemeColor = {
  ORANGE: "orange",
  ROSE: "rose",
  RED: "red",
  YELLOW: "yellow",
  GRAY: "gray",
  STONE: "stone",
  GREEN: "green",
  BLUE: "blue",
  VIOLET: "violet",
} as const;

export type ThemeColor = (typeof ThemeColor)[keyof typeof ThemeColor];
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];
export interface ThemeConfig {
  mode: ThemeMode;
  color: ThemeColor;
}
