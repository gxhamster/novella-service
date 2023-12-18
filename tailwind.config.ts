import type { Config } from "tailwindcss";

const config: Config = {
  corePlugins: {
    preflight: false,
  },
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
    },
  },
  plugins: [],
};
export default config;
