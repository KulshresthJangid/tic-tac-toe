import { useState, useEffect, useCallback } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  CURRICULUM,
  STREAK_MILESTONES,
  type DayData,
  type Difficulty,
} from '../data/dsaV3Curriculum'

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#000',
  surface: '#0a0a0a',
  surface2: '#111',
  surface3: '#161616',
  border: '#1c1c1c',
  borderMid: '#2a2a2a',
  white: '#fff',
  whiteOff: '#e8e8e8',
  gray: '#888',
  grayDim: '#555',
  grayDeep: '#333',
  muted: '#444',
  accent: '#f97316',   // orange — streak / progress
  accentDim: '#3a1a05',
  green: '#22c55e',
  greenDim: '#052a10',
  blue: '#3b82f6',
  blueDim: '#0a1a3a',
  red: '#ef4444',
}

// ─── Types ────────────────────────────────────────────────────────────────────
type SessionPhase =
  | 'concept'     // show concept intro
  | 'watch'       // watch-first gate
  | 'problem'     // show problem
  | 'attempt'     // user is attempting
  | 'solution'    // solution revealed
  | 'similar'     // similar problems
  | 'complete'    // session done

interface Progress {
  [key: string]: {
    watched: boolean
    attempted: boolean
    completed: boolean
    timestamp: string
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
const LS = {
  get: (key: string) => { try { return localStorage.getItem(key) } catch { return null } },
  set: (key: string, val: string) => { try { localStorage.setItem(key, val) } catch { /* noop */ } },
  getJSON: <T,>(key: string, fallback: T): T => {
    try {
      const v = localStorage.getItem(key)
      return v ? (JSON.parse(v) as T) : fallback
    } catch { return fallback }
  },
  setJSON: (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch { /* noop */ }
  },
}

// ─── Streak engine ────────────────────────────────────────────────────────────
function computeStreak(lastSession: string | null, stored: number): {
  streak: number
  closeCall: boolean
  reset: boolean
  milestone: string | null
} {
  if (!lastSession) return { streak: stored, closeCall: false, reset: false, milestone: null }
  const diffH = (Date.now() - new Date(lastSession).getTime()) / 3600000
  if (diffH < 24) return { streak: stored, closeCall: false, reset: false, milestone: null }
  if (diffH < 48) return { streak: stored, closeCall: true, reset: false, milestone: null }
  return { streak: 0, closeCall: false, reset: true, milestone: null }
}

function incrementStreak(current: number): { next: number; milestone: string | null } {
  const next = current + 1
  return { next, milestone: STREAK_MILESTONES[next] ?? null }
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────
function DiffBadge({ d }: { d: Difficulty }) {
  const map: Record<Difficulty, { label: string; color: string; bg: string }> = {
    Easy:   { label: 'Easy',   color: C.green, bg: C.greenDim },
    Medium: { label: 'Medium', color: '#f59e0b', bg: '#2a1a00' },
    Hard:   { label: 'Hard',   color: C.red, bg: '#2a0505' },
  }
  const s = map[d]
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
      color: s.color, background: s.bg, border: `1px solid ${s.color}22`,
    }}>
      {s.label}
    </span>
  )
}

// ─── Pattern Badge ────────────────────────────────────────────────────────────
function PatternBadge({ name }: { name: string }) {
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600,
      color: '#a78bfa', background: '#1a0a3a', border: '1px solid #a78bfa22',
    }}>
      {name}
    </span>
  )
}

// ─── Company Tags ─────────────────────────────────────────────────────────────
function CompanyTags({ companies }: { companies: string[] }) {
  if (!companies.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {companies.map((c) => (
        <span key={c} style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 11,
          color: C.gray, background: C.surface2, border: `1px solid ${C.border}`,
        }}>
          {c}
        </span>
      ))}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  const filled = Math.round((current / total) * 20)
  const empty = 20 - filled
  return (
    <div>
      <div style={{
        fontFamily: 'monospace', fontSize: 13, color: C.accent,
        letterSpacing: 1, marginBottom: 4,
      }}>
        {'▓'.repeat(filled) + '░'.repeat(empty)} {pct}%
      </div>
      <div style={{ fontSize: 11, color: C.grayDim }}>
        Day {current} of {total}
      </div>
    </div>
  )
}

