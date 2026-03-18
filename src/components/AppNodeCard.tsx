import type { AppService } from '../types'
import StatusBadge from './StatusBadge'
import GlassCard from './GlassCard'

function ServiceIcon({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-cyan-400 text-sm select-none">
      {name.slice(0, 2).toUpperCase()}
    </div>
  )
}

interface AppNodeCardProps {
  app: AppService
}

export default function AppNodeCard({ app }: AppNodeCardProps) {
  const href = app.externalUrl ?? app.route
  const isExternal = Boolean(app.externalUrl)
  const displayRoute = isExternal ? href : `localhost${app.route}`

  return (
    <GlassCard hoverable className="flex flex-col gap-4 group">
      <div className="flex items-start gap-3">
        <ServiceIcon name={app.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white">{app.name}</h3>
            <StatusBadge status={app.status} pulse={app.status === 'ONLINE'} />
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
            {displayRoute}
            <span className="ml-2 text-slate-600">v{app.version}</span>
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed flex-1">{app.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {app.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] font-mono bg-white/[0.04] border border-white/[0.07] rounded text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={(e) => e.stopPropagation()}
        className="mt-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
        LAUNCH APP
      </a>
    </GlassCard>
  )
}
