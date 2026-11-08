import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Testimonial } from '../types'

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const ROTATE_MS = 9000

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const items = testimonials.filter((t) => t.approved)
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((n: number) => setI((n + items.length) % items.length), [items.length])

  useEffect(() => {
    if (reduce || paused || items.length < 2) return
    const id = window.setInterval(() => setI((c) => (c + 1) % items.length), ROTATE_MS)
    return () => window.clearInterval(id)
  }, [reduce, paused, items.length])

  if (items.length === 0) return null
  const t = items[i]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      role="group"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="lg:col-span-8 min-h-[11rem] flex items-center">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            aria-live="polite"
          >
            <p className="display italic text-2xl sm:text-3xl lg:text-[2.1rem] leading-snug text-white">
              <span className="text-signal">&ldquo;</span>
              {t.quote}
              <span className="text-signal">&rdquo;</span>
            </p>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="lg:col-span-4 lg:border-l lg:border-white/[0.12] lg:pl-10 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-full border border-signal/60 flex items-center justify-center font-mono text-sm text-signal">
            {initials(t.name)}
          </span>
          <div>
            <p className="text-white font-medium">
              {t.linkedinUrl ? (
                <a href={t.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-signal transition-colors">
                  {t.name}
                </a>
              ) : (
                t.name
              )}
            </p>
            <p className="text-sm text-white/60">
              {t.role}
              {t.company ? `, ${t.company}` : ''}
            </p>
          </div>
        </div>

        {items.length > 1 && (
          <div className="flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
              {items.map((x, n) => (
                <button
                  key={x.id}
                  type="button"
                  role="tab"
                  aria-selected={n === i}
                  aria-label={`Show testimonial ${n + 1} of ${items.length}`}
                  onClick={() => go(n)}
                  className={`h-2 rounded-full transition-all duration-300 ${n === i ? 'w-6 bg-signal' : 'w-2 bg-white/25 hover:bg-white/50'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(i - 1)}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-signal hover:text-signal transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => go(i + 1)}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-signal hover:text-signal transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
