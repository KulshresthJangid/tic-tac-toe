import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'

/*
 * The hero's signature visual: a telemetry-style p99 latency trace that draws
 * itself, then drops when the "fix" ships. The two plateaus are the real
 * numbers from the CarDekho API performance case study (820 ms to 490 ms,
 * -40%). The jitter between them is generated, so the chart is labelled
 * illustrative. Scrub it with a mouse or finger.
 */

const W = 640
const H = 380
const PAD_L = 44
const PAD_R = 20
const PAD_T = 24
const PAD_B = 40
const POINTS = 72
const DEPLOY_AT = 34
const BEFORE_MS = 820
const AFTER_MS = 490
const Y_MAX = 1100

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildSeries() {
  const rand = mulberry32(20)
  const out: number[] = []
  for (let i = 0; i < POINTS; i++) {
    if (i < DEPLOY_AT) {
      let v = BEFORE_MS + (rand() - 0.5) * 150
      if (rand() > 0.88) v += 120 + rand() * 90 // the spikes that page someone at 2am
      out.push(Math.min(v, 1040))
    } else {
      // short settle, then a calm plateau
      const settle = Math.max(0, 1 - (i - DEPLOY_AT) / 5)
      const base = AFTER_MS + (BEFORE_MS - AFTER_MS) * settle * settle
      out.push(base + (rand() - 0.5) * 46)
    }
  }
  out[POINTS - 1] = AFTER_MS // land exactly on the measured number
  return out
}

const x =(i: number) => PAD_L + (i * (W - PAD_L - PAD_R)) / (POINTS - 1)
const y = (v: number) => PAD_T + (1 - v / Y_MAX) * (H - PAD_T - PAD_B)

