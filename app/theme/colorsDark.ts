const palette = {
  neutral900: "#FFFFFF",
  neutral800: "#F9F9F9",
  neutral700: "#F0F0F0",
  neutral600: "#E0E0E0",
  neutral500: "#C0C0C0",
  neutral400: "#808080",
  neutral300: "#2D2D2D",
  neutral200: "#1A1A1A",
  neutral100: "#000000",

  primary600: "#E8F5E9",
  primary500: "#C8E6C9",
  primary400: "#A5D6A7",
  primary300: "#81C784",
  primary200: "#66BB6A",
  primary100: "#4CAF50",

  secondary500: "#E8F4FD",
  secondary400: "#BBDEFB",
  secondary300: "#90CAF9",
  secondary200: "#64B5F6",
  secondary100: "#42A5F5",

  accent500: "#E0F7FA",
  accent400: "#B2EBF2",
  accent300: "#80DEEA",
  accent200: "#4DD0E1",
  accent100: "#26C6DA",

  angry100: "#FFEBEE",
  angry500: "#F44336",

  overlay20: "rgba(255, 255, 255, 0.2)",
  overlay50: "rgba(255, 255, 255, 0.5)",
} as const

export const colors = {
  palette,
  transparent: "rgba(0, 0, 0, 0)",
  text: palette.neutral800,
  textDim: palette.neutral600,
  background: palette.neutral200,
  border: palette.neutral400,
  tint: palette.primary500,
  tintInactive: palette.neutral300,
  separator: palette.neutral300,
  error: palette.angry500,
  errorBackground: palette.angry100,
} as const
