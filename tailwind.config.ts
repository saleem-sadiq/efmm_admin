/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'
import tailwindcssAnimate from 'tailwindcss-animate'

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
      square: "square",
      roman: "upper-roman",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "360px",
        sm: "500px",
        md: "640px",
        lg: "768px",
        lg2: "850px",
        xl: "1024px",
        "2xl": "1280px",
        "3xl": "1430px",
        "4xl": "1920px",
        "5xl": "2200px",
      },
      fontSize: {
        70: "4.375rem", // 70px
        h1: "4rem", // 64px
        "56": "3.5rem", // 56pxF
        h2: "2.875rem", // 46px
        42: "2.625rem", // 42px
        36: "2.25rem", // 36px
        34: "2.125rem", // 34px
        32: "2rem", // 32px
        28: "1.75rem", // 28px
        26: "1.563rem", // 26px
        24: "1.5rem", // 24px
        22: "1.375rem", // 22px
        21: "1.313rem", // 21px
        18: "1.125rem", // 18px
        16: "1rem", // 16px
        14: "0.875rem", // 14px
        13: "0.813rem", // 13px
        11: "0.688rem", // 11px
      },
      backgroundImage: {
        "hero-img": "url('/assets/bg.svg')",
      },
      colors: {
        default: "#DA190D",
        default100: "#d3e3fd",
        whitefade: "#fff8eb",
        default500: "#2860E1",
        blackfade: "#141415",
        blackfade2: "#242528",
        grayfade: "#5D6470",
        grayfade2: "#A7B0C0",
        grayfade3: "#E7ECF3",
        textgrey: "#A4A5A5",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": 'fadeIn 0.4s ease-in-out',
      },
    },
  },
  plugins: [tailwindcssAnimate, typography]
};
