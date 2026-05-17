/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'Geist Mono'", "monospace"],
      },
      colors: {
        ghost: {
          bg:       "#0a0a0f",
          surface:  "#111118",
          surface2: "#1a1a24",
          accent:   "#7c6dfa",
          text:     "#f0eeff",
          muted:    "#9b96c4",
          dim:      "#5a5580",
          danger:   "#fa6d6d",
          success:  "#6dfaaa",
        },
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        pulse2:  { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-8px)" }, to: { opacity: "1", transform: "translateX(0)" } },
      },
      animation: {
        "fade-up":  "fadeUp 0.4s ease both",
        "fade-in":  "fadeIn 0.3s ease both",
        "pulse2":   "pulse2 2s ease infinite",
        "slide-in": "slideIn 0.3s ease both",
      },
    },
  },
  plugins: [],
}