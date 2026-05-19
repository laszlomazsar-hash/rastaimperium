import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#B8860B",
        green: "#1A3A2A",
        black: "#111111",
      },
      fontFamily: {
        georgia: ["Georgia", "serif"],
        calibri: ["Calibri", "sans-serif"],
        courier: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
