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
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-white/[0.06] bg-base/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <span className="text-[10px] font-black text-white font-mono tracking-tight">KJ</span>
          </div>
          <span className="text-sm font-semibold text-white font-mono hidden sm:block">
            kulshresthjangid.dev
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
                    ? 'bg-white/[0.08] text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]',
                ].join(' ')}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Status indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400 hidden sm:block tracking-wider">
              ONLINE
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
