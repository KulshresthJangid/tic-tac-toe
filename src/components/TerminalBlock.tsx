import { useEffect, useState } from 'react'

export interface TerminalLine {
  prompt?: boolean
  text: string
  delay?: number
  color?: string
}

interface TerminalBlockProps {
  lines: TerminalLine[]
  className?: string
}

export default function TerminalBlock({ lines, className = '' }: TerminalBlockProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount >= lines.length) return
    const delay = lines[visibleCount]?.delay ?? 120
    const timer = setTimeout(() => setVisibleCount((c) => c + 1), delay)
    return () => clearTimeout(timer)
  }, [visibleCount, lines])

  return (
    <div className={`glass rounded-xl p-5 font-mono text-sm ${className}`}>
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-white/[0.06]">
        <span className="w-3 h-3 rounded-full bg-red-500/50" />
        <span className="w-3 h-3 rounded-full bg-amber-500/50" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
        <span className="ml-3 text-xs text-slate-600 select-none">bash — server@production</span>
      </div>

      <div className="space-y-1.5">
        {lines.slice(0, visibleCount).map((line, i) => (
          <div key={i} className="flex gap-2 leading-relaxed">
            {line.prompt && (
              <span className="flex-shrink-0 select-none whitespace-nowrap">
                <span className="text-violet-400">root</span>
                <span className="text-slate-600">@</span>
                <span className="text-blue-400">server</span>
                <span className="text-slate-600">:~</span>
                <span className="text-cyan-500">#</span>
              </span>
            )}
            <span
              className={
                line.color
                  ? line.color
                  : line.prompt
                  ? 'text-slate-200'
                  : 'text-slate-400'
              }
            >
              {line.text}
            </span>
          </div>
        ))}
        {visibleCount < lines.length && (
          <span className="inline-block w-2 h-[1.1em] bg-cyan-400/80 align-middle animate-blink" />
        )}
      </div>
    </div>
  )
}
