import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LogoMark from '../components/LogoMark'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="grain min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <footer className="border-t border-white/[0.08] mt-auto">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <LogoMark size={30} />
              <p className="display text-2xl text-white">Kulshresth Jangid</p>
            </div>
            <p className="font-mono text-xs text-white/40 mt-1">Backend engineer, Jaipur, India. Working remotely.</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55" aria-label="Footer">
            <Link to="/projects" className="hover:text-white transition-colors">Work</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/hire" className="hover:text-white transition-colors">Services</Link>
            <a href="https://github.com/kulshresthjangid" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/kulshresth-jangid/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="/resume/kulshresth-jangid-resume.pdf" download className="hover:text-white transition-colors">Resume</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