export default function LatencyTrace() {
  const reduce = useReducedMotion()
  const series = useMemo(buildSeries, [])
  const [progress, setProgress] = useState(reduce ? 1 : 0)
  const [hover, setHover] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (reduce) {
      setProgress(1)
      return
    }
    const controls = animate(0, 1, {
      duration: 3.4,
      delay: 0.5,
      ease: [0.45, 0.05, 0.2, 1],
      onUpdate: setProgress,
    })
    return () => controls.stop()
  }, [reduce])

  const line = series.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L${x(POINTS - 1)} ${H - PAD_B} L${x(0)} ${H - PAD_B} Z`
  const revealW = PAD_L + progress * (W - PAD_L - PAD_R) + 2
  const liveIdx = Math.min(POINTS - 1, Math.round(progress * (POINTS - 1)))
  const idx = hover ?? liveIdx
  const value = Math.round(series[idx])
  const deployed = idx >= DEPLOY_AT
  const done = progress >= 1

  function onMove(clientX: number) {
    const el = svgRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = ((clientX - rect.left) / rect.width) * W
    const i = Math.round(((px - PAD_L) / (W - PAD_L - PAD_R)) * (POINTS - 1))
    setHover(Math.max(0, Math.min(POINTS - 1, i)))
  }

  const grid = [250, 500, 750, 1000]
  const tipLeft = x(idx) > W * 0.7

  return (
    <figure className="relative w-full select-none">
      <div className="flex items-end justify-between mb-3 px-1">
        <div>
          <p className="eyebrow mb-1">p99 database latency</p>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-mono text-5xl sm:text-6xl tabular-nums tracking-tight transition-colors duration-300 ${
                deployed ? 'text-signal' : 'text-white'
              }`}
            >
              {value}
            </span>
            <span className="font-mono text-sm text-white/45">ms</span>
          </div>
        </div>
        <div
          className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all duration-500 ${
            done || deployed
              ? 'border-signal/60 text-signal bg-signal/10 opacity-100'
              : 'border-white/10 text-white/30 opacity-60'
          }`}
        >
          {done || deployed ? '-40% after the fix' : 'before the fix'}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto touch-pan-y rounded-xl border border-white/[0.09] bg-surface/80"
        role="img"
        aria-label="Line chart of p99 latency falling from about 820 milliseconds to about 490 milliseconds after a caching redesign, a 40 percent reduction."
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerLeave={() => setHover(null)}
        onPointerDown={(e) => onMove(e.clientX)}
      >
        <defs>
          <linearGradient id="trace-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B0E4CC" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#B0E4CC" stopOpacity="0" />
          </linearGradient>
          <clipPath id="trace-reveal">
            <rect x="0" y="0" width={revealW} height={H} />
          </clipPath>
        </defs>

        {grid.map((g) => (
          <g key={g}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(g)} y2={y(g)} stroke="#e8f2ed" strokeOpacity="0.07" />
            <text x={PAD_L - 8} y={y(g) + 3} textAnchor="end" fontSize="10" fill="#e8f2ed" fillOpacity="0.4" fontFamily="JetBrains Mono, monospace">
              {g}
            </text>
          </g>
        ))}
        <line x1={PAD_L} x2={W - PAD_R} y1={H - PAD_B} y2={H - PAD_B} stroke="#e8f2ed" strokeOpacity="0.18" />

        {/* deploy marker */}
        <g opacity={progress * (POINTS - 1) >= DEPLOY_AT ? 1 : 0} style={{ transition: 'opacity 0.5s' }}>
          <line x1={x(DEPLOY_AT)} x2={x(DEPLOY_AT)} y1={PAD_T} y2={H - PAD_B} stroke="#B0E4CC" strokeOpacity="0.7" strokeDasharray="3 5" />
          <text x={x(DEPLOY_AT) + 8} y={PAD_T + 12} fontSize="10" fill="#8fd1b3" fontFamily="JetBrains Mono, monospace">
            caching redesign ships
          </text>
        </g>

        <g clipPath="url(#trace-reveal)">
          <path d={area} fill="url(#trace-fill)" />
          <path d={line} fill="none" stroke="#e8f2ed" strokeOpacity="0.9" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          {/* the post-fix stretch, in signal colour */}
          <path
            d={series
              .slice(DEPLOY_AT - 1)
              .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i + DEPLOY_AT - 1).toFixed(1)} ${y(v).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke="#B0E4CC"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        {/* live head / scrub cursor */}
        <g>
          <line x1={x(idx)} x2={x(idx)} y1={PAD_T} y2={H - PAD_B} stroke="#e8f2ed" strokeOpacity={hover !== null ? 0.35 : 0} />
          <circle cx={x(idx)} cy={y(series[idx])} r="9" fill="#B0E4CC" fillOpacity="0.18" />
          <circle cx={x(idx)} cy={y(series[idx])} r="4" fill={deployed ? '#B0E4CC' : '#e8f2ed'} />
        </g>

        {hover !== null && (
          <g transform={`translate(${tipLeft ? x(idx) - 96 : x(idx) + 12} ${Math.max(PAD_T, y(series[idx]) - 40)})`}>
            <rect width="84" height="30" rx="6" fill="#091413" stroke="#e8f2ed" strokeOpacity="0.2" />
            <text x="10" y="19" fontSize="12" fill="#e8f2ed" fontFamily="JetBrains Mono, monospace">
              {value} ms
            </text>
          </g>
        )}

        <text x={PAD_L} y={H - 14} fontSize="10" fill="#e8f2ed" fillOpacity="0.4" fontFamily="JetBrains Mono, monospace">
          30 days
        </text>
        <text x={W - PAD_R} y={H - 14} textAnchor="end" fontSize="10" fill="#e8f2ed" fillOpacity="0.4" fontFamily="JetBrains Mono, monospace">
          now
        </text>
      </svg>

      <figcaption className="mt-3 px-1 font-mono text-[11px] leading-relaxed text-white/40">
        Shape is illustrative. 820 ms before and 490 ms after are the measured p99 numbers from the CarDekho API overhaul. Drag across to read it.
      </figcaption>
    </figure>
  )
}
