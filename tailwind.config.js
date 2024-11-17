/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#1A1A2E',
        'deep-space': '#16213E',
        'electric-cyan': '#00FFF5',
        'success-emerald': '#50C878',
        'warning-sunset': '#FF7F50',
        'soft-white': '#F8F9FA',
        'koko': {
          50: '#f3f1ff',
          100: '#ebe5ff',
          200: '#d9ceff',
          300: '#bea6ff',
          400: '#9f75ff',
          500: '#843dff',
          600: '#7916ff',
          700: '#6b04fd',
          800: '#5a03d5',
          900: '#4b05ad',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'scanline': 'scanline 3s linear infinite',
        'scanline-vertical': 'scanline-vertical 3s linear infinite',
        'grid-move': 'grid-move 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
            borderColor: 'rgba(124, 58, 237, 0.2)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)',
            borderColor: 'rgba(124, 58, 237, 0.6)'
          },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.3' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' }
        },
        'scanline-vertical': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '0.3' },
          '100%': { transform: 'translateX(100vw)', opacity: '0' }
        },
        'grid-move': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' }
        }
      },
      borderWidth: {
        '1': '1px',
        '3': '3px',
      },
      boxShadow: {
        'sharp': '4px 4px 0 0 currentColor',
        'sharp-sm': '2px 2px 0 0 currentColor',
        'sharp-lg': '8px 8px 0 0 currentColor',
        'sharp-xl': '12px 12px 0 0 currentColor',
        'sharp-inner': 'inset 4px 4px 0 0 currentColor',
      }
    },
  },
  plugins: [],
} 