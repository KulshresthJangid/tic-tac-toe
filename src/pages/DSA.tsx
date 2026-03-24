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
   Dashboard data — Atomic Learning Units
════════════════════════════════════════════════════════════════════ */

// Status: 0=Not started | 1=Learning | 2=Implemented | 3=Explained publicly
// Confidence: 3=saw solution | 5=understood | 7=can solve again | 9=can teach | 10=used in prod
type UnitStatus = 0 | 1 | 2 | 3
type UnitRecord = { status: UnitStatus; confidence: number }

interface AtomicUnit {
  id: string
  unit: string
  category: 'DSA' | 'Backend' | 'System'
  resource: string
  task: string
  proof: string
  phase: 1 | 2 | 3
  system: string // real-world connection
}

const ATOMIC_UNITS: AtomicUnit[] = [
  /* ── Phase 1 · Foundations (Weeks 1–3) ── */
  // DSA
  { id: 'arr-basics',       unit: 'Array basics & prefix sums',              category: 'DSA',     phase: 1, resource: 'NeetCode Arrays + LC #303, #560',                                task: 'Solve prefix sum, subarray sum equals k, range queries',   proof: 'GitHub commit with 3 solutions + complexity notes', system: 'Leaderboard range queries, analytics aggregation'        },
  { id: 'two-ptr',          unit: 'Two pointers',                            category: 'DSA',     phase: 1, resource: 'NeetCode Two Pointers + LC #167, #15, #11',                      task: 'Solve container water, 3Sum, sorted pair sum',             proof: 'GitHub commit with 3 solutions',                           system: 'Deduplication, collision detection'                      },
  { id: 'sliding-window',   unit: 'Sliding window (variable & fixed)',       category: 'DSA',     phase: 1, resource: 'NeetCode Sliding Window + LC #3, #76, #239',                     task: 'Solve longest substring, min window, max sliding window',  proof: 'GitHub commit with 3 solutions + pattern explanation',     system: 'Rate limiter (sliding window counter), stream analytics'  },
  { id: 'hashing',          unit: 'Hash maps & sets — O(1) lookup',         category: 'DSA',     phase: 1, resource: 'NeetCode Hashing + LC #1, #217, #49',                            task: 'Solve two sum, contains duplicate, group anagrams',        proof: 'GitHub commit',                                            system: 'Dedup engine, session store, cache lookup'               },
  { id: 'strings',          unit: 'String manipulation & encoding',          category: 'DSA',     phase: 1, resource: 'NeetCode Strings + LC #242, #125, #271',                         task: 'Solve valid anagram, palindrome check, encode/decode strs', proof: 'GitHub commit',                                            system: 'URL slugs, token parsing, search indexing'               },
  // Backend
  { id: 'http-basics',      unit: 'HTTP — methods, status codes, headers',  category: 'Backend', phase: 1, resource: 'MDN HTTP docs + "HTTP: The Definitive Guide" ch.1–3',            task: 'Map all 2xx/4xx/5xx codes to real scenarios, build demo',  proof: 'Written explanation post + code snippet',                  system: 'Every REST API you build'                                },
  { id: 'rest-design',      unit: 'REST API design — resources & verbs',    category: 'Backend', phase: 1, resource: 'REST API Design Rulebook (ch.1–4) + stripe.com/docs reference',  task: 'Design + implement a CRUD API with proper status codes',   proof: 'GitHub repo with documented routes',                       system: 'Every service boundary you design'                       },
  { id: 'middleware',       unit: 'Express middleware & request pipeline',   category: 'Backend', phase: 1, resource: 'Express.js official docs (middleware guide)',                    task: 'Build: auth middleware, logging, error handler, rate limit', proof: 'GitHub repo middleware stack',                             system: 'Request lifecycle of every Node.js service'             },
  // System
  { id: 'client-server',   unit: 'Client-server model & TCP/IP basics',    category: 'System',  phase: 1, resource: 'CS75 Harvard lecture 0, Tanenbaum Networks ch.1',                task: 'Trace a browser request → response with all layers',       proof: 'Written diagram + explanation post',                       system: 'Debugging latency, tracing slow API calls'               },
  { id: 'latency',         unit: 'Latency numbers every engineer must know', category: 'System',  phase: 1, resource: 'jeffdean latency numbers + "Designing Data-Intensive Apps" ch.1',task: 'Build benchmark comparing cache hit vs DB vs network round-trip', proof: 'Before/after latency table',                          system: 'Every performance optimisation decision'                 },

  /* ── Phase 2 · Core Structures (Weeks 4–7) ── */
  // DSA
  { id: 'stack',            unit: 'Stack — LIFO applications',               category: 'DSA',     phase: 2, resource: 'NeetCode Stack + LC #20, #155, #739',                            task: 'Solve valid parentheses, min stack, daily temperatures',   proof: 'GitHub commit + complexity table',                         system: 'Undo/redo, call stack, expression evaluator'            },
  { id: 'queue',            unit: 'Queue & deque — FIFO applications',       category: 'DSA',     phase: 2, resource: 'NeetCode Queue + LC #225, #232, #239',                           task: 'Implement stack using queue, sliding window maximum',      proof: 'GitHub commit',                                            system: 'Message broker, job queue, BFS traversal'               },
  { id: 'binary-search',   unit: 'Binary search — sorted search space',     category: 'DSA',     phase: 2, resource: 'NeetCode Binary Search + LC #704, #33, #875',                   task: 'Solve search array, rotated array, koko eating bananas',   proof: 'GitHub commit + "search space" explanation',              system: 'Config lookups, sorted index scans'                     },
  { id: 'linked-list',     unit: 'Linked list — traversal & mutation',      category: 'DSA',     phase: 2, resource: 'NeetCode Linked List + LC #206, #21, #141',                     task: 'Solve reverse LL, merge sorted, detect cycle',             proof: 'GitHub commit with diagrams',                              system: 'LRU cache (DLL), OS memory allocator'                   },
  { id: 'recursion',       unit: 'Recursion & recursion-to-iteration',       category: 'DSA',     phase: 2, resource: 'NeetCode Recursion + LC #344, #21, #98',                        task: 'Solve reverse string, fibonacci, validate BST recursively', proof: 'GitHub commit + iterative equivalent for each',           system: 'Tree traversal, parser implementation'                  },
  // Backend
  { id: 'jwt-auth',        unit: 'Authentication — JWT + session trade-offs', category: 'Backend', phase: 2, resource: 'jwt.io docs + Auth0 "JWT best practices" article',             task: 'Implement login → JWT issue → protected route middleware',  proof: 'GitHub repo + written comparison (JWT vs session)',        system: 'Every app with user accounts'                           },
  { id: 'websockets',      unit: 'WebSockets — persistent connections',      category: 'Backend', phase: 2, resource: 'MDN WebSockets API + Socket.io docs (core concepts)',           task: 'Build a real-time counter or chat using raw WS + Socket.io', proof: 'GitHub repo + latency comparison (poll vs push)',         system: 'Live feeds, notifications, collaborative editors'        },
  // System
  { id: 'load-balancing',  unit: 'Load balancing — algorithms & trade-offs', category: 'System',  phase: 2, resource: 'DDIA ch.5 + Nginx load balancing docs',                        task: 'Simulate round-robin vs least-connections with 3 workers', proof: 'Written comparison post + demo repo',                      system: 'Every horizontally scaled service'                      },
  { id: 'caching',         unit: 'Caching — strategies, eviction, Redis',    category: 'System',  phase: 2, resource: 'DDIA "Caching" section + Redis docs (data structures)',         task: 'Add cache layer to existing API, measure latency diff',    proof: 'Before/after latency comparison in README',               system: 'Feed ranking, session store, rate limiting'             },

  /* ── Phase 3 · Trees, Graphs & Advanced (Weeks 8–12) ── */
  // DSA
  { id: 'dfs-recursive',   unit: 'Binary tree DFS — recursive',             category: 'DSA',     phase: 3, resource: 'NeetCode Trees + LC #104, #226, #543',                          task: 'Solve tree height, invert tree, diameter of tree',         proof: 'GitHub commit + hand-trace diagram',                       system: 'File system traversal, DOM manipulation'                },
  { id: 'dfs-iterative',   unit: 'Binary tree DFS — iterative (explicit stack)', category: 'DSA', phase: 3, resource: 'LC #144, #94, #145 iterative solutions',                      task: 'Re-implement all 3 traversals without recursion',          proof: 'GitHub commit with side-by-side recursive vs iterative',   system: 'Production parsers avoid stack overflow risk'           },
  { id: 'bfs-queue',       unit: 'BFS using queue — level-order traversal', category: 'DSA',     phase: 3, resource: 'NeetCode Trees + LC #102, #199, #107',                          task: 'Solve level order, right side view, zigzag level order',   proof: 'GitHub commit',                                            system: 'Social graph distance, peer discovery'                  },
  { id: 'lca',             unit: 'Lowest Common Ancestor',                  category: 'DSA',     phase: 3, resource: 'LC #235, #236',                                                 task: 'Solve LCA in BST and in binary tree',                      proof: 'GitHub commit with two approaches annotated',              system: 'Permission hierarchy, org chart queries'                },
  { id: 'graph-bfs-dfs',   unit: 'Graph traversal — BFS & DFS on adj list', category: 'DSA',     phase: 3, resource: 'NeetCode Graphs + LC #200, #133, #695',                        task: 'Solve number of islands, clone graph, max area island',    proof: 'GitHub commit + visited-tracking explanation',             system: 'Dependency resolution, social network features'         },
  { id: 'heap-topk',       unit: 'Heap / priority queue — top-k pattern',  category: 'DSA',     phase: 3, resource: 'NeetCode Heap + LC #703, #215, #347',                           task: 'Solve kth largest stream, kth largest array, top k freq',  proof: 'GitHub commit + heap invariant explanation',               system: 'Feed ranking, leaderboard, task scheduler'             },
  // Backend
  { id: 'message-queues',  unit: 'Message queues — async decoupling',       category: 'Backend', phase: 3, resource: 'RabbitMQ "Hello World" tutorial + BullMQ docs (core concepts)', task: 'Build producer → queue → consumer with retry on failure',  proof: 'GitHub repo + written explanation of when to use queues', system: 'Email delivery, webhook retry, background jobs'         },
  { id: 'event-driven',    unit: 'Event-driven architecture — pub/sub',     category: 'Backend', phase: 3, resource: 'Martin Fowler "Event-Driven Architecture" article + DDIA ch.11', task: 'Refactor a direct service call into an event-based flow',  proof: 'GitHub PR with before/after + written trade-off analysis', system: 'Order processing, audit logs, microservice boundaries'  },
  // System
  { id: 'consistency',     unit: 'Consistency models — strong vs eventual', category: 'System',  phase: 3, resource: 'DDIA ch.5 "Replication" + Kyle Kingsbury "Jepsen" blog',         task: 'Write a concrete failure scenario for each consistency model', proof: 'Written post: "Which consistency model for which system"', system: 'Distributed DB design, cache invalidation'             },
  { id: 'scaling',         unit: 'Scaling strategies — vertical vs horizontal', category: 'System', phase: 3, resource: 'DDIA ch.1 + highscalability.com case studies',               task: 'Design scale plan for: 1K, 10K, 100K RPS for an API',     proof: 'Architecture diagram + written trade-off explanation',     system: 'Every service that needs to grow'                       },
]

