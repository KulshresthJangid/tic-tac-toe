import { usePageMeta } from '../hooks/usePageMeta'
import { dsaTopics } from '../data/dsa'
import type { DSATopic, DSAProblem, CellStyle } from '../data/dsa'

/* ─── Design tokens ─────────────────────────────────────────────── */
const C = {
  bg: '#000',
  surface: '#0a0a0a',
  surface2: '#111',
  border: '#1c1c1c',
  borderMid: '#2a2a2a',
  white: '#fff',
  whiteOff: '#e8e8e8',
  gray: '#888',
  grayDim: '#555',
  grayDeep: '#333',
  muted: '#444',
} as const

/* ─── Cell colour helper ─────────────────────────────────────────── */
const cellColor = (s: CellStyle) => {
  if (s === 'bright') return C.whiteOff
  if (s === 'mid') return C.gray
  if (s === 'dim') return C.grayDeep
  return '#9a9a9a'
}

/* ─── Difficulty palette ─────────────────────────────────────────── */
const diffPalette = {
  easy: { border: '#fff', tag: '#fff', tagBg: 'rgba(255,255,255,0.06)', topBorder: '#fff' },
  medium: { border: '#666', tag: '#888', tagBg: 'rgba(255,255,255,0.03)', topBorder: '#666' },
  hard: { border: '#333', tag: '#444', tagBg: 'rgba(255,255,255,0.02)', topBorder: '#333' },
}

/* ─── Number box styles ──────────────────────────────────────────── */
const numBoxStyle = (style: DSATopic['numStyle']): React.CSSProperties => {
  if (style === 'solid')
    return {
      background: '#fff',
      color: '#000',
      border: '1px solid #fff',
    }
  if (style === 'outline')
    return {
      background: 'transparent',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.4)',
    }
  return {
    background: '#141414',
    color: '#5a5a5a',
    border: '1px solid #222',
  }
}

/* ─── Roadmap ────────────────────────────────────────────────────── */
const phases = [
  { num: 'Phase 1 · Weeks 1–3', title: 'Foundations', detail: 'Arrays, Strings, Hashing, Stacks & Queues' },
  { num: 'Phase 2 · Weeks 4–6', title: 'Linear Structures', detail: 'Linked Lists, Recursion, Sorting, Searching' },
  { num: 'Phase 3 · Weeks 7–9', title: 'Trees & Heaps', detail: 'BST, Trees, Heaps, Tries, Segment Trees' },
  { num: 'Phase 4 · Weeks 10–12', title: 'Advanced', detail: 'Graphs, DP, Greedy, Backtracking, Bit Manip' },
]

/* ─── TOC ────────────────────────────────────────────────────────── */
const tocTitles = [
  'Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues', 'Hashing', 'Recursion',
  'Sorting', 'Searching', 'Trees', 'BST', 'Heaps', 'Graphs',
  'Dynamic Programming', 'Greedy', 'Backtracking', 'Tries', 'Segment Trees', 'Bit Manipulation',
]

/* ════════════════════════════════════════════════════════════════════
   Sub-components
════════════════════════════════════════════════════════════════════ */

