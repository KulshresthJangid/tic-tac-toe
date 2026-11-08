interface LogoMarkProps {
  size?: number
  className?: string
}

/*
 * The "K" mark: a stem, a rising arm, and a lower leg that drops and then
 * settles flat. It is the hero's latency trace in letter form. Keep in sync
 * with public/favicon.svg.
 */
export default function LogoMark({ size = 32, className = '' }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="#B0E4CC" />
      <g fill="none" stroke="#091413" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 15V49" />
        <path d="M20 34L44 15" />
        <path className="logo-tail" d="M29 30L41 49H51" />
      </g>
    </svg>
  )
}
