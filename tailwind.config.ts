import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        space: ['var(--font-space)'],
        mono: ['var(--font-code)'],
      },
      colors: {
        'space-black': 'var(--space-black)',
        'deep-space': 'var(--deep-space)',
        'electric-cyan': 'var(--electric-cyan)',
        'success-emerald': 'var(--success-emerald)',
        'warning-sunset': 'var(--warning-sunset)',
        'soft-white': 'var(--soft-white)',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'sharp': '4px 4px 0px 0px var(--shadow-color, currentColor)',
        'sharp-sm': '2px 2px 0px 0px var(--shadow-color, currentColor)',
        'sharp-lg': '8px 8px 0px 0px var(--shadow-color, currentColor)',
        'sharp-xl': '12px 12px 0px 0px var(--shadow-color, currentColor)',
        'sharp-inner': 'inset 4px 4px 0px 0px var(--shadow-color, currentColor)',
      }
    },
  },
  plugins: [
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.shadow-sharp': {
          '--shadow-color': 'currentColor',
          'box-shadow': theme('boxShadow.sharp'),
        },
        '.shadow-sharp-sm': {
          '--shadow-color': 'currentColor',
          'box-shadow': theme('boxShadow.sharp-sm'),
        },
        '.shadow-sharp-lg': {
          '--shadow-color': 'currentColor',
          'box-shadow': theme('boxShadow.sharp-lg'),
        },
        '.shadow-sharp-xl': {
          '--shadow-color': 'currentColor',
          'box-shadow': theme('boxShadow.sharp-xl'),
        },
        '.shadow-sharp-inner': {
          '--shadow-color': 'currentColor',
          'box-shadow': theme('boxShadow.sharp-inner'),
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

export default config 