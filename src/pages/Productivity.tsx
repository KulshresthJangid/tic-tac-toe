import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import GlassCard from '../components/GlassCard'
import { productivityTools } from '../data/productivity'

export default function Productivity() {
  usePageMeta(
    'Productivity Tools | Kulshresth Jangid',
    'Small, free, self-hosted productivity services. Starting with a Hinglish audio and video transcriptor.',
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-10"
      >
        <div>
          <p className="text-xs font-mono text-white/20 mb-2 tracking-[0.25em] uppercase">
            // productivity
          </p>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Productivity Tools</h1>
          <p className="text-white/40 text-sm max-w-lg leading-relaxed">
            Small self-hosted services I built for myself and opened up. Each one lives at
            <span className="text-white/70 font-mono"> /productivity/&lt;name&gt;</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {productivityTools.map((tool) => (
            <GlassCard key={tool.id} hoverable className="flex flex-col gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-semibold text-white">{tool.name}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded border border-white/[0.1] text-white/40">
                  {tool.status}
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/25 -mt-2">{tool.href}</p>
              <p className="text-sm text-white/40 leading-relaxed flex-1">{tool.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-mono bg-white/[0.04] border border-white/[0.07] rounded text-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Plain <a>, not <Link>: this path is served by nginx, not the SPA router. */}
              <a
                href={tool.href}
                className="mt-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/50 text-xs font-mono font-medium hover:bg-white/[0.09] hover:text-white transition-all duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                OPEN
              </a>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
