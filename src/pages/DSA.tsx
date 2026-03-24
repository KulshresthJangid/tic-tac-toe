import { useState, useEffect } from 'react'
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
   Dashboard data
════════════════════════════════════════════════════════════════════ */

const DAILY_BLOCKS = [
  {
    num: 'B1',
    title: 'DSA',
    time: '1.5–2h',
    rule: '1 problem max. Brute force first → optimise → write complexity + edge cases.',
    note: 'High focus. Do this first.',
  },
  {
    num: 'B2',
    title: 'Input',
    time: '1–1.5h',
    rule: '1 deep article. Connect it: caching → hashmap, message queues → heap.',
    note: 'Bridge DSA to real systems.',
  },
  {
    num: 'B3',
    title: 'Build',
    time: '2–4h',
    rule: '1 feature that visibly uses a DSA concept. Rate limiter → sliding window. Feed → heap.',
    note: 'Every system must use DSA.',
  },
  {
    num: 'B4',
    title: 'Output',
    time: '1h',
    rule: 'Write 1 insight bridging DSA + production. "Heaps in notification systems" = rare = brand.',
    note: 'Ship the content.',
  },
  {
    num: 'B5',
    title: 'Review',
    time: '30m',
    rule: 'Log: pattern learned, where stuck, did you understand the optimisation or memorise it?',
    note: 'Honest only.',
  },
]

type PatternStatus = 'locked' | 'learning' | 'mastered'

const PATTERNS = [
  { id: 'arrays',        label: 'Arrays',               phase: 1 },
  { id: 'strings',       label: 'Strings',              phase: 1 },
  { id: 'hashing',       label: 'Hashing',              phase: 1 },
  { id: 'two-ptr',       label: 'Two Pointers',         phase: 1 },
  { id: 'sliding-w',     label: 'Sliding Window',       phase: 1 },
  { id: 'stack',         label: 'Stack',                phase: 2 },
  { id: 'queue',         label: 'Queue',                phase: 2 },
  { id: 'linked-list',   label: 'Linked List',          phase: 2 },
  { id: 'recursion',     label: 'Recursion',            phase: 2 },
  { id: 'binary-search', label: 'Binary Search',        phase: 2 },
  { id: 'bin-tree',      label: 'Binary Trees',         phase: 3 },
  { id: 'bst',           label: 'BST',                  phase: 3 },
  { id: 'dfs',           label: 'DFS',                  phase: 3 },
  { id: 'bfs',           label: 'BFS',                  phase: 3 },
  { id: 'graph',         label: 'Graph Traversal',      phase: 3 },
  { id: 'heap',          label: 'Heap / Priority Queue',phase: 4 },
  { id: 'backtrack',     label: 'Backtracking',         phase: 4 },
  { id: 'dp',            label: 'Dynamic Programming',  phase: 4 },
]

const PHASE_LABELS = [
  'Phase 1 · Foundations (Weeks 1–3)',
  'Phase 2 · Core Structures (Weeks 4–7)',
  'Phase 3 · Trees & Graphs (Weeks 8–13)',
  'Phase 4 · Advanced (Weeks 14–19)',
]

const SYSTEM_BRIDGE = [
  { system: 'Chat message ordering',     pattern: 'Queue / Heap',      why: 'FIFO delivery, priority by timestamp' },
  { system: 'Deduplication engine',      pattern: 'Hashing',           why: 'O(1) lookup for seen IDs' },
  { system: 'Rate limiter',              pattern: 'Sliding Window',    why: 'Queue + timestamps define the window' },
  { system: 'Feed ranking / Top-k',      pattern: 'Heap',              why: 'Min-heap of k elements in O(n log k)' },
  { system: 'LRU Cache',                 pattern: 'HashMap + DLL',     why: 'O(1) get and O(1) eviction' },
  { system: 'Route / path finding',      pattern: 'BFS / Graph',       why: 'Shortest path in unweighted graph' },
  { system: 'Task scheduler',            pattern: 'Priority Queue',    why: 'Pop min/max priority in O(log n)' },
  { system: 'Autocomplete / search',     pattern: 'Trie',              why: 'Prefix match in O(m)' },
  { system: 'Matching / recommendation', pattern: 'Graph DFS',         why: 'Connected component traversal' },
  { system: 'Leaderboard',               pattern: 'Heap / BST',        why: 'Ranked insertion + range queries' },
]

