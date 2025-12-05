/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#0b0c10',
        'silver': '#c5c6c7',
        'neon': '#66fcf1',
        'alert': '#8b0000',
        'glass': 'rgba(31, 40, 51, 0.7)',
      },
      fontFamily: {
        'military': ['"Black Ops One"', 'cursive'],
        'tactical': ['"Share Tech Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f2833 1px, transparent 1px), linear-gradient(to bottom, #1f2833 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
