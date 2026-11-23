import { Link } from 'react-router-dom'
import type { Crumb } from '../lib/seo'

/** Visible breadcrumb trail. Pair it with breadcrumbLd() in the page's JSON-LD. */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-mono text-white/55">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-white/80">
                  {c.name}
                </span>
              ) : (
                <Link to={c.path} className="hover:text-white transition-colors">
                  {c.name}
                </Link>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