/* ════════════════════════════════════════════════════════════════════
   Dashboard components
════════════════════════════════════════════════════════════════════ */

function DailyTracker() {
  const today = new Date().toISOString().slice(0, 10)
  const blockKey  = `dsa_blocks_${today}`
  const datesKey  = 'dsa_completed_dates'

  const [checked, setChecked] = useState<boolean[]>(() => {
    try { return JSON.parse(localStorage.getItem(blockKey) || 'null') ?? Array(5).fill(false) }
    catch { return Array(5).fill(false) }
  })

  const [streak, setStreak] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem(blockKey, JSON.stringify(checked))
      const dates: string[] = JSON.parse(localStorage.getItem(datesKey) || '[]')
      if (checked.every(Boolean) && !dates.includes(today)) {
        dates.push(today)
        localStorage.setItem(datesKey, JSON.stringify(dates))
      }
      let s = 0
      const d = new Date()
      for (let i = 0; i < 365; i++) {
        if (dates.includes(d.toISOString().slice(0, 10))) { s++; d.setDate(d.getDate() - 1) }
        else break
      }
      setStreak(s)
    } catch {}
  }, [checked, blockKey, today, datesKey])

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))

  const done = checked.filter(Boolean).length

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: C.whiteOff, letterSpacing: '-0.01em' }}>
            Today's System
          </h2>
          <p style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, marginTop: '0.2rem' }}>
            {today} · {done}/5 blocks complete · repeat 90 days
          </p>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { val: streak,                              label: 'day streak',   col: streak > 0 ? C.white : C.grayDeep },
            { val: `${Math.round((done / 5) * 100)}%`, label: 'today',        col: done === 5 ? C.white : C.gray },
          ].map(({ val, label, col }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: col, lineHeight: 1 }}>
                {val}
              </div>
              <div style={{ fontSize: '0.58rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, letterSpacing: '0.13em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: C.border, borderRadius: 1, marginBottom: '1.25rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(done / 5) * 100}%`, background: C.white, transition: 'width 0.35s ease' }} />
      </div>

      {/* Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {DAILY_BLOCKS.map((block, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{
              display: 'grid',
              gridTemplateColumns: '20px 80px 1fr',
              alignItems: 'start',
              gap: '1rem',
              padding: '0.85rem 1.1rem',
              background: checked[i] ? 'rgba(255,255,255,0.025)' : C.surface,
              border: `1px solid ${checked[i] ? 'rgba(255,255,255,0.1)' : C.border}`,
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.18s',
              userSelect: 'none',
            }}
          >
            {/* Checkbox */}
            <div style={{
              width: 15, height: 15,
              border: `1px solid ${checked[i] ? C.white : C.grayDeep}`,
              borderRadius: 2,
              background: checked[i] ? C.white : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              marginTop: 3, flexShrink: 0,
            }}>
              {checked[i] && <span style={{ color: C.bg, fontSize: '0.6rem', fontWeight: 900, lineHeight: 1 }}>✓</span>}
            </div>

            {/* Badge */}
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', fontWeight: 700, color: checked[i] ? C.grayDim : C.white, display: 'block' }}>
                {block.num} · {block.title}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', color: C.grayDeep }}>
                {block.time}
              </span>
            </div>

            {/* Rule */}
            <div style={{ fontSize: '0.78rem', color: checked[i] ? C.grayDeep : C.gray, lineHeight: 1.55, textDecoration: checked[i] ? 'line-through' : 'none', textDecorationColor: C.grayDeep }}>
              {block.rule}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PatternMastery() {
  const storageKey = 'dsa_pattern_status'
  const [statuses, setStatuses] = useState<Record<string, PatternStatus>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}') }
    catch { return {} }
  })

  const cycle = (id: string) => {
    const order: PatternStatus[] = ['locked', 'learning', 'mastered']
    const current = (statuses[id] ?? 'locked') as PatternStatus
    const next = order[(order.indexOf(current) + 1) % 3]
    const updated = { ...statuses, [id]: next }
    setStatuses(updated)
    try { localStorage.setItem(storageKey, JSON.stringify(updated)) } catch {}
  }

  const masteredCount = PATTERNS.filter((p) => statuses[p.id] === 'mastered').length
  const learningCount = PATTERNS.filter((p) => statuses[p.id] === 'learning').length

  const tagStyle = (status: PatternStatus): React.CSSProperties => {
    if (status === 'mastered') return { border: `1px solid ${C.white}`,    color: C.white,    background: 'rgba(255,255,255,0.07)' }
    if (status === 'learning') return { border: `1px solid ${C.gray}`,     color: C.gray,     background: 'rgba(255,255,255,0.02)' }
    return                             { border: `1px solid ${C.border}`,  color: C.grayDeep, background: C.surface }
  }

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: C.whiteOff, letterSpacing: '-0.01em' }}>
            Pattern Mastery
          </h2>
          <p style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, marginTop: '0.2rem' }}>
            Click to cycle: locked → learning → mastered
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[
            { val: masteredCount,                                           label: 'mastered', col: C.white    },
            { val: learningCount,                                           label: 'learning', col: C.gray     },
            { val: PATTERNS.length - masteredCount - learningCount,        label: 'locked',   col: C.grayDeep },
          ].map(({ val, label, col }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.4rem', fontWeight: 700, color: col, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '0.58rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: C.border, borderRadius: 1, marginBottom: '1.5rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(masteredCount / PATTERNS.length) * 100}%`, background: C.white, transition: 'width 0.35s ease' }} />
      </div>

      {[1, 2, 3, 4].map((phase, pi) => (
        <div key={phase} style={{ marginBottom: '1.1rem' }}>
          <div style={{ fontSize: '0.58rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.55rem' }}>
            {PHASE_LABELS[pi]}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {PATTERNS.filter((p) => p.phase === phase).map((p) => {
              const status = (statuses[p.id] ?? 'locked') as PatternStatus
              return (
                <button
                  key={p.id}
                  onClick={() => cycle(p.id)}
                  style={{
                    ...tagStyle(status),
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '0.3rem 0.7rem',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {status === 'mastered' ? '✓ ' : status === 'learning' ? '◐ ' : '○ '}
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function SystemDSABridge() {
  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: C.whiteOff, letterSpacing: '-0.01em', marginBottom: '0.3rem' }}>
        System → DSA Bridge
      </h2>
      <p style={{ fontSize: '0.78rem', color: C.grayDim, marginBottom: '1.25rem', fontWeight: 400, lineHeight: 1.6 }}>
        Every system you build must visibly use a DSA concept. This is what separates you from engineers who only grind LeetCode.
      </p>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.74rem' }}>
          <thead>
            <tr>
              {['System', 'DSA Pattern', 'Why'].map((h) => (
                <th key={h} style={{ background: '#0d0d0d', color: C.grayDim, padding: '0.65rem 1rem', textAlign: 'left', borderBottom: `1px solid ${C.border}`, fontSize: '0.58rem', letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 700 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SYSTEM_BRIDGE.map((row, i) => (
              <tr key={i} style={{ borderBottom: i < SYSTEM_BRIDGE.length - 1 ? `1px solid ${C.border}` : 'none' }}
                className="hover:bg-[#0f0f0f] transition-colors"
              >
                <td style={{ padding: '0.65rem 1rem', color: C.whiteOff, fontWeight: 600 }}>{row.system}</td>
                <td style={{ padding: '0.65rem 1rem', color: C.gray }}>{row.pattern}</td>
                <td style={{ padding: '0.65rem 1rem', color: C.grayDim }}>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
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

        {/* ── SELF-LEARNING DASHBOARD ───────────────────────────────── */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '2.5rem', paddingBottom: '1rem', borderBottom: `1px solid ${C.border}` }}>
            // Self-Learning Dashboard — DSA is not optional
          </div>
          <DailyTracker />
          <PatternMastery />
          <SystemDSABridge />
        </div>

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
