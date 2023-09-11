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
      success: {
        100: "#071908",
        200: "#022d0d",
        300: "#044317",
        400: "#0e6027",
        500: "#198038",
        600: "#24a148",
        700: "#42be65",
        800: "#6fdc8c",
        900: "#a7f0ba",
        950: "#defbe6",
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
