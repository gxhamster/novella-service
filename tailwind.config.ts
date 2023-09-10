import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
    colors: {
      // Primary Color: #01aaff
      // Refer: https://www.ibm.com/design/language/color
      primary: {
        100: "#1e425e",
        200: "#216391",
        300: "#1c85c6",
        400: "#01aaff",
        500: "#4bb3ff",
        600: "#6cbcff",
        700: "#86c6ff",
        800: "#9dcfff",
        900: "#b2d8ff",
      },
      surface: {
        100: "#161616",
        200: "#262626",
        300: "#393939",
        400: "#525252",
        500: "#6f6f6f",
        600: "#8d8d8d",
        700: "#a8a8a8",
        800: "#c6c6c6",
        900: "#e0e0e0",
        950: "#f4f4f4",
      },
      white: "#ffffff",
      black: {
        100: "#080808",
        200: "#0f0f0f",
        300: "#141414",
        400: "#191919",
        500: "#1d1d1d",
        600: "#222222",
        700: "#262626",
      },
      alert: {
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
        950: "#450a0a",
      },
    },
  },
  plugins: [],
};
export default config;
