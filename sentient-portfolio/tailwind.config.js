const defaultTheme = require('tailwindcss/defaultTheme');

/**
 * Tailwind configuration for The Sentient Portfolio.
 *
 * This configuration defines a small palette of neon colours, a dark
 * background and a few custom animations for floating and pulsing
 * effects. It also wires up custom font variables defined via
 * next/font in the root layout.
 */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#05060A',
        primary: '#00F0FF',
        secondary: '#7B61FF',
        accent: '#00FF9C',
        glass: 'rgba(12,16,32,0.75)',
      },
      boxShadow: {
        neon: '0 0 16px rgba(0, 240, 255, 0.4), 0 0 32px rgba(123, 97, 255, 0.25)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', ...defaultTheme.fontFamily.sans],
        body: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        pulseSlow: 'pulse 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(2%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};