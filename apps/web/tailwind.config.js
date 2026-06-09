/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void:    "#050d1a",
        surface: "#060e1c",
        panel:   "#070f1d",
        border:  "#0d2a3a",
        teal: {
          DEFAULT: "#1d9e75",
          light:   "#5dcaa5",
          dark:    "#0f6e56",
        },
        violet: {
          DEFAULT: "#534ab7",
          light:   "#afa9ec",
          dark:    "#26215c",
        },
        amber: {
          DEFAULT: "#ef9f27",
          dark:    "#854f0b",
        },
        muted:   "#7a9ab0",
        dim:     "#506070",
        faint:   "#354a58",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "float":      "float 6s ease-in-out infinite",
        "aurora":     "aurora 12s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        aurora: {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%":      { opacity: "0.6", transform: "scale(1.05)" },
        },
      },
      backgroundImage: {
        "void-gradient": "radial-gradient(ellipse at 20% 50%, #0f2a1e22 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #26215c22 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};
