/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        border: "var(--color-border)", /* coffee brown 20% */
        input: "var(--color-input)", /* coffee-stained white */
        ring: "var(--color-ring)", /* golden brass */
        background: "var(--color-background)", /* aged paper cream */
        foreground: "var(--color-foreground)", /* deep espresso */
        primary: {
          DEFAULT: "var(--color-primary)", /* rich coffee brown */
          foreground: "var(--color-primary-foreground)", /* white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* warm tan */
          foreground: "var(--color-secondary-foreground)", /* deep espresso */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* muted terracotta */
          foreground: "var(--color-destructive-foreground)", /* white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* warm tan */
          foreground: "var(--color-muted-foreground)", /* medium roast brown */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* golden brass */
          foreground: "var(--color-accent-foreground)", /* deep espresso */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* coffee-stained white */
          foreground: "var(--color-popover-foreground)", /* deep espresso */
        },
        card: {
          DEFAULT: "var(--color-card)", /* coffee-stained white */
          foreground: "var(--color-card-foreground)", /* deep espresso */
        },
        success: {
          DEFAULT: "var(--color-success)", /* fresh mint green */
          foreground: "var(--color-success-foreground)", /* white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* warm amber */
          foreground: "var(--color-warning-foreground)", /* deep espresso */
        },
        error: {
          DEFAULT: "var(--color-error)", /* muted terracotta */
          foreground: "var(--color-error-foreground)", /* white */
        },
        coffee: {
          dark: "var(--color-coffee-dark)", /* dark coffee */
          medium: "var(--color-coffee-medium)", /* medium roast brown */
        },
        gold: "var(--color-gold)", /* warm gold */
        cream: "var(--color-cream)", /* warm cornsilk */
        slate: "var(--color-slate)", /* deep slate gray */
        peru: "var(--color-peru)", /* warm peru */
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        headline: ['Crimson Text', 'serif'],
        body: ['Source Serif 4', 'serif'],
        cta: ['Alegreya Sans', 'sans-serif'],
        handwritten: ['Amatic SC', 'cursive'],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "steam-rise": {
          "0%": { opacity: "0.3", transform: "translateY(0) scale(1)" },
          "50%": { opacity: "0.6", transform: "translateY(-10px) scale(1.05)" },
          "100%": { opacity: "0", transform: "translateY(-20px) scale(1.1)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "steam-rise": "steam-rise 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        'warm': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}