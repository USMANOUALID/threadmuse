import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"], // not used by ThreadMuse — kept off; no dark mode per brand
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // ThreadMuse warm-pink "blush" palette. All consumed via CSS vars so we
        // can re-theme without recompiling Tailwind.
        bg:       "hsl(var(--bg) / <alpha-value>)",
        surface:  "hsl(var(--surface) / <alpha-value>)",
        sand:     "hsl(var(--sand) / <alpha-value>)",
        warm:     "hsl(var(--warm) / <alpha-value>)",
        ink:      "hsl(var(--ink) / <alpha-value>)",
        muted:    "hsl(var(--muted) / <alpha-value>)",
        line:     "hsl(var(--line) / <alpha-value>)",
        accent:   "hsl(var(--accent) / <alpha-value>)",
        "accent-2": "hsl(var(--accent-2) / <alpha-value>)",
        soft:     "hsl(var(--soft) / <alpha-value>)",

        // shadcn-compatible aliases (used by Button/Badge primitives).
        background: "hsl(var(--bg) / <alpha-value>)",
        foreground: "hsl(var(--ink) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          foreground: "hsl(var(--bg) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--warm) / <alpha-value>)",
          foreground: "hsl(var(--ink) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(0 70% 55% / <alpha-value>)",
          foreground: "hsl(0 0% 100% / <alpha-value>)",
        },
        border: "hsl(var(--line) / <alpha-value>)",
        input:  "hsl(var(--line) / <alpha-value>)",
        ring:   "hsl(var(--ink) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Tighter heading scale for boutique editorial feel.
        "display-lg": ["clamp(2.5rem, 5vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display":    ["clamp(2rem, 4vw, 3.5rem)",    { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "h1":         ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1",  letterSpacing: "-0.025em" }],
        "h2":         ["1.5rem",                       { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "h3":         ["1.125rem",                     { lineHeight: "1.25", letterSpacing: "-0.015em" }],
      },
      borderRadius: {
        xs: "0.375rem",
        sm: "0.5rem",
        DEFAULT: "0.625rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft:  "0 1px 2px hsl(30 18% 18% / 0.04), 0 6px 18px hsl(30 18% 18% / 0.06)",
        lift:  "0 6px 18px hsl(30 18% 18% / 0.08), 0 24px 48px hsl(30 18% 18% / 0.10)",
        cta:   "0 4px 14px hsl(30 18% 18% / 0.18)",
        inner: "inset 0 0 0 1px hsl(var(--line))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: { "50%": { opacity: "0" } },
      },
      animation: {
        "fade-up": "fade-up 0.4s cubic-bezier(0.2, 0.7, 0.3, 1) both",
        blink: "blink 1s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