// ─── Pattern Card (first-time intro) ─────────────────────────────────────────
function PatternIntroCard({ card }: { card: NonNullable<DayData['patternCard']> }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      border: `1px solid #a78bfa44`, borderRadius: 8, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '10px 16px', background: '#1a0a3a',
          border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: '#a78bfa', fontSize: 13, fontWeight: 600 }}>
          ✦ First time seeing "{card.name}" — Pattern Card
        </span>
        <span style={{ color: '#a78bfa', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div style={{ padding: '12px 16px', background: '#120820', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>WHEN TO USE</div>
            <div style={{ fontSize: 13, color: C.whiteOff, lineHeight: 1.6 }}>{card.whenToUse}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>THE TELL</div>
            <div style={{ fontSize: 13, color: C.whiteOff, lineHeight: 1.6 }}>{card.tell}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginBottom: 4 }}>DIAGRAM</div>
            <pre style={{
              fontFamily: 'monospace', fontSize: 12, color: '#c4b5fd',
              background: '#0f0520', padding: 10, borderRadius: 6, margin: 0,
              whiteSpace: 'pre-wrap', lineHeight: 1.5,
            }}>{card.ascii}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Hints Panel ─────────────────────────────────────────────────────────────
function HintsPanel({ hints }: { hints: [string, string, string] }) {
  const [revealed, setRevealed] = useState(0)
  const labels = ['Pattern Name', 'Approach', 'Pseudocode']

  if (hints[0] === '---') return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, letterSpacing: 1 }}>HINTS</div>
      {hints.map((hint, i) => (
        <div key={i}>
          {i < revealed ? (
            <div style={{
              border: `1px solid ${C.borderMid}`, borderRadius: 8, padding: '10px 14px',
              background: C.surface2,
            }}>
              <div style={{ fontSize: 11, color: C.grayDim, marginBottom: 4 }}>Hint {i + 1}: {labels[i]}</div>
              <pre style={{
                fontFamily: i === 2 ? 'monospace' : 'inherit',
                fontSize: i === 2 ? 12 : 13,
                color: C.whiteOff, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5,
              }}>{hint}</pre>
            </div>
          ) : i === revealed ? (
            <button
              onClick={() => setRevealed(i + 1)}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                border: `1px dashed ${C.borderMid}`, background: C.surface,
                cursor: 'pointer', textAlign: 'left',
                color: C.grayDim, fontSize: 12,
              }}
            >
              Reveal hint {i + 1}: {labels[i]}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  )
}

// ─── Solution Panel ───────────────────────────────────────────────────────────
function SolutionPanel({
  code, tc, sc, onReveal,
}: { code: string; tc: string; sc: string; onReveal: () => void }) {
  const [revealed, setRevealed] = useState(false)

  if (!code) return null

  if (!revealed) {
    return (
      <button
        onClick={() => { setRevealed(true); onReveal() }}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: 8,
          border: `1px solid ${C.borderMid}`, background: C.surface,
          cursor: 'pointer', color: C.gray, fontSize: 13,
        }}
      >
        Reveal solution — only after you've made a genuine attempt
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, letterSpacing: 1 }}>SOLUTION</div>
      <pre style={{
        fontFamily: 'monospace', fontSize: 12, color: '#86efac',
        background: '#020d04', border: `1px solid ${C.border}`, borderRadius: 8,
        padding: '14px 16px', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6,
        overflowX: 'auto',
      }}>{code}</pre>
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: C.grayDim }}>
        <span>⏱ Time: <span style={{ color: C.gray }}>{tc}</span></span>
        <span>🗃 Space: <span style={{ color: C.gray }}>{sc}</span></span>
      </div>
    </div>
  )
}

