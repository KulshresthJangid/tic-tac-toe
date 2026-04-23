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
    <div className={`border-4 border-white bg-black p-5 font-mono text-sm shadow-brutal transition-none ${className}`}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b-4 border-white">
        <span className="w-3 h-3 bg-white" />
        <span className="w-3 h-3 bg-white" />
        <span className="w-3 h-3 bg-white" />
        <span className="ml-4 text-sm text-white font-black uppercase tracking-widest select-none">sys_root</span>
      </div>

      <div className="space-y-2">
        {lines.slice(0, visibleCount).map((line, i) => (
          <div key={i} className="flex gap-3 leading-relaxed font-bold">
            {line.prompt && (
              <span className="flex-shrink-0 select-none whitespace-nowrap text-primary">
                root@server:~$
              </span>
            )}
            <span
              className={
                line.color
                  ? line.color
                  : line.prompt
                  ? 'text-white'
                  : 'text-gray-400'
              }
            >
              {line.text}
            </span>
          </div>
        ))}
        {visibleCount < lines.length && (
          <span className="inline-block w-2 h-4 bg-primary align-middle animate-pulse ml-2" />
        )}
      </div>
    </div>
  )
}
