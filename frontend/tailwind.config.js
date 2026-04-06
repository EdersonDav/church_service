/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // Slate 900 (Midnight)
        surface: '#1E293B',    // Slate 800
        surfaceAlt: '#334155', // Slate 700 
        primary: '#6366F1',    // Indigo 500 (Vibrant Brand)
        primaryHover: '#4F46E5', // Indigo 600
        secondary: '#A855F7',  // Purple 500
        textBase: '#F8FAFC',   // Slate 50
        textMuted: '#94A3B8',  // Slate 400
        accent: '#38BDF8',     // Light Blue 400
        danger: '#EF4444',     // Red 500
        success: '#10B981',    // Emerald 500
      },
      fontFamily: {
        // Reservado para custom fonts
      }
    },
  },
  plugins: [],
}
