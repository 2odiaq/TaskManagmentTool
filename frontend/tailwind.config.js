/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6ecf5",
          100: "#ccd9eb",
          200: "#99b3d7",
          300: "#668ec3",
          400: "#3369af",
          500: "#3B82F6",
          600: "#193c7a",
          700: "#132d5c",
          800: "#0d1e3d",
          900: "#060f1f",
        },
        accent: {
          50: "#fff8e6",
          100: "#ffefc0",
          200: "#ffe499",
          300: "#ffd966",
          400: "#ffcb33",
          500: "#10B981",
          600: "#cc9600",
          700: "#997100",
          800: "#664b00",
          900: "#332600",
        },
        gray: {
          50: "#F9FAFB",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6B7280",
          600: "#666666",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#EF4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        yellow: {
          500: "#F59E0B",
        },
        // Status colors
        status: {
          todo: "#F7F9FB",
          "in-progress": "#b794f4",
          done: "#10b981",
        },
        // Priority colors
        priority: {
          low: "#3B82F6",
          medium: "#F59E0B",
          high: "#EF4444",
        },
        // Brand colors
        brand: {
          blue: "#3B82F6",
          lightBlue: "#6366f1",
          red: "#EF4444",
          green: "#10B981",
          yellow: "#F59E0B",
          purple: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        title: "1.25rem",
        subtitle: "1rem",
        body: "0.875rem",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-in-out",
        slideIn: "slideIn 0.3s ease-in-out",
        slideUp: "slideUp 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        sidebar:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      spacing: {
        4.5: "1.125rem",
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
  ],
};
