import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useState, useEffect } from 'react'

const glitchMessages = [
  "You've wandered into the void.",
  "This page ran away. We're still looking.",
  "Even my nginx can't find this one.",
  "Looks like you took a wrong turn at /dev/null.",
  "This route doesn't exist. I checked. Twice.",
  "HTTP 404: Page not found. Dignity also missing.",
  "The page you're looking for is in another castle.",
  "I'd blame DNS, but it's definitely your URL.",
  "Congratulations, you broke the internet.",
  "This page was last seen mass-migrating to /dev/null.",
]

const terminalLines = [
  '$ curl -I buildwithkulshresth.com' + window.location.pathname,
  'HTTP/2 404',
  'x-powered-by: mass delusion',
  'x-vibe: lost',
  'content-type: disappointment/html',
  '',
  '$ grep -r "this page" /var/www/',
  'grep: pattern not found',
  '',
  '$ echo "maybe try the homepage?"',
  'maybe try the homepage?',
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
          className="text-[8rem] sm:text-[10rem] font-black text-white/[0.03] leading-none select-none"
          animate={{ opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          404
        </motion.h1>

        {/* Random message */}
        <p className="text-white/70 text-lg font-medium -mt-8 mb-2">{msg}</p>
        <p className="text-white/25 text-sm font-mono mb-8">
          {window.location.pathname}
        </p>
      </motion.div>

      {/* Fake terminal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="w-full max-w-lg rounded-lg border border-white/[0.06] bg-[#0a0a0a] p-5 font-mono text-xs mb-10"
      >
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={
              line.startsWith('$')
                ? 'text-white/50'
                : line.startsWith('HTTP')
                  ? 'text-red-400/70'
                  : line === ''
                    ? 'h-3'
                    : 'text-white/20'
            }
          >
            {line}
          </div>
        ))}
        {visibleLines < terminalLines.length && (
          <span className="inline-block w-1.5 h-3.5 bg-white/40 animate-pulse" />
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
          Take me home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="px-5 py-2.5 rounded-lg border border-white/10 text-white/50 text-sm font-medium hover:text-white/80 hover:border-white/20 transition-all duration-150"
        >
          Go back
        </button>
      </motion.div>
    </div>
  )
}
