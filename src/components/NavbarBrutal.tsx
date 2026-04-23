import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
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
        x: [0, -4, 4, -4, 4, -2, 2, 0],
        transition: { duration: 0.2, repeat: Infinity, repeatDelay: 2 },
      })
    } else {
      shakeControls.stop()
      shakeControls.set({ x: 0 })
    }
  }, [genzMode])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 border-b-4 border-white bg-black font-mono">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group transition-none">
          <div className="w-8 h-8 bg-primary border-2 border-white flex items-center justify-center shadow-brutal group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[0px_0px_0_0_#fff] transition-none">
            <span className="text-sm font-black text-black tracking-tight">KJ</span>
          </div>
          <span className="text-base font-black text-white uppercase hidden sm:block">
            {genzMode ? 'kul.js' : 'buildwithkulshresth'}
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2">
          {navLinks.map(({ to, label, genz }) => {
            const isActive =
              to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/')
            return (
              <Link
                key={to}
                to={to}
                className={[
                  'px-3 py-1 font-bold uppercase transition-none border-2 border-transparent',
                  isActive
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-primary hover:text-black hover:border-white',
                ].join(' ')}
              >
                {genzMode ? genz : label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <ThemeSwitcher />
          <motion.button
            onClick={toggleGenZ}
            animate={shakeControls}
            className={[
              'px-3 py-1 text-xs font-black uppercase transition-none border-2 shadow-brutal active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hidden md:block',
              genzMode
                ? 'bg-secondary text-black border-white shadow-[2px_2px_0_0_#fff]'
                : 'bg-black text-white border-white hover:bg-white hover:text-black',
            ].join(' ')}
          >
            {genzMode ? 'back to linkedin mode' : 'switch the vibe'}
          </motion.button>
          <div className="flex items-center gap-2 px-3 py-1 bg-black border-2 border-primary">
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span className="text-xs font-black text-primary uppercase hidden sm:block tracking-widest">
              {genzMode ? 'NOT OFFLINE' : 'ONLINE'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
