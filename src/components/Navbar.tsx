import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/apps', label: 'Apps' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-white/[0.06] bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
            <span className="text-[10px] font-black text-black font-mono tracking-tight">KJ</span>
          </div>
          <span className="text-sm font-semibold text-white font-mono hidden sm:block">
            buildwithkulshresth.com
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-0.5">
          {navLinks.map(({ to, label }) => {
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
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Status indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            <span className="text-[10px] font-mono text-white/40 hidden sm:block tracking-wider">
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
