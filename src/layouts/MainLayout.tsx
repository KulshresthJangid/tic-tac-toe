import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'
import { useGenZ } from '../context/GenZContext'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { genzMode } = useGenZ()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14">{children}</main>
      <footer className="border-t border-white/[0.06] py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-slate-700 font-mono">
            {genzMode ? 'not crashed // knock on wood' : 'root@server:~# uptime 99.9% // 47d'}
          </span>
          <span className="text-xs text-slate-700">
            {genzMode ? 'made in jaipur, deployed worldwide' : 'Kulshresth Jangid · Jaipur, India'}
          </span>
          <span className="text-xs text-slate-700 font-mono hidden sm:block">
            {genzMode ? 'vibe check: passed' : 'v1.0.0 // production'}
          </span>
        </div>
      </footer>
    </div>
  )
}
