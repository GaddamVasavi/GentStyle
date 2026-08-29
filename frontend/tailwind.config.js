/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        luxury: {
          50: '#fbf9f6',
          100: '#f5f0e9',
          200: '#ebd9c6',
          300: '#dfbe9f',
          400: '#d19e73',
          500: '#c5834f',
          600: '#b76f41',
          700: '#985836',
          800: '#7a462e',
          900: '#643a29',
          950: '#361d14',
        },
        gold: {
          400: '#F2C94C',
          500: '#E0B838',
          600: '#C99E22',
        },
        gentblack: '#0D0F12',
        gentdark: '#16191E',
        gentcard: '#1F242C',
        gentborder: '#2C323D',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(197, 131, 79, 0.3)',
        'glow-gold': '0 0 25px -5px rgba(224, 184, 56, 0.35)',
      }
    },
  },
  plugins: [],
}
