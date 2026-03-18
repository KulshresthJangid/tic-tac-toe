import type { ReactNode } from 'react'
import Navbar from '../components/Navbar'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14">{children}</main>
      <footer className="border-t border-white/[0.06] py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-slate-700 font-mono">
            root@server:~# uptime 99.9% // 47d
          </span>
          <span className="text-xs text-slate-700">
            Kulshresth Jangid · Jaipur, India
          </span>
          <span className="text-xs text-slate-700 font-mono hidden sm:block">
            v1.0.0 // production
          </span>
        </div>
      </footer>
    </div>
  )
}
