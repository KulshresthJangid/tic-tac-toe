/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#000000',
        surface: '#080808',
        'surface-2': '#0f0f0f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blink: 'blink 1.1s step-end infinite',
        wiggle: 'wiggle 2.5s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        wiggle: {
          '0%, 60%, 100%': { transform: 'translateX(0)' },
          '65%': { transform: 'translateX(-3px)' },
          '70%': { transform: 'translateX(3px)' },
          '75%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
          '85%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
          '95%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
