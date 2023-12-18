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
      dark: {
        0: "#C9C9C9",
        1: "#B8B8B8",
        2: "#828282",
        3: "#696969",
        4: "#424242",
        5: "#3B3B3B",
        6: "#2E2E2E",
        7: "#242424",
        8: "#1F1F1F",
        9: "#141414",
      },
      primary: {
        100: "#001141",
        200: "#001d6c",
        300: "#002d9c",
        400: "#0043ce",
        500: "#0f62fe",
        600: "#4589ff",
        700: "#78a9ff",
        800: "#a6c8ff",
        900: "#d0e2ff",
        950: "#edf5ff",
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
        100: "#2d0709",
        200: "#520408",
        300: "#750e13",
        400: "#a2191f",
        500: "#da1e28",
        600: "#fa4d56",
        700: "#ff8389",
        800: "#ffb3b8",
        900: "#ffd7d9",
        950: "#fff1f1",
      },
      warning: {
        100: "#ff832b",
        200: "#f1c21b",
      },
    },
  },
  plugins: [],
};
export default config;
