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
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 2.5vw, 1rem)',
        'fluid-md': 'clamp(1rem, 3vw, 1.25rem)',
        'fluid-lg': 'clamp(1.25rem, 4vw, 1.5rem)',
        'fluid-xl': 'clamp(1.5rem, 5vw, 2rem)',
        'fluid-2xl': 'clamp(2rem, 6vw, 3rem)',
        'fluid-3xl': 'clamp(2.5rem, 7vw, 4rem)',
        'fluid-4xl': 'clamp(3rem, 8vw, 5rem)',
        'clamp-sm': 'clamp(0.75rem, 1.5vw, 0.875rem)',
        'clamp-md': 'clamp(0.875rem, 2vw, 1rem)',
        'clamp-lg': 'clamp(1rem, 2.5vw, 1.125rem)',
        'clamp-xl': 'clamp(1.125rem, 3vw, 1.25rem)',
      },
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'xl': '0 8px 16px rgba(0, 0, 0, 0.2)',
        '2xl': '0 16px 32px rgba(0, 0, 0, 0.25)',
        'none': 'none',
      },
      zIndex: {
        '60': '60',
        '100': '100',
      },
    },
  },
  plugins: [
    typography,
    scrollbarHide,
    function({ addUtilities, theme }) {
      const textShadows = theme('textShadow');
      const utilities = {};
      for (const [key, value] of Object.entries(textShadows)) {
        utilities[`.text-shadow-${key}`] = {
          textShadow: value,
        };
      }
      addUtilities(utilities);
    },
  ],
} satisfies Config