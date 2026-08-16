import { useRef, useState } from 'react'
import { Download } from 'lucide-react'
import { useGenZ } from '../context/GenZContext'
import { cn } from '../lib/utils'

const RESUME_PATH = '/resume/kulshresth-jangid-resume.pdf'
const RESUME_FILENAME = 'kulshresth-jangid-resume.pdf'

type RunState = 'idle' | 'running' | 'done'

const script = [
  { text: 'Compiling 4 years of production incidents into 2 pages...', delay: 260 },
  { text: 'Packaging: experience.json → skills.json → impact-metrics.json', delay: 220 },
  { text: 'Bundling PDF — kulshresth-jangid-resume.pdf (231 KB)', delay: 240 },
  { text: '[ DONE ] Saved to Downloads ✓', delay: 320, color: 'text-white/80' },
]

const genzScript = [
  { text: 'cooking up 4 years of not crashing prod into 2 pages...', delay: 260 },
  { text: 'packaging: receipts.json -> flexes.json -> the-good-stuff.json', delay: 220 },
  { text: 'bundling pdf — kulshresth-jangid-resume.pdf (231 kb)', delay: 240 },
  { text: "[ DONE ] it's in your downloads. go get it. ✓", delay: 320, color: 'text-white/80' },
]

/**
 * Terminal-styled resume download — matches TerminalBlock's window chrome
 * so it reads as part of the same fake-infra bit the rest of the site runs,
 * not a bolted-on widget. Clicking "runs" a short fake script and triggers
 * the real download once it finishes; the icon button next to it is the
 * plain, no-animation fallback for anyone who just wants the file.
 */
export default function ResumeDownload({ className = '' }: { className?: string }) {
  const { genzMode } = useGenZ()
  const [state, setState] = useState<RunState>('idle')
  const [visibleLines, setVisibleLines] = useState(0)
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const lines = genzMode ? genzScript : script

  const handleRun = () => {
    if (state !== 'idle') return
    setState('running')
    setVisibleLines(0)

    let elapsed = 0
    lines.forEach((line, i) => {
      elapsed += line.delay
      setTimeout(() => setVisibleLines(i + 1), elapsed)
    })

    setTimeout(() => {
      anchorRef.current?.click()
      setState('done')
    }, elapsed + 150)
  }

  return (
    <div className={cn('glass rounded-xl p-5 font-mono text-sm', className)}>
      {/* Window chrome — same pattern as TerminalBlock */}
      <div className="flex items-center gap-1.5 mb-4 pb-3 border-b border-white/[0.06]">
        <span className="w-3 h-3 rounded-full bg-white/10" />
        <span className="w-3 h-3 rounded-full bg-white/10" />
        <span className="w-3 h-3 rounded-full bg-white/10" />
        <span className="ml-3 text-xs text-white/20 select-none">bash — resume.sh</span>
        <a
          href={RESUME_PATH}
          download={RESUME_FILENAME}
          title="Just give me the PDF"
          className="ml-auto text-white/20 hover:text-white transition-colors duration-150"
        >
          <Download size={14} />
        </a>
      </div>

      <div className="space-y-1.5 min-h-[104px]">
        <button
          type="button"
          onClick={handleRun}
          disabled={state !== 'idle'}
          className={cn(
            'flex gap-2 leading-relaxed text-left w-full',
            state === 'idle' && 'cursor-pointer group',
          )}
        >
          <span className="flex-shrink-0 select-none whitespace-nowrap">
            <span className="text-white/60">root</span>
            <span className="text-white/20">@</span>
            <span className="text-white/60">server</span>
            <span className="text-white/20">:~</span>
            <span className="text-white/50">#</span>
          </span>
          <span className={cn('text-white/80', state === 'idle' && 'group-hover:text-white')}>
            ./download-resume.sh
          </span>
          {state === 'idle' && (
            <span className="inline-block w-2 h-[1.1em] bg-white/70 align-middle animate-blink" />
          )}
        </button>

        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={cn('leading-relaxed', line.color ?? 'text-white/40')}>
            {line.text}
          </div>
        ))}

        {state === 'running' && visibleLines < lines.length && (
          <span className="inline-block w-2 h-[1.1em] bg-white/70 align-middle animate-blink" />
        )}
      </div>

      {/* Real download trigger, fired programmatically once the script "finishes" */}
      <a ref={anchorRef} href={RESUME_PATH} download={RESUME_FILENAME} className="hidden" aria-hidden="true" />
    </div>
  )
}
