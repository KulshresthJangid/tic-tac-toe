import type { AppService } from '../types'
import StatusBadge from './StatusBadge'
import GlassCard from './GlassCard'

function ServiceIcon({ name }: { name: string }) {
  return (
    <div className="w-12 h-12 flex-shrink-0 bg-black border-2 border-white flex items-center justify-center font-mono font-black text-white text-base shadow-brutal transition-none">
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
    <GlassCard hoverable className="flex flex-col gap-4 group transition-none">
      <div className="flex items-start gap-4">
        <ServiceIcon name={app.name} />
        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-primary">{app.name}</h3>
            <StatusBadge status={app.status} pulse={app.status === 'ONLINE'} />
          </div>
          <p className="text-sm font-bold text-gray-400 mt-1 truncate uppercase">
            {displayRoute}
            <span className="ml-2 bg-white text-black px-1 py-0.5 text-xs">v{app.version}</span>
          </p>
        </div>
      </div>

      <p className="text-base text-white font-bold leading-relaxed flex-1">{app.description}</p>

      <div className="flex flex-wrap gap-2">
        {app.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-black bg-black border-2 border-white text-primary uppercase"
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
        className="brutal-btn mt-4 text-center justify-center flex items-center gap-2 w-full"
      >
        <span className="w-2 h-2 bg-black flex-shrink-0" />
        LAUNCH APP
      </a>
    </GlassCard>
  )
}
