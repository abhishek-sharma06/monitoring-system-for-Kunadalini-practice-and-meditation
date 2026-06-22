/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#FAFAF9",   // warm white
          secondary: "#F3F0FF"  // soft lavender
        },
        accent: {
          primary: "#6B4FA0",   // deep purple
          secondary: "#2D9596"  // deep teal
        },
        text: {
          primary: "#1A1A2E",   // near black
          secondary: "#6B7280"  // soft grey
        },
        success: "#4CAF87",     // soft green
        border: "#E5E1F5",       // light lavender border
        card: "#FFFFFF"
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"]
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem"
      },
      boxShadow: {
        sm: "0 2px 8px rgba(229, 225, 245, 0.5)",
        md: "0 4px 16px rgba(107, 79, 160, 0.08)"
      }
    },
  },
  plugins: [],
}
