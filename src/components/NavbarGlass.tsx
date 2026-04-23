import { Link, useLocation } from 'react-router-dom'
import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'
import { useGenZ } from '../context/GenZContext'
import ThemeSwitcher from './ThemeSwitcher'

const navLinks = [
  { to: '/', label: 'Home', genz: 'home base' },
  { to: '/projects', label: 'Projects', genz: 'the builds' },
  { to: '/apps', label: 'Apps', genz: 'live stuff' },
  { to: '/about', label: 'About', genz: 'who dis' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { genzMode, toggleGenZ } = useGenZ()
  const shakeControls = useAnimation()

  useEffect(() => {
    if (!genzMode) {
      shakeControls.start({
        x: [0, -5, 5, -5, 5, -3, 3, 0],
        transition: { duration: 0.7, repeat: Infinity, repeatDelay: 1.8 },
      })
    } else {
      shakeControls.stop()
      shakeControls.set({ x: 0 })
    }
  }, [genzMode])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-white/[0.06] bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
            <span className="text-[10px] font-black text-black font-mono tracking-tight">KJ</span>
          </div>
          <span className="text-sm font-semibold text-white font-mono hidden sm:block">
            {genzMode ? 'kul.js' : 'buildwithkulshresth.com'}
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {navLinks.map(({ to, label, genz }) => {
            const isActive =
              to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/')
            return (
              <Link
                key={to}
                to={to}
                className={[
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white text-black'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.06]',
                ].join(' ')}
              >
                {genzMode ? genz : label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ThemeSwitcher />
          <motion.button
            onClick={toggleGenZ}
            animate={shakeControls}
            className={[
              'px-3 py-1.5 rounded-md text-[11px] font-mono tracking-wider transition-all duration-300 cursor-pointer font-semibold',
              genzMode
                ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                : 'bg-white/[0.08] border border-white/30 text-white hover:bg-white/[0.14] hover:border-white/50 hover:shadow-[0_0_10px_rgba(255,255,255,0.15)]',
            ].join(' ')}
          >
            {genzMode ? 'back to linkedin mode' : 'switch the vibe'}
          </motion.button>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            <span className="text-[10px] font-mono text-white/40 hidden sm:block tracking-wider">
              {genzMode ? 'NOT OFFLINE' : 'ONLINE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
