import type { ProjectStatus, ServiceStatus } from '../types'

type Status = ProjectStatus | ServiceStatus

interface StatusBadgeProps {
  status: Status
  pulse?: boolean
}

const statusConfig: Record<
  Status,
  { label: string; className: string; dotColor: string }
> = {
  LIVE: {
    label: 'LIVE',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotColor: 'bg-emerald-400',
  },
  DEV: {
    label: 'DEV',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotColor: 'bg-amber-400',
  },
  INTERNAL: {
    label: 'INTERNAL',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotColor: 'bg-blue-400',
  },
  ARCHIVED: {
    label: 'ARCHIVED',
    className: 'bg-slate-500/10 text-slate-500 border-slate-600/20',
    dotColor: 'bg-slate-500',
  },
  ONLINE: {
    label: 'ONLINE',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotColor: 'bg-emerald-400',
  },
  DEGRADED: {
    label: 'DEGRADED',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotColor: 'bg-amber-400',
  },
  OFFLINE: {
    label: 'OFFLINE',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
    dotColor: 'bg-red-400',
  },
  MAINTENANCE: {
    label: 'MAINT',
    className: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    dotColor: 'bg-violet-400',
  },
}

export default function StatusBadge({ status, pulse = false }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono font-medium tracking-wider ${config.className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dotColor} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      {config.label}
    </span>
  )
}
