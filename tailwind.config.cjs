const forms = require('@tailwindcss/forms')
const typography = require('@tailwindcss/typography')
const aspectRatio = require('@tailwindcss/aspect-ratio')
const scrollbarHide = require('tailwind-scrollbar-hide')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff9328',
          dark: '#e67f1c',
          light: '#ffad5c',
        },
      },
      // ... rest of your theme config
    },
  },
  plugins: [
    forms,
    typography,
    aspectRatio,
    scrollbarHide
  ],
} 