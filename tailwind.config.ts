import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(230 24% 8%)",
        foreground: "hsl(0 0% 98%)",
        border: "hsl(230 16% 18%)",
        primary: {
          DEFAULT: "hsl(201 100% 56%)",
          foreground: "hsl(0 0% 100%)"
        },
        secondary: {
          DEFAULT: "hsl(235 20% 16%)",
          foreground: "hsl(0 0% 98%)"
        },
        muted: {
          DEFAULT: "hsl(231 18% 13%)",
          foreground: "hsl(220 12% 75%)"
        },
        accent: {
          DEFAULT: "hsl(268 79% 62%)",
          foreground: "hsl(0 0% 100%)"
        },
        success: "hsl(142 71% 45%)",
        warning: "hsl(38 92% 50%)",
        danger: "hsl(0 84% 60%)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.3)"
      },
      backgroundImage: {
        radial:
          "radial-gradient(circle at top, rgba(14,165,233,0.18), transparent 35%), radial-gradient(circle at right, rgba(168,85,247,0.18), transparent 30%)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
