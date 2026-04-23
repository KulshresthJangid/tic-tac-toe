import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function GlassCard({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'brutal-card',
        paddingMap[padding],
        hoverable ? 'brutal-card-hover' : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
