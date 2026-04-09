import { Link, useLocation } from 'react-router-dom'
import { useGenZ } from '../context/GenZContext'

const navLinks = [
  { to: '/', label: 'Home', genz: 'home base' },
  { to: '/projects', label: 'Projects', genz: 'the builds' },
  { to: '/apps', label: 'Apps', genz: 'live stuff' },
  { to: '/about', label: 'About', genz: 'who dis' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { genzMode, toggleGenZ } = useGenZ()

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
          <button
            onClick={toggleGenZ}
            className={[
              'px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider transition-all duration-300 cursor-pointer',
              genzMode
                ? 'bg-white text-black font-bold'
                : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20',
            ].join(' ')}
          >
            {genzMode ? 'back to linkedin mode' : 'switch the vibe'}
          </button>
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
