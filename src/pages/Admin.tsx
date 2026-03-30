import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SESSION_KEY, signOut } from '../lib/adminAuth'

const ADMIN_HASH = 'f2652cc5135f343fb587c8a21357271011e9350dd61be46225e0b46886681599'

async function hashInput(value: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function fakeAuthRequest(token: string): Promise<{ ok: boolean }> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ ok: token === ADMIN_HASH })
    }, 1100),
  )
}

// --- Login Gate ---

function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [shake, setShake] = useState(false)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!value.trim() || status === 'loading') return
      setStatus('loading')
      const hashed = await hashInput(value)
      const res = await fakeAuthRequest(hashed)
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, '1')
        onSuccess()
      } else {
        setStatus('error')
        setShake(true)
        setValue('')
        setTimeout(() => { setShake(false); setStatus('idle') }, 700)
      }
    },
    [value, status, onSuccess],
  )

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4">
            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7a4.5 4.5 0 10-9 0v3.5m-1.5 0h12a1.5 1.5 0 011.5 1.5v7a1.5 1.5 0 01-1.5 1.5h-12A1.5 1.5 0 014.5 19v-7a1.5 1.5 0 011.5-1.5z" />
            </svg>
          </div>
          <h1 className="text-sm font-medium text-white/80">Admin Panel</h1>
          <p className="text-xs text-white/30 mt-1 font-mono">restricted access</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.35 }}
          className="space-y-3"
        >
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); if (status === 'error') setStatus('idle') }}
            placeholder="Enter passphrase"
            autoComplete="current-password"
            autoFocus
            className={[
              'w-full bg-[#0a0a0a] border rounded-lg px-4 py-3 text-sm text-white placeholder-white/20',
              'outline-none transition-all duration-200 font-mono tracking-widest',
              status === 'error'
                ? 'border-red-900/60 focus:border-red-800/80'
                : 'border-white/[0.07] focus:border-white/[0.18]',
            ].join(' ')}
          />
          <button
            type="submit"
            disabled={!value.trim() || status === 'loading'}
            className={[
              'w-full rounded-lg py-3 text-sm font-medium transition-all duration-200',
              status === 'loading'
                ? 'bg-white/[0.04] text-white/30 cursor-not-allowed'
                : 'bg-white/[0.06] hover:bg-white/[0.10] text-white/70 hover:text-white/90 border border-white/[0.07]',
            ].join(' ')}
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-3.5 h-3.5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                <span className="font-mono text-xs">POST /api/v1/auth/verify</span>
              </span>
            ) : (
              'Authenticate'
            )}
          </button>
          <AnimatePresence>
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-xs text-red-500/70 font-mono"
              >
                401 Unauthorized
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
        <p className="text-center text-[11px] text-white/[0.12] mt-6 font-mono">
          POST https://api.buildwithkulshresth.com/v1/auth/verify
        </p>
      </motion.div>
    </div>
  )
}

// --- Dashboard ---

const modules = [
  {
    to: '/admin/plan',
    badge: 'PLAN',
    badgeColor: 'text-[#8b82e8] bg-[#1a1830] border-[#2e2860]/50',
    accent: 'border-l-[#534AB7]',
    title: 'The Master Plan',
    desc: 'One identity. Four pillars. 12-month arc. Career, physique, mind, and income — all engineered.',
    meta: '4 pillars · 12-month roadmap',
  },
  {
    to: '/dsa',
    badge: 'DSA',
    badgeColor: 'text-[#3db896] bg-[#0d1f1b] border-[#1a4035]/50',
    accent: 'border-l-[#0F6E56]',
    title: 'DSA Practice',
    desc: 'Data structures and algorithms tracker. Problems, patterns, and progress — all in one view.',
    meta: 'problems · patterns · solutions',
  },
  {
    to: '/dsa-v2',
    badge: 'DSA v2',
    badgeColor: 'text-[#c98a2a] bg-[#1e1608] border-[#3d2e10]/50',
    accent: 'border-l-[#854F0B]',
    title: 'DSA v2',
    desc: 'Upgraded DSA workspace with enhanced layout, filters, and deeper problem breakdowns.',
    meta: 'enhanced · filtered · v2',
  },
  {
    to: '/ai-ml',
    badge: 'AI/ML',
    badgeColor: 'text-[#818cf8] bg-[#12111f] border-[#2d2d5e]/50',
    accent: 'border-l-[#4f46e5]',
    title: 'My AI/ML Journey',
    desc: 'A 5-phase structured roadmap from Python foundations to LLM engineering and MLOps. Progress tracked here.',
    meta: '5 phases · 49h · milestones + proof',
  },
]

function AdminDashboard() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono text-white/25 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded tracking-wider">
              ADMIN · DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white/90 leading-tight">
            Welcome back,{' '}
            <span className="text-white">Master Kulshresth.</span>
          </h1>
          <p className="text-sm text-white/35 mt-2">Your private workspace. Choose a module below.</p>
        </div>

        <div className="flex flex-col gap-3">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.07 }}
            >
              <Link
                to={mod.to}
                className={`group flex items-center gap-4 bg-[#0a0a0a] border border-white/[0.06] border-l-2 ${mod.accent} rounded-xl p-5 hover:bg-[#111] hover:border-white/[0.12] transition-all duration-200`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white/80 group-hover:text-white/95 transition-colors mb-1">
                    {mod.title}
                  </div>
                  <div className="text-xs text-white/35 leading-relaxed">{mod.desc}</div>
                  <div className="text-[11px] font-mono text-white/20 mt-2">{mod.meta}</div>
                </div>
                <svg
                  className="w-4 h-4 text-white/15 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.04] flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/[0.15]">session active</span>
          <button
            onClick={() => { signOut(); window.location.reload() }}
            className="text-[11px] font-mono text-white/[0.18] hover:text-white/40 transition-colors"
          >
            sign out
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// --- Page Export ---

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const ok = sessionStorage.getItem(SESSION_KEY) === '1'
    setAuthed(ok)
  }, [])

  if (authed === null) return null

  return (
    <AnimatePresence mode="wait">
      {authed ? (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <AdminDashboard />
        </motion.div>
      ) : (
        <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginGate onSuccess={() => setAuthed(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
