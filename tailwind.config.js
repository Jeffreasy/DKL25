/** @type {import('tailwindcss').Config} */
export default {
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
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide': 'slide 15s linear infinite',
        'slide-reverse': 'slide 15s linear infinite reverse',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slide: {
          '0%': { transform: 'translateX(-100%) rotate(-45deg)' },
          '100%': { transform: 'translateX(100%) rotate(-45deg)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [
    // @ts-ignore
    import('@tailwindcss/forms'),
    // @ts-ignore
    import('@tailwindcss/typography'),
    // @ts-ignore
    import('@tailwindcss/aspect-ratio'),
    // @ts-ignore
    import('tailwind-scrollbar-hide')
  ],
} 