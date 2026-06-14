import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:        'var(--primary)',
        'primary-light':'var(--primary-light)',
        'primary-medium':'var(--primary-medium)',
        secondary:      'var(--secondary)',
        accent:         'var(--accent)',
        'accent-light': 'var(--accent-light)',
        'accent-dark':  'var(--accent-dark)',
        neutral: {
          50:  'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
        },
      },
      fontFamily: {
        display: ['Manrope', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body:    ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-smooth':   'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '900': '900ms',
      },
    },
  },
  plugins: [],
};

export default config;
