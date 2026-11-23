export const SITE_URL = 'https://buildwithkulshresth.com'

export interface Crumb {
  name: string
  /** Site-relative path, e.g. "/services/microservices-migration". "/" is the homepage. */
  path: string
}

export function absoluteUrl(path: string): string {
  if (path === '/' || path === '') return `${SITE_URL}/`
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** BreadcrumbList JSON-LD. The first crumb should be Home. */
export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}

export const AUTHOR = {
  '@type': 'Person',
  name: 'Kulshresth Jangid',
  url: SITE_URL,
} as const

export const PUBLISHER = {
  '@type': 'Person',
  name: 'Kulshresth Jangid',
  url: SITE_URL,
} as const
