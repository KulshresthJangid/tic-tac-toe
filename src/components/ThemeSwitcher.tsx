import { useTheme } from '../context/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex bg-white/10 p-1 rounded-lg border border-white/20">
      <button
        onClick={() => setTheme('glass')}
        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
          theme === 'glass'
            ? 'bg-white/20 text-white shadow-lg border border-white/40 rounded-md backdrop-blur-md'
            : 'text-white/60 hover:text-white'
        }`}
      >
        Glassmorphism
      </button>
      <button
        onClick={() => setTheme('brutal')}
        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
          theme === 'brutal'
            ? 'bg-primary text-black shadow-brutal-hover-primary border border-black'
            : 'text-white/60 hover:text-white'
        }`}
      >
        Terminal Brutalism
      </button>
    </div>
  )
}
