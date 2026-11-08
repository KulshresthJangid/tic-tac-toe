import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Menu, Moon, Sun, X } from 'lucide-react'
import LogoMark from './LogoMark'
import { useTheme } from '../context/ThemeContext'
import { CALENDLY_URL } from '../lib/contact'

interface NavItem {
  label: string
  to: string
  hash?: string
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/hire' },
  { label: 'Case Studies', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/', hash: '#faq' },
]

export default function Navbar() {
  const { pathname, hash } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setOpen(false), [pathname, hash])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (item: NavItem) => {
    if (item.hash) return pathname === '/' && hash === item.hash
    if (item.to === '/') return pathname === '/' && hash !== '#faq'
    return pathname === item.to || pathname.startsWith(item.to + '/')
  }

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white/80 hover:text-signal hover:border-signal transition-colors"
    >
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-ink/85 backdrop-blur-md border-b border-white/[0.1]' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-5 sm:px-8 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Kulshresth Jangid, home">
          <LogoMark size={34} className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
          <span className="display text-xl text-white leading-none">Kulshresth Jangid</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={{ pathname: item.to, hash: item.hash }}
              className={`relative px-4 py-2 text-sm transition-colors duration-200 ${
                isActive(item) ? 'text-white' : 'text-white/65 hover:text-white'
              }`}
            >
              {item.label}
              {isActive(item) && (
                <motion.span layoutId="nav-dot" className="absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-signal" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {themeButton}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 pl-4 pr-3.5 py-2.5 rounded-full bg-signal text-ink text-sm font-medium hover:bg-white transition-colors duration-200"
          >
            Book a call
            <CalendarDays size={15} />
          </a>
          <button
            type="button"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden"
          >
            <nav className="px-5 pb-6 pt-2 flex flex-col" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={{ pathname: item.to, hash: item.hash }}
                  className="display text-4xl py-3 border-b border-white/[0.1] text-white"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-signal text-ink font-medium"
              >
                Book a call
                <CalendarDays size={16} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
