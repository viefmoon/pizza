const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#E8E8E8",
  neutral300: "#D1D1D1",
  neutral400: "#E0E0E0",
  neutral500: "#C0C0C0",
  neutral600: "#808080",
  neutral700: "#404040",
  neutral800: "#202020",
  neutral900: "#000000",

  primary100: "#E8F5E9",
  primary200: "#C8E6C9",
  primary300: "#A5D6A7",
  primary400: "#81C784",
  primary500: "#66BB6A",
  primary600: "#4CAF50",

  secondary100: "#E8F4FD",
  secondary200: "#BBDEFB",
  secondary300: "#90CAF9",
  secondary400: "#64B5F6",
  secondary500: "#42A5F5",

  accent100: "#E0F7FA",
  accent200: "#B2EBF2",
  accent300: "#80DEEA",
  accent400: "#4DD0E1",
  accent500: "#26C6DA",

  angry100: "#FFEBEE",
  angry500: "#F44336",

  overlay20: "rgba(32, 32, 32, 0.2)",
  overlay50: "rgba(32, 32, 32, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral300,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
} as const