const PHASE_LABELS = [
  'Phase 1 · Foundations (Weeks 1–3)',
  'Phase 2 · Core Structures (Weeks 4–7)',
  'Phase 3 · Advanced (Weeks 8–12)',
]

const STATUS_LABELS: Record<UnitStatus, string> = {
  0: 'Not started',
  1: 'Learning',
  2: 'Implemented',
  3: 'Explained publicly',
}

const STATUS_COLORS: Record<UnitStatus, { border: string; color: string; bg: string }> = {
  0: { border: '#1c1c1c', color: '#333',  bg: '#0a0a0a' },
  1: { border: '#444',    color: '#888',  bg: 'rgba(255,255,255,0.02)' },
  2: { border: '#666',    color: '#bbb',  bg: 'rgba(255,255,255,0.04)' },
  3: { border: '#fff',    color: '#fff',  bg: 'rgba(255,255,255,0.07)' },
}

const CONF_LABELS: Record<number, string> = {
  0: '—', 3: 'Saw solution', 5: 'Understood', 7: 'Can solve again', 9: 'Can teach', 10: 'Used in prod',
}

const CONF_STEPS = [0, 3, 5, 7, 9, 10]

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

/* ── DailyPlan — pick 3 atomic units for today, log output ─────── */
function DailyPlan() {
  const today = new Date().toISOString().slice(0, 10)
  const planKey   = `dsa_daily_plan_${today}`
  const datesKey  = 'dsa_completed_dates'

  type DayUnit = { id: string; github: string; note: string }
  const emptyPlan: DayUnit[] = Array(3).fill(null).map(() => ({ id: '', github: '', note: '' }))

  const [plan, setPlan] = useState<DayUnit[]>(() => {
    try { return JSON.parse(localStorage.getItem(planKey) || 'null') ?? emptyPlan }
    catch { return emptyPlan }
  })
  const [streak, setStreak] = useState(0)

  const save = (updated: DayUnit[]) => {
    setPlan(updated)
    try {
      localStorage.setItem(planKey, JSON.stringify(updated))
      const allFilled = updated.every((u) => u.id !== '')
      const dates: string[] = JSON.parse(localStorage.getItem(datesKey) || '[]')
      if (allFilled && !dates.includes(today)) {
        dates.push(today)
        localStorage.setItem(datesKey, JSON.stringify(dates))
      }
    } catch {}
  }

  useEffect(() => {
    try {
      const dates: string[] = JSON.parse(localStorage.getItem(datesKey) || '[]')
      let s = 0
      const d = new Date()
      for (let i = 0; i < 365; i++) {
        if (dates.includes(d.toISOString().slice(0, 10))) { s++; d.setDate(d.getDate() - 1) }
        else break
      }
      setStreak(s)
    } catch {}
  }, [today, datesKey])

  const filled = plan.filter((u) => u.id !== '').length

  // categories present in today's plan
  const coveredCats = new Set(plan.map((u) => ATOMIC_UNITS.find((a) => a.id === u.id)?.category).filter(Boolean))

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: C.whiteOff, letterSpacing: '-0.01em' }}>
            Today's 3 Units
          </h2>
          <p style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, marginTop: '0.2rem' }}>
            {today} · 3 units max per day · each 1–2h · ideal: 1 DSA + 1 Backend + 1 System
          </p>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { val: streak,         label: 'day streak', col: streak > 0 ? C.white : C.grayDeep },
            { val: `${filled}/3`,  label: 'today',      col: filled === 3 ? C.white : C.gray   },
          ].map(({ val, label, col }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: col, lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: '0.58rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, letterSpacing: '0.13em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: C.border, borderRadius: 1, marginBottom: '1.4rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${(filled / 3) * 100}%`, background: C.white, transition: 'width 0.35s ease' }} />
      </div>

      {/* Category coverage check */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {(['DSA', 'Backend', 'System'] as const).map((cat) => (
          <span key={cat} style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.62rem',
            padding: '0.2rem 0.6rem',
            borderRadius: 2,
            border: `1px solid ${coveredCats.has(cat) ? C.white : C.border}`,
            color: coveredCats.has(cat) ? C.white : C.grayDeep,
            background: coveredCats.has(cat) ? 'rgba(255,255,255,0.06)' : C.surface,
            transition: 'all 0.2s',
          }}>
            {coveredCats.has(cat) ? '✓ ' : '○ '}{cat}
          </span>
        ))}
        {!coveredCats.has('DSA') && !coveredCats.has('Backend') && !coveredCats.has('System') && (
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: C.grayDim }}>
            Cover all 3 categories for a balanced day
          </span>
        )}
      </div>

      {/* 3 unit slots */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {plan.map((slot, si) => {
          const selected = ATOMIC_UNITS.find((a) => a.id === slot.id)
          return (
            <div key={si} style={{
              border: `1px solid ${slot.id ? 'rgba(255,255,255,0.1)' : C.border}`,
              borderRadius: 5,
              background: slot.id ? 'rgba(255,255,255,0.02)' : C.surface,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* Slot header */}
              <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: slot.id ? `1px solid ${C.border}` : 'none' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', fontWeight: 700, color: C.grayDeep }}>
                  U{si + 1}
                </span>
                <select
                  value={slot.id}
                  onChange={(e) => {
                    const updated = plan.map((p, i) => i === si ? { ...p, id: e.target.value, github: '', note: '' } : p)
                    save(updated)
                  }}
                  style={{
                    background: '#050505',
                    border: `1px solid ${slot.id ? C.borderMid : C.border}`,
                    borderRadius: 3,
                    color: slot.id ? C.whiteOff : C.grayDeep,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.72rem',
                    padding: '0.3rem 0.5rem',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  <option value="">— pick a unit —</option>
                  {([1, 2, 3] as const).map((ph) => (
                    <optgroup key={ph} label={PHASE_LABELS[ph - 1]}>
                      {ATOMIC_UNITS.filter((u) => u.phase === ph).map((u) => (
                        <option key={u.id} value={u.id}>
                          [{u.category}] {u.unit}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                {selected && (
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.6rem',
                    padding: '0.18rem 0.5rem',
                    border: `1px solid ${C.borderMid}`,
                    borderRadius: 2,
                    color: selected.category === 'DSA' ? C.white : selected.category === 'Backend' ? C.gray : C.grayDim,
                    flexShrink: 0,
                  }}>
                    {selected.category}
                  </span>
                )}
              </div>

              {/* Unit detail */}
              {selected && (
                <div style={{ padding: '0.85rem 1rem 1rem' }}>
                  {/* Resource + task */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    {[
                      { label: 'Resource', val: selected.resource },
                      { label: 'Task',     val: selected.task     },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.3rem' }}>{label}</div>
                        <div style={{ fontSize: '0.75rem', color: C.gray, lineHeight: 1.55 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  {/* Proof hint */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.3rem' }}>Proof required</div>
                    <div style={{ fontSize: '0.75rem', color: C.gray, lineHeight: 1.55 }}>{selected.proof}</div>
                  </div>
                  {/* System connection */}
                  <div style={{ marginBottom: '1rem', padding: '0.5rem 0.75rem', background: '#050505', border: `1px solid ${C.border}`, borderRadius: 3 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: C.grayDim }}>System: </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: C.gray }}>{selected.system}</span>
                  </div>
                  {/* GitHub link + note inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.3rem' }}>GitHub commit / PR</div>
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        value={slot.github}
                        onChange={(e) => {
                          const updated = plan.map((p, i) => i === si ? { ...p, github: e.target.value } : p)
                          save(updated)
                        }}
                        style={{
                          width: '100%',
                          background: '#050505',
                          border: `1px solid ${slot.github ? C.borderMid : C.border}`,
                          borderRadius: 3,
                          color: C.whiteOff,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.7rem',
                          padding: '0.35rem 0.6rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.3rem' }}>What did you learn?</div>
                      <input
                        type="text"
                        placeholder="1 honest sentence"
                        value={slot.note}
                        onChange={(e) => {
                          const updated = plan.map((p, i) => i === si ? { ...p, note: e.target.value } : p)
                          save(updated)
                        }}
                        style={{
                          width: '100%',
                          background: '#050505',
                          border: `1px solid ${slot.note ? C.borderMid : C.border}`,
                          borderRadius: 3,
                          color: C.whiteOff,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.7rem',
                          padding: '0.35rem 0.6rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── AtomicUnitTracker — master sheet with status + confidence ──── */
function AtomicUnitTracker() {
  const storageKey = 'dsa_atomic_records'
  const [records, setRecords] = useState<Record<string, UnitRecord>>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}') }
    catch { return {} }
  })

  const [filter, setFilter] = useState<'all' | 'DSA' | 'Backend' | 'System'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const save = (updated: Record<string, UnitRecord>) => {
    setRecords(updated)
    try { localStorage.setItem(storageKey, JSON.stringify(updated)) } catch {}
  }

  const cycleStatus = (id: string) => {
    const current = (records[id]?.status ?? 0) as UnitStatus
    const next = ((current + 1) % 4) as UnitStatus
    save({ ...records, [id]: { ...records[id], status: next, confidence: records[id]?.confidence ?? 0 } })
  }

  const setConf = (id: string, conf: number) => {
    save({ ...records, [id]: { ...records[id], confidence: conf, status: records[id]?.status ?? 0 } })
  }

  const visible = filter === 'all' ? ATOMIC_UNITS : ATOMIC_UNITS.filter((u) => u.category === filter)

  const counts = {
    0: ATOMIC_UNITS.filter((u) => (records[u.id]?.status ?? 0) === 0).length,
    1: ATOMIC_UNITS.filter((u) => (records[u.id]?.status ?? 0) === 1).length,
    2: ATOMIC_UNITS.filter((u) => (records[u.id]?.status ?? 0) === 2).length,
    3: ATOMIC_UNITS.filter((u) => (records[u.id]?.status ?? 0) === 3).length,
  }

  const explained = counts[3]
  const progress = Math.round(((counts[1] * 0.33 + counts[2] * 0.66 + counts[3]) / ATOMIC_UNITS.length) * 100)

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: C.whiteOff, letterSpacing: '-0.01em' }}>
            Atomic Unit Tracker
          </h2>
          <p style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, marginTop: '0.2rem' }}>
            {ATOMIC_UNITS.length} units · each 1–2h · click status to advance · &lt;7 confidence = incomplete
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {([3, 2, 1, 0] as UnitStatus[]).map((s) => (
            <div key={s} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.3rem', fontWeight: 700, color: STATUS_COLORS[s].color, lineHeight: 1 }}>{counts[s]}</div>
              <div style={{ fontSize: '0.56rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>
                {STATUS_LABELS[s].split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: C.border, borderRadius: 1, marginBottom: '1.1rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: C.white, transition: 'width 0.35s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: C.grayDim }}>{progress}% weighted progress</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: explained > 0 ? C.gray : C.grayDeep }}>{explained} units explained publicly (brand-building)</span>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['all', 'DSA', 'Backend', 'System'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              fontWeight: 600,
              padding: '0.28rem 0.75rem',
              borderRadius: 2,
              border: `1px solid ${filter === f ? C.white : C.border}`,
              color: filter === f ? C.white : C.grayDim,
              background: filter === f ? 'rgba(255,255,255,0.06)' : C.surface,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {f === 'all' ? `all (${ATOMIC_UNITS.length})` : `${f} (${ATOMIC_UNITS.filter(u => u.category === f).length})`}
          </button>
        ))}
      </div>

      {/* Phase-grouped rows */}
      {([1, 2, 3] as const).map((phase, pi) => {
        const phaseUnits = visible.filter((u) => u.phase === phase)
        if (phaseUnits.length === 0) return null
        return (
          <div key={phase} style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.6rem' }}>
              {PHASE_LABELS[pi]}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {phaseUnits.map((unit) => {
                const rec = records[unit.id]
                const status = (rec?.status ?? 0) as UnitStatus
                const conf = rec?.confidence ?? 0
                const isExpanded = expandedId === unit.id
                const sc = STATUS_COLORS[status]

                return (
                  <div key={unit.id} style={{
                    border: `1px solid ${status > 0 ? sc.border : C.border}`,
                    borderRadius: 4,
                    background: sc.bg,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}>
                    {/* Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', cursor: 'pointer' }}
                      onClick={() => setExpandedId(isExpanded ? null : unit.id)}
                    >
                      {/* Unit name + category */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.58rem', padding: '0.12rem 0.4rem', border: `1px solid ${C.border}`, borderRadius: 2, color: C.grayDeep, flexShrink: 0 }}>
                          {unit.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: status > 0 ? sc.color : '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {unit.unit}
                        </span>
                      </div>

                      {/* Confidence score */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: conf >= 7 ? C.white : conf > 0 ? C.gray : C.grayDeep }}>
                          {conf > 0 ? `${conf}/10` : '—/10'}
                        </span>
                      </div>

                      {/* Status badge — click advances */}
                      <button
                        onClick={(e) => { e.stopPropagation(); cycleStatus(unit.id) }}
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.58rem',
                          fontWeight: 700,
                          padding: '0.18rem 0.55rem',
                          border: `1px solid ${sc.border}`,
                          borderRadius: 2,
                          color: sc.color,
                          background: sc.bg,
                          cursor: 'pointer',
                          letterSpacing: '0.05em',
                          flexShrink: 0,
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {status} · {STATUS_LABELS[status]}
                      </button>

                      {/* Expand arrow */}
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.65rem', color: C.grayDeep, flexShrink: 0 }}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div style={{ padding: '0 0.85rem 1rem', borderTop: `1px solid ${C.border}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.85rem', marginBottom: '1rem' }}>
                          {[
                            { label: 'Resource', val: unit.resource },
                            { label: 'Task',     val: unit.task     },
                            { label: 'Proof',    val: unit.proof    },
                            { label: 'System',   val: unit.system   },
                          ].map(({ label, val }) => (
                            <div key={label}>
                              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.3rem' }}>{label}</div>
                              <div style={{ fontSize: '0.75rem', color: C.gray, lineHeight: 1.55 }}>{val}</div>
                            </div>
                          ))}
                        </div>

                        {/* Confidence selector */}
                        <div>
                          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.5rem' }}>
                            Confidence — anything below 7 is incomplete
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {CONF_STEPS.map((c) => (
                              <button
                                key={c}
                                onClick={() => setConf(unit.id, c)}
                                style={{
                                  fontFamily: 'JetBrains Mono, monospace',
                                  fontSize: '0.65rem',
                                  fontWeight: conf === c ? 700 : 400,
                                  padding: '0.25rem 0.6rem',
                                  borderRadius: 2,
                                  border: `1px solid ${conf === c ? (c >= 7 ? C.white : C.gray) : C.border}`,
                                  color: conf === c ? (c >= 7 ? C.white : C.gray) : C.grayDeep,
                                  background: conf === c ? (c >= 7 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)') : C.surface,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                              >
                                {c === 0 ? '—' : `${c}`}
                                {c > 0 && <span style={{ color: C.grayDim, fontWeight: 400 }}> · {CONF_LABELS[c]}</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── WeeklyProgress — 15-20 units goal + proof output ─────────── */
function WeeklyProgress() {
  const weekKey = () => {
    const d = new Date()
    const day = d.getDay()
    const monday = new Date(d)
    monday.setDate(d.getDate() - ((day + 6) % 7))
    return `dsa_week_${monday.toISOString().slice(0, 10)}`
  }

  type WeekData = { unitsCompleted: number; systemBuilt: string; explanationUrl: string; proofUrl: string }
  const emptyWeek: WeekData = { unitsCompleted: 0, systemBuilt: '', explanationUrl: '', proofUrl: '' }

  const [week, setWeek] = useState<WeekData>(() => {
    try { return JSON.parse(localStorage.getItem(weekKey()) || 'null') ?? emptyWeek }
    catch { return emptyWeek }
  })

  const save = (updated: WeekData) => {
    setWeek(updated)
    try { localStorage.setItem(weekKey(), JSON.stringify(updated)) } catch {}
  }

  const pct = Math.min(100, Math.round((week.unitsCompleted / 15) * 100))
  const passed = week.unitsCompleted >= 15 && week.systemBuilt.trim() !== '' && week.explanationUrl.trim() !== ''

  return (
    <div style={{ marginBottom: '3.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: C.whiteOff, letterSpacing: '-0.01em' }}>
            Weekly Output
          </h2>
          <p style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color: C.grayDim, marginTop: '0.2rem' }}>
            15–20 units · 1 system built · 1 explanation shipped — all 3 must be true or week failed
          </p>
        </div>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '0.28rem 0.75rem',
          borderRadius: 2,
          border: `1px solid ${passed ? C.white : C.border}`,
          color: passed ? C.white : C.grayDim,
          background: passed ? 'rgba(255,255,255,0.06)' : C.surface,
        }}>
          {passed ? '✓ WEEK PASSED' : '○ INCOMPLETE'}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: C.border, borderRadius: 1, marginBottom: '1.4rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? C.white : C.gray, transition: 'width 0.35s ease' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.4rem' }}>
        {/* Units counter */}
        <div style={{ border: `1px solid ${week.unitsCompleted >= 15 ? 'rgba(255,255,255,0.15)' : C.border}`, borderRadius: 4, padding: '0.85rem 1rem', background: C.surface }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.5rem' }}>Units completed</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button onClick={() => save({ ...week, unitsCompleted: Math.max(0, week.unitsCompleted - 1) })}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', background: 'none', border: `1px solid ${C.border}`, color: C.gray, borderRadius: 2, width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>−</button>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.6rem', fontWeight: 700, color: week.unitsCompleted >= 15 ? C.white : C.gray, minWidth: 30, textAlign: 'center' }}>
              {week.unitsCompleted}
            </span>
            <button onClick={() => save({ ...week, unitsCompleted: Math.min(20, week.unitsCompleted + 1) })}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', background: 'none', border: `1px solid ${C.border}`, color: C.gray, borderRadius: 2, width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>+</button>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: C.grayDim }}>/ 15–20</span>
          </div>
        </div>

        {/* System built */}
        <div style={{ border: `1px solid ${week.systemBuilt.trim() ? 'rgba(255,255,255,0.12)' : C.border}`, borderRadius: 4, padding: '0.85rem 1rem', background: C.surface }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.4rem' }}>System built (using DSA)</div>
          <input
            type="text"
            placeholder="e.g. Rate limiter using sliding window"
            value={week.systemBuilt}
            onChange={(e) => save({ ...week, systemBuilt: e.target.value })}
            style={{ width: '100%', background: '#050505', border: `1px solid ${week.systemBuilt.trim() ? C.borderMid : C.border}`, borderRadius: 3, color: C.whiteOff, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', padding: '0.3rem 0.5rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Explanation shipped */}
        <div style={{ border: `1px solid ${week.explanationUrl.trim() ? 'rgba(255,255,255,0.12)' : C.border}`, borderRadius: 4, padding: '0.85rem 1rem', background: C.surface }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.4rem' }}>Explanation URL (post / thread)</div>
          <input
            type="text"
            placeholder="https://medium.com/..."
            value={week.explanationUrl}
            onChange={(e) => save({ ...week, explanationUrl: e.target.value })}
            style={{ width: '100%', background: '#050505', border: `1px solid ${week.explanationUrl.trim() ? C.borderMid : C.border}`, borderRadius: 3, color: C.whiteOff, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', padding: '0.3rem 0.5rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Proof URL */}
        <div style={{ border: `1px solid ${week.proofUrl.trim() ? 'rgba(255,255,255,0.12)' : C.border}`, borderRadius: 4, padding: '0.85rem 1rem', background: C.surface }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.grayDim, marginBottom: '0.4rem' }}>Code proof (GitHub link)</div>
          <input
            type="text"
            placeholder="https://github.com/..."
            value={week.proofUrl}
            onChange={(e) => save({ ...week, proofUrl: e.target.value })}
            style={{ width: '100%', background: '#050505', border: `1px solid ${week.proofUrl.trim() ? C.borderMid : C.border}`, borderRadius: 3, color: C.whiteOff, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.68rem', padding: '0.3rem 0.5rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
      </div>
    </div>
  )
}

/* ── SystemDSABridge — static reference table ───────────────────── */
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
          <DailyPlan />
          <AtomicUnitTracker />
          <WeeklyProgress />
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
