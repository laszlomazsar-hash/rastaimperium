/**
 * Rasta Royal — Color Tokens
 * Design philosophy: dignified, ceremonial, evidence-led.
 * Primary palette is the Rasta Trinity; Royal derivatives support institutional UI.
 */
export const color = {
  // Rasta Trinity
  rasta: {
    red: "#e01e1e",
    gold: "#ffcc00",
    green: "#107e3e",
  },

  // Deep canvas
  deepEarth: "#0a0a0a",
  royalInk: "#070807",

  // Royal derivatives
  royal: {
    gold: "#f2d675",
    goldDeep: "#b88718",
    green: "#1e8a4b",
    red: "#a92d2d",
    line: "rgba(242, 214, 117, 0.24)",
    panel: "rgba(15, 18, 13, 0.82)",
    panelStrong: "rgba(19, 23, 16, 0.94)",
    shadow: "0 24px 70px rgba(0, 0, 0, 0.42)",
  },

  // Legacy / utility aliases used across components
  gold: "#B8860B",
  goldSovereign: "#B8860B",

  // Evidence / status semantic colors (match ProvenanceBadge)
  status: {
    verified: {
      border: "rgba(16, 185, 129, 0.5)",
      bg: "rgba(6, 78, 59, 0.4)",
      text: "#6ee7b7",
    },
    demonstration: {
      border: "rgba(245, 158, 11, 0.4)",
      bg: "rgba(69, 26, 3, 0.3)",
      text: "#fde68a",
    },
    historical: {
      border: "rgba(14, 165, 233, 0.4)",
      bg: "rgba(12, 74, 110, 0.3)",
      text: "#7dd3fc",
    },
    target: {
      border: "rgba(139, 92, 246, 0.4)",
      bg: "rgba(46, 16, 101, 0.3)",
      text: "#c4b5fd",
    },
    unavailable: {
      border: "#52525b",
      bg: "rgba(24, 24, 27, 0.6)",
      text: "#a1a1aa",
    },
  },
} as const;
