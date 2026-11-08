interface LogoMarkProps {
  size?: number
  className?: string
}

/*
 * The "K" mark: a stem, a rising arm, and a lower leg that drops and then
 * settles flat. Colours follow the theme variables. public/favicon.svg is the
 * fixed mint version of the same shape.
 */
export default function LogoMark({ size = 32, className = '' }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" style={{ fill: 'rgb(var(--c-signal))' }} />
      <g
        fill="none"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: 'rgb(var(--c-ink))' }}
      >
        <path d="M20 15V49" />
        <path d="M20 34L44 15" />
        <path d="M29 30L41 49H51" />
      </g>
    </svg>
  )
}
