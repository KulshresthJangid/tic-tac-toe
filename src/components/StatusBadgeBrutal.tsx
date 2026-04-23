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
    className: 'bg-primary text-black border-2 border-primary',
    dotColor: 'bg-black',
  },
  DEV: {
    label: 'DEV',
    className: 'bg-secondary text-black border-2 border-secondary',
    dotColor: 'bg-black',
  },
  INTERNAL: {
    label: 'INTERNAL',
    className: 'bg-black text-white border-2 border-white',
    dotColor: 'bg-white',
  },
  ARCHIVED: {
    label: 'ARCHIVED',
    className: 'bg-black text-gray-500 border-2 border-gray-500',
    dotColor: 'bg-gray-500',
  },
  ONLINE: {
    label: 'ONLINE',
    className: 'bg-primary text-black border-2 border-primary',
    dotColor: 'bg-black',
  },
  DEGRADED: {
    label: 'DEGRADED',
    className: 'bg-secondary text-black border-2 border-secondary',
    dotColor: 'bg-black',
  },
  OFFLINE: {
    label: 'OFFLINE',
    className: 'bg-red-500 text-white border-2 border-red-500',
    dotColor: 'bg-white',
  },
  MAINTENANCE: {
    label: 'MAINT',
    className: 'bg-yellow-500 text-black border-2 border-yellow-500',
    dotColor: 'bg-black',
  },
}

export default function StatusBadge({ status, pulse = false }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-0.5 border-2 text-xs font-black tracking-widest uppercase transition-none ${config.className}`}
    >
      <span
        className={`w-2 h-2 flex-shrink-0 ${config.dotColor} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      {config.label}
    </span>
  )
}
