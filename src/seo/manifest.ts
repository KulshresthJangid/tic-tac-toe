// Single source of truth for every public, indexable route. Consumed by
// scripts/prerender.mjs (which bundles this file with esbuild, so it must stay
// free of React and browser imports) to prerender HTML, write sitemap.xml and
// run the SEO checks. Add a route here and it is prerendered, listed in the
// sitemap and verified, with no other file to remember.
import { projects } from '../data/projects'
import { services } from '../data/services'
import { posts } from '../data/posts'

export type RouteKind = 'home' | 'page' | 'project' | 'service' | 'blog-index' | 'blog-post'

export interface SeoRoute {
  path: string
  kind: RouteKind
  /**
   * Source files whose last git commit date is the page's lastmod. Used for
   * hand-written pages. Pages driven by data carry an explicit `lastmod`.
   */
  sources?: string[]
  lastmod?: string
}

export const seoRoutes: SeoRoute[] = [
  { path: '/', kind: 'home', sources: ['src/pages/Home.tsx'] },
  { path: '/about', kind: 'page', sources: ['src/pages/About.tsx'] },
  { path: '/hire', kind: 'page', sources: ['src/pages/Hire.tsx'] },
  { path: '/privacy', kind: 'page', sources: ['src/pages/Privacy.tsx'] },
  { path: '/terms', kind: 'page', sources: ['src/pages/Terms.tsx'] },
  { path: '/projects', kind: 'page', sources: ['src/pages/Projects.tsx', 'src/data/projects.ts'] },
  ...projects.map((p) => ({ path: `/projects/${p.id}`, kind: 'project' as const, lastmod: p.dateModified })),
  ...services.map((s) => ({ path: `/services/${s.slug}`, kind: 'service' as const, lastmod: s.lastmod })),
  { path: '/blog', kind: 'blog-index', lastmod: [...posts.map((p) => p.dateModified)].sort().pop() },
  ...posts.map((p) => ({ path: `/blog/${p.slug}`, kind: 'blog-post' as const, lastmod: p.dateModified })),
  { path: '/apps', kind: 'page', sources: ['src/pages/Apps.tsx', 'src/data/apps.ts'] },
  { path: '/productivity', kind: 'page', sources: ['src/pages/Productivity.tsx', 'src/data/productivity.ts'] },
]

/** Routes that exist in the SPA but must never be indexed. nginx serves the app shell for these with noindex. */
export const privateRoutes = ['/admin', '/admin/plan', '/ai-ml', '/dsa', '/dsa-v2', '/dsa-v3']
