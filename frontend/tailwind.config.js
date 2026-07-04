/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(16, 24, 40, 0.08), 0 4px 16px -4px rgba(16, 24, 40, 0.08)",
        card: "0 1px 3px rgba(16, 24, 40, 0.06), 0 12px 32px -12px rgba(16, 24, 40, 0.14)",
        glow: "0 10px 30px -10px rgba(79, 70, 229, 0.5)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
        "mesh":
          "radial-gradient(at 0% 0%, rgba(99,102,241,0.14) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(217,70,239,0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139,92,246,0.12) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(56,189,248,0.10) 0px, transparent 50%)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
