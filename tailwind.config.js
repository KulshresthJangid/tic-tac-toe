/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Color Hunt "deep green + mint" palette (#091413 #285A48 #408A71 #B0E4CC).
        // `white` is remapped to a mint tinted off white so every
        // existing text-white/NN and bg-white/[0.NN] across the site picks up
        // tint without touching each page.
        white: '#e8f2ed',
        ink: '#091413',
        surface: '#0f1d1b',
        'surface-2': '#152826',
        signal: '#B0E4CC',
        'signal-soft': '#8fd1b3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blink: 'blink 1.1s step-end infinite',
        wiggle: 'wiggle 2.5s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
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
