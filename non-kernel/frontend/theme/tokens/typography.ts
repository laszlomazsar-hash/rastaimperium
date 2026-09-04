/**
 * Rasta Royal — Typography Tokens
 * Cinzel = mythic / ceremonial headings
 * Raleway = operational body & UI
 * Courier New = evidence, hashes, telemetry
 */
export const typography = {
  family: {
    display: "'Cinzel', Georgia, serif",
    body: "'Raleway', Calibri, sans-serif",
    mono: "'Courier New', monospace",
  },
  size: {
    xs: "0.75rem",
    sm: "0.8rem",
    md: "0.85rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.55rem",
    "2xl": "1.75rem",
    "3xl": "2.25rem",
    "4xl": "2.75rem",
    "5xl": "3.5rem",
  },
  weight: {
    light: 300,
    regular: 400,
    semibold: 600,
    bold: 700,
  },
  tracking: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.08em",
    micro: "0.14em",
  },
} as const;
