/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic Names (New - Light/Modern Theme)
        wood: "#2a1b12", // Dark Brown (for text/accents)
        "wood-light": "#4a3022", // Medium Brown
        parchment: "#f8f4e3", // Very Light Paper (Main BG)
        "parchment-dark": "#e3dcc2", // Darker Paper (Cards/Secondary)
        ink: "#1a120b", // Almost Black (Main Text)
        gold: "#c5a059", // Muted Gold (Modern)
        "gold-light": "#e5c07b",
        crimson: "#8b0000",

        // Legacy Mappings (for smooth migration)
        void: "#2a1b12", // Updated to new wood
        silver: "#d4c5a9", 
        neon: "#c5a059", 
        alert: "#8b0000", 
        glass: "rgba(42, 27, 18, 0.8)", // Updated to new wood
      },
      fontFamily: {
        // New Fonts
        medieval: ['"Cinzel"', "serif"],
        sans: ['"Lato"', "sans-serif"],

        // Legacy Mappings
        military: ['"Cinzel"', "serif"], // Was Black Ops One
        tactical: ['"Lato"', "sans-serif"], // Was Share Tech Mono
      },
      backgroundImage: {
        "grid-pattern": "none", // Remove sci-fi grid
        "paper-texture":
          "url('https://www.transparenttextures.com/patterns/aged-paper.png')", // Placeholder for texture
      },
    },
  },
  plugins: [],
};
