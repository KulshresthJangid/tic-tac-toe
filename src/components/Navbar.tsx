import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import LogoMark from './LogoMark'

export const CALENDLY_URL = 'https://calendly.com/jangidkulshresth/20-min-intro-call'

const navLinks = [
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/hire', label: 'Services' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/')

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-ink/85 backdrop-blur-md border-b border-white/[0.08]' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-16 px-5 sm:px-8 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Kulshresth Jangid, home">
          <LogoMark size={34} className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
          <span className="display text-xl text-white leading-none">Kulshresth Jangid</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-4 py-2 text-sm transition-colors duration-200 ${
                isActive(to) ? 'text-white' : 'text-white/55 hover:text-white'
              }`}
            >
              {label}
              {isActive(to) && (
                <motion.span layoutId="nav-dot" className="absolute left-1/2 -translate-x-1/2 bottom-0.5 w-1 h-1 rounded-full bg-signal" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 pl-4 pr-3 py-2 rounded-full bg-white text-ink text-sm font-medium hover:bg-signal transition-colors duration-200"
          >
            Book a call
            <ArrowUpRight size={15} />
          </a>
          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white"
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
            className="md:hidden overflow-hidden"
          >
            <nav className="px-5 pb-6 pt-2 flex flex-col" aria-label="Mobile">
              {[{ to: '/', label: 'Home' }, ...navLinks].map(({ to, label }) => (
                <Link key={to} to={to} className="display text-4xl py-3 border-b border-white/[0.07] text-white">
                  {label}
                </Link>
              ))}
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-signal text-ink font-medium"
              >
                Book a call
                <ArrowUpRight size={16} />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
