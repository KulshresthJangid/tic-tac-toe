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
    className: 'bg-white/[0.05] text-white border-white/20',
    dotColor: 'bg-white',
  },
  DEV: {
    label: 'DEV',
    className: 'bg-white/[0.03] text-white/50 border-white/10',
    dotColor: 'bg-white/50',
  },
  INTERNAL: {
    label: 'INTERNAL',
    className: 'bg-white/[0.03] text-white/40 border-white/10',
    dotColor: 'bg-white/40',
  },
  ARCHIVED: {
    label: 'ARCHIVED',
    className: 'bg-white/[0.02] text-white/25 border-white/[0.08]',
    dotColor: 'bg-white/25',
  },
  ONLINE: {
    label: 'ONLINE',
    className: 'bg-white/[0.05] text-white/70 border-white/15',
    dotColor: 'bg-white/70',
  },
  DEGRADED: {
    label: 'DEGRADED',
    className: 'bg-white/[0.03] text-white/50 border-white/10',
    dotColor: 'bg-white/50',
  },
  OFFLINE: {
    label: 'OFFLINE',
    className: 'bg-white/[0.02] text-white/30 border-white/[0.08]',
    dotColor: 'bg-white/30',
  },
  MAINTENANCE: {
    label: 'MAINT',
    className: 'bg-white/[0.03] text-white/40 border-white/10',
    dotColor: 'bg-white/40',
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
