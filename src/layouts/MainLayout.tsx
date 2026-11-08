import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LogoMark from '../components/LogoMark'

interface MainLayoutProps {
  children: ReactNode
}

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/hire' },
  { label: 'Case Studies', to: '/projects' },
  { label: 'About', to: '/about' },
]

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kulshresth-jangid/' },
  { label: 'GitHub', href: 'https://github.com/kulshresthjangid' },
  { label: 'X', href: 'https://x.com/nerdy_ge3k' },
]

/** Scroll to #anchors on route changes, which React Router does not do by itself. */
function useHashScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }
    const id = hash.slice(1)
    let tries = 0
    const tick = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else if (tries++ < 20) window.setTimeout(tick, 50)
    }
    tick()
  }, [pathname, hash])
}

export default function MainLayout({ children }: MainLayoutProps) {
  useHashScroll()

  return (
    <div className="grain min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <footer className="border-t border-white/[0.1] mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={36} />
              <div>
                <p className="display text-2xl text-white leading-none">Kulshresth Jangid</p>
                <p className="font-mono text-[11px] text-white/55 mt-1.5">Backend Engineer &middot; Jaipur, India</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap md:justify-center gap-x-6 gap-y-2 text-sm text-white/70 md:flex-nowrap" aria-label="Footer">
            {footerLinks.map((l) => (
              <Link key={l.label} to={l.to} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <Link to={{ pathname: '/', hash: '#faq' }} className="hover:text-white transition-colors">
              FAQ
            </Link>
            <Link to={{ pathname: '/', hash: '#contact' }} className="hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex md:justify-end gap-5 text-sm text-white/70">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-signal transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-[11px] text-white/55 leading-relaxed">
            <span>&copy; {new Date().getFullYear()} Kulshresth Jangid. Client work is covered by a written agreement.</span>
            <span className="max-w-xl lg:text-center">
              This site is not part of the Facebook website or Facebook Inc. This site is not endorsed by Facebook in any way.
            </span>
            <span className="flex gap-3">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span aria-hidden>|</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