// ─── Similar Problems ─────────────────────────────────────────────────────────
function SimilarProblems({ problems }: { problems: DayData['similar'] }) {
  if (!problems.length) return null
  const diffColor: Record<string, string> = { Easy: C.green, Medium: '#f59e0b', Hard: C.red }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, letterSpacing: 1 }}>SIMILAR PROBLEMS</div>
      {problems.map((p) => (
        <div key={p.title} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', background: C.surface2, borderRadius: 8,
          border: `1px solid ${C.border}`,
        }}>
          <span style={{ fontSize: 13, color: C.whiteOff }}>{p.leetcode ? `${p.leetcode}. ` : ''}{p.title}</span>
          <span style={{ fontSize: 11, color: diffColor[p.difficulty] }}>{p.difficulty}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Verification Checklist (review days) ────────────────────────────────────
const REVIEW_CHECKLIST = [
  'I can name the patterns covered this week from memory',
  'I can explain the time complexity of each solution',
  'I know WHEN to apply each pattern (the "tell")',
  'I attempted at least one "similar problem" from any day',
  'I can implement the core logic without hints',
]

function ReviewChecklist() {
  const [checked, setChecked] = useState<boolean[]>(REVIEW_CHECKLIST.map(() => false))
  const toggle = (i: number) => setChecked((prev) => prev.map((v, j) => (j === i ? !v : v)))
  return (
    <div style={{
      border: `1px solid ${C.borderMid}`, borderRadius: 8, padding: '14px 16px',
      background: C.surface2, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, letterSpacing: 1 }}>
        WEEK REVIEW CHECKLIST
      </div>
      {REVIEW_CHECKLIST.map((item, i) => (
        <button
          key={i}
          onClick={() => toggle(i)}
          style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0,
          }}
        >
          <span style={{
            width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
            border: `2px solid ${checked[i] ? C.green : C.border}`,
            background: checked[i] ? C.greenDim : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: C.green,
          }}>
            {checked[i] ? '✓' : ''}
          </span>
          <span style={{ fontSize: 13, color: checked[i] ? C.gray : C.whiteOff, lineHeight: 1.5 }}>
            {item}
          </span>
        </button>
      ))}
      {checked.every(Boolean) && (
        <div style={{
          marginTop: 6, padding: '8px 12px', background: C.greenDim,
          borderRadius: 6, fontSize: 13, color: C.green,
        }}>
          Week complete. Move on — you've earned it.
        </div>
      )}
    </div>
  )
}