function ProblemCard({ p }: { p: DSAProblem }) {
  const pal = diffPalette[p.difficulty]
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${pal.topBorder}`,
        borderRadius: 6,
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      className="group hover:-translate-y-0.5"
    >
      {/* Header */}
      <div
        style={{ padding: '1rem 1.25rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}
      >
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: C.whiteOff }}>{p.name}</span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.22rem 0.55rem',
            borderRadius: 2,
            border: `1px solid ${pal.tag}`,
            color: pal.tag,
            background: pal.tagBg,
            flexShrink: 0,
          }}
        >
          {p.difficulty}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '0 1.25rem 1rem' }}>
        <p style={{ fontSize: '0.83rem', color: C.gray, marginBottom: '0.75rem', fontWeight: 400, lineHeight: 1.6 }}>
          {p.desc}
        </p>

        {/* Example */}
        <pre
          style={{
            background: '#050505',
            border: `1px solid ${C.border}`,
            borderRadius: 4,
            padding: '0.7rem 0.9rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.7rem',
            color: '#787878',
            marginBottom: '0.75rem',
            lineHeight: 1.7,
            overflowX: 'auto',
            whiteSpace: 'pre',
          }}
        >
          {p.example}
        </pre>

        {/* Approach */}
        <div style={{ fontSize: '0.62rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.3rem' }}>
          Approach
        </div>
        <div style={{ fontSize: '0.82rem', color: '#c4c4c4', fontWeight: 400, lineHeight: 1.6 }}>
          {p.approach}
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', padding: '0.18rem 0.55rem', borderRadius: 2, border: `1px solid ${C.borderMid}`, color: C.gray }}>
            Time: {p.time}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', padding: '0.18rem 0.55rem', borderRadius: 2, border: `1px solid ${C.borderMid}`, color: C.grayDim }}>
            Space: {p.space}
          </span>
        </div>
      </div>
    </div>
  )
}

function ComplexityTable({ table }: { table: NonNullable<DSATopic['complexityTable']> }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.75rem',
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr>
            {table.headers.map((h) => (
              <th
                key={h}
                style={{
                  background: '#0d0d0d',
                  color: C.grayDim,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontSize: '0.62rem',
                  padding: '0.7rem 1rem',
                  textAlign: 'left',
                  borderBottom: `1px solid ${C.border}`,
                  fontWeight: 700,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: `1px solid ${C.border}` }}
              className="hover:bg-[#0f0f0f] transition-colors"
            >
              {row.cells.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: '0.55rem 1rem',
                    color: cellColor(row.styles[ci]),
                    borderBottom: ri === table.rows.length - 1 ? 'none' : `1px solid ${C.border}`,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TopicSection({ topic }: { topic: DSATopic }) {
  return (
    <>
      <section id={topic.id} style={{ marginBottom: '5.5rem', scrollMarginTop: '5rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1.25rem',
            marginBottom: '1.75rem',
            paddingBottom: '1.5rem',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              ...numBoxStyle(topic.numStyle),
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.62rem',
              fontWeight: 700,
              padding: '0.28rem 0.5rem',
              borderRadius: 2,
              minWidth: 40,
              textAlign: 'center',
              marginTop: '0.45rem',
              flexShrink: 0,
              letterSpacing: '0.05em',
            }}
          >
            {topic.num}
          </div>
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: C.whiteOff,
              }}
            >
              {topic.title}
            </h2>
            <p style={{ fontSize: '0.85rem', color: C.gray, marginTop: '0.35rem', fontWeight: 400 }}>
              {topic.subtitle}
            </p>
          </div>
        </div>

        {/* Concepts box */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: '1.4rem 1.75rem',
            marginBottom: '1.75rem',
          }}
        >
          <h3
            style={{
              fontSize: '0.62rem',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: C.grayDim,
              marginBottom: '1rem',
              fontWeight: 700,
            }}
          >
            // Core Concepts
          </h3>
          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.4rem',
              listStyle: 'none',
            }}
          >
            {topic.concepts.map((c) => (
              <li
                key={c}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  fontSize: '0.83rem',
                  color: '#bbb',
                  padding: '0.3rem 0',
                }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.65rem',
                    color: C.gray,
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Optional complexity table */}
        {topic.complexityTable && <ComplexityTable table={topic.complexityTable} />}

        {/* Problems grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {topic.problems.map((p) => (
            <ProblemCard key={p.name} p={p} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: '5.5rem' }} />
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════
   Main Page
════════════════════════════════════════════════════════════════════ */
export default function DSA() {
  usePageMeta(
    'DSA Master Guide — Data Structures & Algorithms',
    '18 topics, 54 problems. Every concept, pattern, and approach for data structures & algorithms — Easy, Medium, Hard.',
  )

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.whiteOff }}>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          padding: '6rem 2rem 4rem',
          background: 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 65%)',
        }}
      >
        {/* Grid overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 20%, transparent 75%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 860 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.gray,
              border: `1px solid ${C.borderMid}`,
              padding: '0.32rem 0.9rem',
              borderRadius: 2,
              marginBottom: '2.25rem',
            }}
          >
            Complete Reference Guide · 2024
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 9vw, 7rem)',
              fontWeight: 800,
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              marginBottom: '1.5rem',
              color: C.white,
            }}
          >
            Data Structures
            <br />
            <span style={{ color: C.gray }}>&amp;</span>{' '}
            <span style={{ color: C.whiteOff }}>Algorithms</span>
            <br />
            <span style={{ color: C.grayDim }}>Master Guide</span>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: C.grayDim,
              maxWidth: 560,
              margin: '0 auto 3rem',
              fontWeight: 400,
              lineHeight: 1.7,
            }}
          >
            Every concept. Every pattern. Easy → Medium → Hard problems for each topic.
            Zero fluff, maximum depth.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { num: '18', label: 'Topics' },
              { num: '54', label: 'Problems' },
              { num: '100+', label: 'Concepts' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    color: C.white,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: C.grayDim,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOC ───────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          padding: '3rem 2rem',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: C.grayDim,
              marginBottom: '1.5rem',
            }}
          >
            // Table of Contents
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '0.6rem',
            }}
          >
            {dsaTopics.map((t, i) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  padding: '0.65rem 0.9rem',
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 4,
                  textDecoration: 'none',
                  color: '#bbb',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  transition: 'all 0.15s',
                }}
                className="hover:!border-white/30 hover:!text-white hover:-translate-y-px"
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    color: C.grayDeep,
                    minWidth: 22,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {tocTitles[i]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1.5rem' }}>

        {/* Roadmap */}
        <div
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: '1.75rem',
            marginBottom: '5rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.015), rgba(255,255,255,0.005))',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              marginBottom: '1.25rem',
              color: C.whiteOff,
              letterSpacing: '-0.01em',
            }}
          >
            Suggested Learning Roadmap
          </h2>
          <div
            style={{
              display: 'flex',
              gap: 0,
              overflow: 'hidden',
              borderRadius: 4,
              border: `1px solid ${C.border}`,
              flexWrap: 'wrap',
            }}
          >
            {phases.map((ph, i) => (
              <div
                key={i}
                style={{
                  flex: '1 1 150px',
                  padding: '1rem 1.1rem',
                  borderRight: i < phases.length - 1 ? `1px solid ${C.border}` : 'none',
                  background: C.surface,
                }}
              >
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    color: C.grayDeep,
                    marginBottom: '0.25rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {ph.num}
                </div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.85rem', color: C.white }}>
                  {ph.title}
                </div>
                <div style={{ color: C.gray, fontSize: '0.73rem', fontWeight: 400 }}>{ph.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Topics */}
        {dsaTopics.map((topic) => (
          <TopicSection key={topic.id} topic={topic} />
        ))}
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          borderTop: `1px solid ${C.border}`,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.68rem',
          color: C.grayDeep,
          lineHeight: 2,
          background: C.surface,
        }}
      >
        <div style={{ fontSize: '1.4rem', marginBottom: '0.5rem', opacity: 0.4 }}>⬡</div>
        DSA MASTER GUIDE · 18 TOPICS · 54 PROBLEMS
        <br />
        <span style={{ color: C.gray }}>Easy</span>
        {' · '}
        <span style={{ color: C.grayDim }}>Medium</span>
        {' · '}
        <span style={{ color: C.grayDeep }}>Hard</span>
        <br />
        <br />
        Practice daily. Trust the process. Ship the code.
      </footer>
    </div>
  )
}
