import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useState, useEffect } from 'react'

const glitchMessages = [
  "this page ghosted you. no closure. just 404.",
  "bro really typed a random URL and expected something.",
  "this route is giving ✨ absolutely nothing ✨",
  "page said 'i need space' and left forever.",
  "you're lost. the page is lost. we're all lost. it's fine.",
  "404: not found. just like my will to add this route.",
  "this URL has the same energy as an empty fridge at 3am.",
  "the page you want doesn't exist. neither does my sleep schedule.",
  "nginx said no. i said no. the server said absolutely not.",
  "skill issue tbh.",
  "this page left the chat.",
  "POV: you fumbled the URL.",
  "bro thought this was a real page 💀",
  "404 — but like, existentially.",
  "the vibes here? immaculate. the page? nonexistent.",
]

const terminalLines = [
  '$ curl -I buildwithkulshresth.com' + window.location.pathname,
  'HTTP/2 404',
  'x-powered-by: audacity',
  'x-vibe: dead',
  'x-mood: disappointed but not surprised',
  'content-type: emotional-damage/html',
  '',
  '$ find / -name "this-page" 2>/dev/null',
  '# ...crickets...',
  '',
  '$ git blame --why',
  'fatal: you. it was you.',
  '',
  '$ echo "go home bro"',
  'go home bro',
]

export default function NotFound() {
  usePageMeta('404 — Page Not Found · Kulshresth Jangid')
  const [msg] = useState(() => glitchMessages[Math.floor(Math.random() * glitchMessages.length)])
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), 120)
      return () => clearTimeout(t)
    }
  }, [visibleLines])

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl"
      >
        {/* Giant 404 */}
        <motion.h1
          className="text-[8rem] sm:text-[10rem] font-black text-red-500/10 leading-none select-none"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.h1>

        {/* Random message */}
        <p className="text-white text-lg sm:text-xl font-semibold -mt-8 mb-2">{msg}</p>
        <p className="text-red-400/60 text-sm font-mono mb-8">
          {window.location.pathname}
        </p>
      </motion.div>

      {/* Fake terminal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full max-w-lg rounded-lg border border-white/[0.08] bg-[#0a0a0a] p-5 font-mono text-xs mb-10"
      >
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith('$')
                ? 'text-green-400/80'
                : line.startsWith('HTTP')
                  ? 'text-red-400 font-bold'
                  : line.startsWith('fatal')
                    ? 'text-red-400/90'
                    : line.startsWith('#')
                      ? 'text-yellow-500/60 italic'
                      : line === ''
                        ? 'h-3'
                        : 'text-white/50'
            }
          >
            {line}
          </div>
        ))}
        {visibleLines < terminalLines.length && (
          <span className="inline-block w-1.5 h-3.5 bg-green-400/70 animate-pulse" />
        )}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex gap-3"
      >
        <Link
          to="/"
          className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-150"
        >
          take me home pls
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2.5 rounded-lg border border-white/10 text-white/50 text-sm font-medium hover:text-white/80 hover:border-white/20 transition-all duration-150"
        >
          undo my mistakes
        </button>
      </motion.div>
    </div>
  )
}