// ─── Day Navigation drawer ────────────────────────────────────────────────────
function DayNav({
  currentDay, progress, onSelect, onClose,
}: {
  currentDay: number
  progress: Progress
  onSelect: (day: number) => void
  onClose: () => void
}) {
  const weeks = Array.from({ length: 12 }, (_, w) =>
    CURRICULUM.slice(w * 7, w * 7 + 7)
  )

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
        zIndex: 100, display: 'flex', justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 320, height: '100%', background: C.surface, overflowY: 'auto',
          borderLeft: `1px solid ${C.border}`, padding: 20,
          display: 'flex', flexDirection: 'column', gap: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: C.white, fontSize: 14, fontWeight: 600 }}>84-Day Curriculum</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.gray, cursor: 'pointer', fontSize: 18 }}>×</button>
        </div>
        {weeks.map((weekDays, wi) => (
          <div key={wi}>
            <div style={{ fontSize: 11, color: C.grayDim, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>
              WEEK {wi + 1}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {weekDays.map((day) => {
                const done = progress[`day${day.day}`]?.completed
                const isCurrent = day.day === currentDay
                const typeColor = day.type === 'rest' ? C.grayDeep : day.type === 'review' ? '#2a1a3a' : C.surface2
                return (
                  <button
                    key={day.day}
                    onClick={() => { onSelect(day.day); onClose() }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
                      borderRadius: 6, border: isCurrent ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
                      background: isCurrent ? C.accentDim : typeColor, cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 10, color: done ? C.green : isCurrent ? C.accent : C.grayDim, width: 16 }}>
                      {done ? '✓' : isCurrent ? '▶' : `${day.day}`}
                    </span>
                    <span style={{
                      fontSize: 12, color: isCurrent ? C.accent : done ? C.gray : C.grayDim,
                      textAlign: 'left', flex: 1,
                    }}>
                      {day.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main DSAv3 Page ──────────────────────────────────────────────────────────
export default function DSAv3() {
  usePageMeta(
    'DSA Coach | Aryan',
    'Structured 84-day DSA coaching: streak engine, pattern recognition, watch-first sessions.',
  )

  // ── Persistent state ────────────────────────────────────────────
  const [currentDay, setCurrentDay] = useState<number>(() =>
    parseInt(LS.get('dsa-v3-currentDay') ?? '1', 10) || 1,
  )
  const [streak, setStreak] = useState<number>(() =>
    parseInt(LS.get('dsa-v3-streak') ?? '0', 10) || 0,
  )
  const [progress, setProgress] = useState<Progress>(() =>
    LS.getJSON<Progress>('dsa-v3-progress', {}),
  )
  const [lastSession, setLastSession] = useState<string | null>(() =>
    LS.get('dsa-v3-lastSession'),
  )

  // ── Ephemeral session state ─────────────────────────────────────
  const [phase, setPhase] = useState<SessionPhase>('concept')
  const [toast, setToast] = useState<string | null>(null)
  const [navOpen, setNavOpen] = useState(false)
  const [, setOneMinuteMode] = useState(false)

  // ── Derived ─────────────────────────────────────────────────────
  const dayData = CURRICULUM.find((d) => d.day === currentDay) ?? CURRICULUM[0]
  const dayKey = `day${currentDay}`
  const dayDone = progress[dayKey]?.completed ?? false
  const { closeCall, reset, streak: computedStreak } = computeStreak(lastSession, streak)

  // Sync computed streak discrepancy on mount
  useEffect(() => {
    if (reset && streak > 0) {
      setStreak(0)
      LS.set('dsa-v3-streak', '0')
    }
    if (closeCall) {
      showToast("Close call — your streak is still alive, but don't miss tomorrow.")
    }
    if (reset) {
      showToast("Fresh start. Streaks can be rebuilt in days. Let's go.")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset phase when day changes
  useEffect(() => {
    setPhase('concept')
    setOneMinuteMode(false)
  }, [currentDay])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }, [])

  // ── Handlers ────────────────────────────────────────────────────
  const markWatched = () => {
    updateProgress({ watched: true })
    setPhase('problem')
  }


  const markComplete = () => {
    const now = new Date().toISOString()
    const today = now.split('T')[0]
    const wasCompletedToday = lastSession?.split('T')[0] === today

    updateProgress({ completed: true, timestamp: now })
    setLastSession(now)
    LS.set('dsa-v3-lastSession', now)

    if (!dayDone && !wasCompletedToday) {
      const { next, milestone } = incrementStreak(computedStreak)
      setStreak(next)
      LS.set('dsa-v3-streak', String(next))
      if (milestone) showToast(milestone)
    }

    setPhase('complete')
    // Advance to next day if on current day
    if (currentDay < 84 && !dayDone) {
      const nextDay = currentDay + 1
      LS.set('dsa-v3-currentDay', String(nextDay))
      // Don't auto-advance — let user click
    }
  }

  const advanceDay = () => {
    const next = Math.min(84, currentDay + 1)
    setCurrentDay(next)
    LS.set('dsa-v3-currentDay', String(next))
  }

  const updateProgress = (update: Partial<Progress[string]>) => {
    setProgress((prev) => {
      const existing = prev[dayKey] ?? { watched: false, attempted: false, completed: false, timestamp: '' }
      const next = { ...prev, [dayKey]: { ...existing, ...update } }
      LS.setJSON('dsa-v3-progress', next)
      return next
    })
  }

  const handleOneMinuteMode = () => {
    setOneMinuteMode(true)
    updateProgress({ watched: true, attempted: true })
    markComplete()
    showToast("1-minute mode — concept logged. Streak maintained.")
  }

  // ── Render helpers ───────────────────────────────────────────────
  const completedCount = Object.values(progress).filter((p) => p.completed).length

  const isRestOrReview = dayData.type === 'rest' || dayData.type === 'review'

  // For rest/review days, simplify the phase flow
  const renderRestDay = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px',
        background: C.surface2,
      }}>
        <div style={{ fontSize: 13, color: C.whiteOff, lineHeight: 1.7 }}>{dayData.conceptIntro}</div>
      </div>
      {dayData.type === 'review' && <ReviewChecklist />}
      <div style={{ fontSize: 11, color: C.grayDim, textAlign: 'center' }}>{dayData.whyItMatters}</div>
      {phase !== 'complete' ? (
        <button onClick={markComplete} style={btn(C.surface2, C.border)}>
          {dayData.type === 'rest' ? 'Mark rest day done' : 'Mark review complete'}
        </button>
      ) : (
        <CompleteBanner onNext={advanceDay} isLast={currentDay === 84} />
      )}
    </div>
  )

  const renderActiveSession = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Why it matters */}
      {phase === 'concept' && (
        <div style={{
          border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 18px',
          background: C.surface2,
        }}>
          <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>
            WHY THIS MATTERS
          </div>
          <div style={{ fontSize: 13, color: C.whiteOff, lineHeight: 1.7 }}>{dayData.whyItMatters}</div>
        </div>
      )}

      {/* Pattern card — first time */}
      {phase === 'concept' && dayData.patternCard && (
        <PatternIntroCard card={dayData.patternCard} />
      )}

      {/* Concept intro */}
      {phase === 'concept' && (
        <>
          <div style={{
            border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 18px',
            background: C.surface2,
          }}>
            <div style={{ fontSize: 11, color: C.gray, fontWeight: 600, letterSpacing: 1, marginBottom: 6 }}>
              CONCEPT
            </div>
            <div style={{ fontSize: 13, color: C.whiteOff, lineHeight: 1.7 }}>{dayData.conceptIntro}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPhase('watch')} style={btn(C.surface2, C.border, C.accent, true)}>
              Got it — watch the video →
            </button>
            <button onClick={handleOneMinuteMode} style={btn(C.surface, C.border)}>
              1-min mode (concept only)
            </button>
          </div>
        </>
      )}

      {/* Watch gate */}
      {phase === 'watch' && (
        <div style={{
          border: `1px solid ${C.borderMid}`, borderRadius: 10, padding: '20px 18px',
          background: C.surface2, display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, color: C.whiteOff }}>
            Watch the NeetCode video before attempting the problem.
          </div>
          <div style={{ fontSize: 11, color: C.grayDim }}>
            Estimated time: {dayData.estimatedMinutes} min
          </div>
          {dayData.videoUrl && (
            <a
              href={dayData.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block', padding: '10px 20px', borderRadius: 8,
                background: '#1a0505', border: `1px solid #ef4444`, color: '#ef4444',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}
            >
              ▶ Watch on YouTube
            </a>
          )}
          <div style={{ fontSize: 11, color: C.grayDim }}>
            Come back here after watching to unlock the problem.
          </div>
          <button onClick={markWatched} style={btn(C.surface2, C.border)}>
            I've watched — show the problem
          </button>
        </div>
      )}

      {/* Problem */}
      {(phase === 'problem' || phase === 'attempt' || phase === 'solution' || phase === 'complete') && (
        <div style={{
          border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 18px',
          background: C.surface2, display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <CompanyTags companies={dayData.companies} />
          <div style={{ fontSize: 13, color: C.whiteOff, lineHeight: 1.7 }}>
            {dayData.statement || (
              <span style={{ color: C.grayDim, fontStyle: 'italic' }}>
                Full problem data coming soon. Practice with a similar problem or watch the video.
              </span>
            )}
          </div>
          {dayData.examples.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {dayData.examples.map((ex, i) => (
                <div key={i} style={{
                  fontFamily: 'monospace', fontSize: 12, background: C.surface3,
                  border: `1px solid ${C.border}`, borderRadius: 6,
                  padding: '8px 12px', color: C.gray, lineHeight: 1.5,
                }}>
                  <span style={{ color: C.grayDim }}>Input: </span>{ex.input}<br />
                  <span style={{ color: C.grayDim }}>Output: </span>{ex.output}
                  {ex.explanation && <><br /><span style={{ color: C.muted }}>// {ex.explanation}</span></>}
                </div>
              ))}
            </div>
          )}
          {dayData.constraints.length > 0 && (
            <div style={{ fontSize: 11, color: C.grayDim, lineHeight: 1.6 }}>
              {dayData.constraints.map((c, i) => <div key={i}>• {c}</div>)}
            </div>
          )}
        </div>
      )}

      {/* Attempt CTA */}
      {phase === 'problem' && (
        <button onClick={() => setPhase('attempt')} style={btn(C.surface2, C.border, C.accent, true)}>
          Open LeetCode and attempt →
        </button>
      )}

      {/* Hints + Solution */}
      {(phase === 'attempt' || phase === 'solution' || phase === 'complete') && (
        <>
          <HintsPanel hints={dayData.hints} />
          <SolutionPanel
            code={dayData.solutionCode}
            tc={dayData.timeComplexity}
            sc={dayData.spaceComplexity}
            onReveal={() => setPhase('solution')}
          />
        </>
      )}

      {/* Complete button */}
      {(phase === 'attempt' || phase === 'solution') && (
        <button onClick={markComplete} style={btn(C.greenDim, C.green + '44', C.green, true)}>
          Mark complete — move on
        </button>
      )}

      {/* Similar + next */}
      {phase === 'complete' && (
        <>
          <SimilarProblems problems={dayData.similar} />
          <CompleteBanner onNext={advanceDay} isLast={currentDay === 84} />
        </>
      )}
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.white,
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '0 0 80px 0',
    }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: C.bg, borderBottom: `1px solid ${C.border}`,
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
        flexWrap: 'wrap',
      }}>
        {/* Streak */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 20,
          background: streak > 0 ? C.accentDim : C.surface2,
          border: `1px solid ${streak > 0 ? C.accent + '44' : C.border}`,
        }}>
          <span style={{ fontSize: 14 }}>🔥</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: streak > 0 ? C.accent : C.gray }}>
            {streak} day{streak !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Day indicator */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <ProgressBar current={completedCount} total={84} />
        </div>

        {/* Curriculum nav */}
        <button
          onClick={() => setNavOpen(true)}
          style={{
            padding: '6px 12px', borderRadius: 6, border: `1px solid ${C.border}`,
            background: C.surface2, cursor: 'pointer', fontSize: 12, color: C.gray,
          }}
        >
          All Days ☰
        </button>
      </div>

      {/* ── Day title card ───────────────────────────────────────── */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          border: `1px solid ${C.borderMid}`, borderRadius: 10, padding: '14px 18px',
          background: C.surface, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: C.grayDim }}>DAY {dayData.day}</span>
            <DiffBadge d={dayData.difficulty} />
            <PatternBadge name={dayData.pattern} />
            {dayDone && (
              <span style={{ fontSize: 11, color: C.green, marginLeft: 'auto' }}>✓ complete</span>
            )}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: -0.3 }}>
            {dayData.title}
          </div>
          {dayData.estimatedMinutes > 0 && (
            <div style={{ fontSize: 11, color: C.grayDim }}>
              Today takes ~{dayData.estimatedMinutes} minutes.
            </div>
          )}
        </div>
      </div>

      {/* ── Session content ──────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isRestOrReview ? renderRestDay() : renderActiveSession()}
      </div>

      {/* ── Toast notification ───────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: C.surface2, border: `1px solid ${C.borderMid}`, borderRadius: 8,
          padding: '10px 18px', fontSize: 13, color: C.whiteOff,
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)', zIndex: 200, maxWidth: 360,
          textAlign: 'center', lineHeight: 1.5,
        }}>
          {toast}
        </div>
      )}

      {/* ── Day navigation ───────────────────────────────────────── */}
      {navOpen && (
        <DayNav
          currentDay={currentDay}
          progress={progress}
          onSelect={(d) => {
            setCurrentDay(d)
            LS.set('dsa-v3-currentDay', String(d))
          }}
          onClose={() => setNavOpen(false)}
        />
      )}
    </div>
  )
}

// ─── Complete Banner ──────────────────────────────────────────────────────────
function CompleteBanner({ onNext, isLast }: { onNext: () => void; isLast: boolean }) {
  return (
    <div style={{
      border: `1px solid ${C.green}44`, borderRadius: 10, padding: '16px 18px',
      background: C.greenDim, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.green }}>
        {isLast ? '🎯 84 days complete. You did it.' : '✓ Day complete'}
      </div>
      {!isLast && (
        <button onClick={onNext} style={{
          padding: '9px 16px', borderRadius: 7, border: `1px solid ${C.green}44`,
          background: '#073a12', cursor: 'pointer', fontSize: 13, color: C.green,
          fontWeight: 600,
        }}>
          Next day →
        </button>
      )}
    </div>
  )
}

// ─── Tiny button factory ──────────────────────────────────────────────────────
function btn(
  bg: string,
  border: string,
  color = C.gray,
  primary = false,
): React.CSSProperties {
  return {
    padding: '10px 16px', borderRadius: 8,
    border: `1px solid ${border}`,
    background: bg, cursor: 'pointer',
    fontSize: 13, fontWeight: primary ? 600 : 400,
    color, textAlign: 'left' as const,
  }
}
