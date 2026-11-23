// Fails the build when a prerendered page would hurt indexing. Runs after
// prerender.mjs, reads only dist/, no browser or network.
//
// Per route: real <title> (never "Loading..."), meta description, a
// self-referencing canonical, exactly one <h1>, valid JSON-LD with the schema
// types that route kind needs, unique title/description across the site.
// New landing pages (services, blog) are held to the stricter limits from the
// SEO brief: title < 60, description < 155, services 600+ words.

import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { DIST, loadManifest, canonicalFor, SITE } from './seo-lib.mjs'

const errors = []
const warnings = []
const err = (route, msg) => errors.push(`${route}: ${msg}`)
const warn = (route, msg) => warnings.push(`${route}: ${msg}`)

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')

function htmlFor(route) {
  return route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${route}.html`)
}

function metaContent(html, attr, name) {
  const re = new RegExp(`<meta[^>]*${attr}="${name}"[^>]*>`, 'i')
  const tag = html.match(re)?.[0]
  const m = tag?.match(/content="([^"]*)"/i)
  return m ? decode(m[1]) : null
}

function jsonLdTypes(html, route) {
  const types = new Set()
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html))) {
    try {
      const data = JSON.parse(m[1])
      for (const node of Array.isArray(data) ? data : [data]) {
        const t = node['@type']
        for (const x of Array.isArray(t) ? t : [t]) if (x) types.add(x)
      }
    } catch (e) {
      err(route, `invalid JSON-LD: ${e.message}`)
    }
  }
  return types
}

function mainWordCount(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? ''
  const text = main
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
  return decode(text).split(/\s+/).filter(Boolean).length
}

const NEEDS = {
  service: ['ProfessionalService', 'Service', 'FAQPage', 'BreadcrumbList'],
  project: ['TechArticle', 'BreadcrumbList'],
  'blog-post': ['TechArticle', 'BreadcrumbList'],
  'blog-index': ['Blog', 'BreadcrumbList'],
  page: ['BreadcrumbList'],
  home: [],
}

async function main() {
  const { seoRoutes, privateRoutes } = await loadManifest()
  const titles = new Map()
  const descs = new Map()

  for (const r of seoRoutes) {
    const file = htmlFor(r.path)
    if (!existsSync(file)) {
      err(r.path, `missing ${path.relative(DIST, file)}`)
      continue
    }
    const html = await readFile(file, 'utf8')

    const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim()
    if (!title) err(r.path, 'empty <title>')
    if (/loading/i.test(title)) err(r.path, `placeholder title "${title}"`)
    if ((html.match(/<title[\s>]/gi) ?? []).length !== 1) err(r.path, 'expected exactly one <title>')

    const desc = metaContent(html, 'name', 'description')
    if (!desc) err(r.path, 'missing meta description')

    const canonicals = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*>/gi)].map((m) => m[0].match(/href="([^"]*)"/i)?.[1])
    if (canonicals.length !== 1) err(r.path, `expected exactly one canonical, found ${canonicals.length}`)
    else if (canonicals[0] !== canonicalFor(r.path)) err(r.path, `canonical ${canonicals[0]} is not self-referencing (${canonicalFor(r.path)})`)

    const robots = metaContent(html, 'name', 'robots') ?? ''
    if (/noindex/i.test(robots)) err(r.path, 'indexable route carries noindex')

    const h1s = (html.match(/<h1[\s>]/gi) ?? []).length
    if (h1s !== 1) err(r.path, `expected exactly one <h1>, found ${h1s}`)

    const types = jsonLdTypes(html, r.path)
    for (const need of NEEDS[r.kind] ?? []) if (!types.has(need)) err(r.path, `missing JSON-LD ${need}`)
    if (r.kind === 'project' && !types.has('SoftwareSourceCode')) warn(r.path, 'no SoftwareSourceCode JSON-LD')

    const strict = r.kind === 'service' || r.kind === 'blog-post' || r.kind === 'blog-index'
    if (title) {
      if (title.length > 60) (strict ? err : warn)(r.path, `title is ${title.length} chars (limit 60): "${title}"`)
      if (titles.has(title)) err(r.path, `duplicate title with ${titles.get(title)}`)
      titles.set(title, r.path)
    }
    if (desc) {
      if (desc.length > 155) (strict ? err : warn)(r.path, `description is ${desc.length} chars (limit 155)`)
      if (descs.has(desc)) err(r.path, `duplicate description with ${descs.get(desc)}`)
      descs.set(desc, r.path)
    }

    const words = mainWordCount(html)
    if (r.kind === 'service' && words < 600) err(r.path, `only ${words} words of main content (need 600+)`)
    if (r.kind === 'blog-post' && words < 600) warn(r.path, `only ${words} words`)
    if (r.kind === 'service' || r.kind === 'blog-post') console.log(`[verify-seo] ${r.path}: ${words} words, title ${title.length}, description ${desc?.length ?? 0}`)

    if (!/<main[\s\S]*<h1/i.test(html)) err(r.path, 'main content is not in the raw HTML')
  }

  // 404 page
  const nf = path.join(DIST, '404.html')
  if (!existsSync(nf)) err('/404', 'dist/404.html missing')
  else {
    const html = await readFile(nf, 'utf8')
    if (!/noindex/i.test(metaContent(html, 'name', 'robots') ?? '')) err('/404', '404.html must be noindex')
    if (/<link[^>]*rel="canonical"/i.test(html)) err('/404', '404.html must not declare a canonical')
  }

  // Sitemap: every entry must exist, be canonical, and be unique.
  const smFile = path.join(DIST, 'sitemap.xml')
  if (!existsSync(smFile)) err('/sitemap.xml', 'missing')
  else {
    const xml = await readFile(smFile, 'utf8')
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    const expected = seoRoutes.map((r) => canonicalFor(r.path))
    for (const loc of locs) if (!expected.includes(loc)) err('/sitemap.xml', `unexpected URL ${loc}`)
    for (const e of expected) if (!locs.includes(e)) err('/sitemap.xml', `missing URL ${e}`)
    if (new Set(locs).size !== locs.length) err('/sitemap.xml', 'duplicate URLs')
    for (const loc of locs) if (!loc.startsWith(SITE) || (loc.endsWith('/') && loc !== `${SITE}/`)) err('/sitemap.xml', `non-canonical form ${loc}`)
    const today = new Date().toISOString().slice(0, 10)
    const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1])
    if (lastmods.length && lastmods.every((d) => d === today)) warn('/sitemap.xml', 'every lastmod is today, looks like a build date')
  }

  // robots.txt must keep private routes out and point at the sitemap.
  const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8')
  for (const p of privateRoutes) if (!robots.includes(`Disallow: ${p}`)) err('/robots.txt', `missing Disallow: ${p}`)
  if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) err('/robots.txt', 'missing Sitemap line')

  for (const w of warnings) console.warn(`[verify-seo] WARN  ${w}`)
  if (errors.length) {
    for (const e of errors) console.error(`[verify-seo] FAIL  ${e}`)
    console.error(`[verify-seo] ${errors.length} error(s)`)
    process.exit(1)
  }
  console.log(`[verify-seo] OK: ${seoRoutes.length} routes, sitemap, 404 and robots verified (${warnings.length} warning(s)).`)
}

main().catch((e) => {
  console.error('[verify-seo] crashed:', e)
  process.exit(1)
})
