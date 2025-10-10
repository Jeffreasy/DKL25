import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import scrollbarHide from 'tailwind-scrollbar-hide'

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
        social: {
          facebook: '#1877F2',
          instagram: '#E4405F',
          youtube: '#FF0000',
          linkedin: '#0A66C2',
        },
      },
      animation: {
        'slideIn': 'slideIn 0.3s ease-out',
        'shine': 'shine 3s infinite',
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide': 'slide 15s linear infinite',
        'slide-reverse': 'slide 15s linear infinite reverse',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'spin-slow': 'rotate 20s linear infinite',
        'hue-rotate': 'hue-rotate 10s linear infinite',
        'slide-in': 'slideInRight 0.3s ease-out forwards',
        'partnerSlide': 'partnerSlide 30s linear infinite',
        'delayed-fade-in': 'delayedFadeIn 0.5s ease-out forwards'
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '50%, 100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slide: {
          '0%': { transform: 'translateX(-100%) rotate(-45deg)' },
          '100%': { transform: 'translateX(100%) rotate(-45deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'hue-rotate': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        partnerSlide: {
          '0%': { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        delayedFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      screens: {
        'xs': '375px',
        'print': {'raw': 'print'},
      },
      backgroundImage: {
        'gradient-45': 'linear-gradient(45deg, var(--tw-gradient-from), var(--tw-gradient-to))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      skew: {
        '15': '15deg',
      },
      fontFamily: {
        'heading': ['Roboto Slab', 'serif'],
        'body': ['Roboto', 'sans-serif'],
      },
      zIndex: {
        '60': '60',
        '100': '100',
      },
    },
  },
  plugins: [
    typography,
    scrollbarHide
  ],
} satisfies Config