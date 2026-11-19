/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F5EF",
        beige: "#E9E3D8",
        green: {
          DEFAULT: "#2E4238",
          dark: "#223029",
          light: "#405B4C",
        },
        sage: "#7E9183",
        terracotta: {
          DEFAULT: "#B9703F",
          light: "#C58E78",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
