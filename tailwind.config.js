/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Color Hunt "deep green + mint" palette, driven by CSS variables in
        // index.css so light and dark share every class. `white` is the
        // foreground colour (bone in dark, deep green ink in light) so all
        // existing text-white/NN and border-white/[0.NN] adapt for free.
        white: 'rgb(var(--c-fg) / <alpha-value>)',
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        signal: 'rgb(var(--c-signal) / <alpha-value>)',
        'signal-soft': 'rgb(var(--c-signal-soft) / <alpha-value>)',
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
