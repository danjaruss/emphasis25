import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Project EMPHASIS Brand Colors
        emphasis: {
          "light-blue": "#ACD7EC",
          mint: "#d0fff6",
          teal: "#22504f",
          navy: "#272f51",
          "light-green": "#CDE7B0",
          "off-white": "#F7FFF7",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#272f51", // EMPHASIS Navy
          foreground: "#F7FFF7", // EMPHASIS Off-white
        },
        secondary: {
          DEFAULT: "#22504f", // EMPHASIS Teal
          foreground: "#F7FFF7", // EMPHASIS Off-white
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#d0fff6", // EMPHASIS Mint
          foreground: "#22504f", // EMPHASIS Teal
        },
        accent: {
          DEFAULT: "#CDE7B0", // EMPHASIS Light Green
          foreground: "#272f51", // EMPHASIS Navy
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Chart colors using EMPHASIS palette
        chart: {
          "1": "#272f51", // Navy
          "2": "#22504f", // Teal
          "3": "#ACD7EC", // Light Blue
          "4": "#CDE7B0", // Light Green
          "5": "#d0fff6", // Mint
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
