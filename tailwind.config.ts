import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        wedding: {
          champagne: {
            50: "#FAF7F2",
            100: "#F5EFE6",
            200: "#EADCC9",
            300: "#DFC5A8",
            400: "#CEAA81",
            500: "#B88E5B",
            600: "#997343",
            700: "#7A5B33",
            800: "#5D4426",
            900: "#3E2D1A",
          },
          rose: {
            50: "#FDF8F7",
            100: "#F9EEEC",
            200: "#F3DDD8",
            300: "#E7BEB5",
            400: "#D8998D",
            500: "#C67667",
            600: "#AA5647",
            700: "#8B4134",
            800: "#6B3127",
            900: "#4D211A",
          },
          sage: {
            50: "#F6F8F5",
            100: "#EDF2EA",
            200: "#D9E3D4",
            300: "#BDCDB7",
            400: "#9AB291",
            500: "#79966F",
            600: "#5F7856",
            700: "#495D43",
            800: "#354431",
            900: "#222C20",
          },
          burgundy: {
            50: "#FAF4F5",
            100: "#F4E5E7",
            200: "#E9CDD2",
            300: "#D6A3AC",
            400: "#BC6D7C",
            500: "#9E3C4E",
            600: "#802C3C",
            700: "#64202E",
            800: "#481621",
            900: "#300D15",
          },
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        display: ["var(--font-playfair)", "serif"],
        script: ["var(--font-greatvibes)", "cursive"],
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "spin-slow": "spin 12s linear infinite",
        "shimmer": "shimmer 2.5s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.88", transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
