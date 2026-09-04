import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Rasta Trinity
        "rasta-red": "#e01e1e",
        "rasta-gold": "#ffcc00",
        "rasta-green": "#107e3e",
        "deep-earth": "#0a0a0a",

        // Royal derivatives
        "royal-gold": "#f2d675",
        "royal-gold-deep": "#b88718",
        "royal-green": "#1e8a4b",
        "royal-red": "#a92d2d",
        "royal-ink": "#070807",

        // Legacy aliases used in existing components
        gold: "#B8860B",
        green: "#1A3A2A",
        black: "#111111",
      },
      fontFamily: {
        cinzel: ["Cinzel", "Georgia", "serif"],
        raleway: ["Raleway", "Calibri", "sans-serif"],
        georgia: ["Georgia", "serif"],
        calibri: ["Calibri", "sans-serif"],
        courier: ["Courier New", "monospace"],
      },
      boxShadow: {
        royal: "0 24px 70px rgba(0, 0, 0, 0.42)",
        "royal-glow": "0 0 48px rgba(242, 214, 117, 0.14)",
      },
      backgroundImage: {
        "rasta-gradient":
          "linear-gradient(to right, #107e3e, #ffcc00, #e01e1e)",
        "royal-panel":
          "linear-gradient(145deg, rgba(19, 23, 16, 0.94), rgba(15, 18, 13, 0.82))",
      },
      keyframes: {
        sacredRotate: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.3", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "0.6", transform: "translate(-50%, -50%) scale(1.1)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { transform: "translateX(-125%)" },
          to: { transform: "translateX(125%)" },
        },
      },
      animation: {
        "sacred-rotate": "sacredRotate 180s linear infinite",
        "glow-pulse": "glowPulse 8s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
        shimmer: "shimmer 0.65s ease",
      },
    },
  },
  plugins: [],
};

export default config;
