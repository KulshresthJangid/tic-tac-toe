import GlassCard from './GlassCard'
import type { Testimonial } from '../types'

interface TestimonialsProps {
  testimonials: Testimonial[]
  compact?: boolean
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Testimonials({ testimonials, compact = false }: TestimonialsProps) {
  const items = compact ? testimonials.slice(0, 3) : testimonials

  if (items.length === 0) return null

  return (
    <div className={`grid gap-4 ${compact ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map((t) => (
        <GlassCard key={t.id} padding="md" className="flex flex-col gap-4">
          <div className="flex items-start gap-2">
            <span className="text-white/15 font-mono text-2xl leading-none select-none">“</span>
            {!t.approved && (
              <span className="ml-auto flex-shrink-0 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded border border-amber-400/20 bg-amber-400/[0.06] text-amber-300/70">
                draft · unconfirmed
              </span>
            )}
          </div>

          <p className="text-sm text-white/60 leading-relaxed -mt-2">{t.quote}</p>

          <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06] mt-auto">
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-white/50 text-xs">
              {initials(t.name)}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {t.linkedinUrl ? (
                  <a
                    href={t.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/80 transition-colors"
                  >
                    {t.name}
                  </a>
                ) : (
                  t.name
                )}
              </div>
              <div className="text-[11px] font-mono text-white/30 truncate">
                {t.role}{t.company !== '—' ? ` · ${t.company}` : ''}
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
