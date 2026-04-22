/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: {
          lowest: '#000000',
          low: '#000000',
          DEFAULT: '#000000',
          high: '#000000',
          highest: '#000000',
          bright: '#111111'
        },
        primary: {
          DEFAULT: '#00FF41', // Matrix Green
          dim: '#00cc34',
          container: '#00ff41',
          on: '#000000',
        },
        secondary: {
          DEFAULT: '#FF3E00', // Safety Orange
          dim: '#cc3100',
          container: '#ff3e00',
        },
        outline: {
          DEFAULT: '#ffffff',
          variant: '#aaaaaa',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        brutal: '6px 6px 0px 0px rgba(255,255,255,1)',
        'brutal-primary': '6px 6px 0px 0px #00FF41',
        'brutal-secondary': '6px 6px 0px 0px #FF3E00',
        'brutal-hover': '2px 2px 0px 0px rgba(255,255,255,1)',
        'brutal-hover-primary': '2px 2px 0px 0px #00FF41',
      },
      translate: {
        'brutal-hover': '4px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blink: 'blink 1.1s step-end infinite',
        wiggle: 'wiggle 2.5s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
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
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
