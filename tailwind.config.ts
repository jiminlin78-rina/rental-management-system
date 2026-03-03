import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#FAF8F5',
        'primary-bg-elevated': '#FFFDF9',
        'primary-bg-white': '#FFFFFF',
        'primary-text': '#1A1A1A',
        'text-secondary': '#5C5C5C',
        'text-muted': '#8A8A8A',
        gold: {
          primary: '#C9A962',
          light: '#E8D5A3',
          dark: '#9A7B40',
        },
        border: {
          subtle: '#E8E4DE',
          default: '#D6D0C8',
        },
        accent: {
          success: '#5B8C5A',
          warning: '#C9A962',
          error: '#C97B5A',
        },
      },
      fontFamily: {
        heading: ['"Noto Serif TC"', 'serif'],
        body: ['"Noto Sans TC"', 'sans-serif'],
        number: ['"Lato"', 'sans-serif'],
      },
      boxShadow: {
        'tilt': '0 20px 40px rgba(0,0,0,0.08)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
export default config
