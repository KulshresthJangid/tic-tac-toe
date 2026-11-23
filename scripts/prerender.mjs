// Post-build static prerender.
//
// This app is a client-rendered Vite SPA (createRoot().render(), no SSR).
// That means AI/search crawlers that don't execute JS (GPTBot, ClaudeBot,
// PerplexityBot, and others) only ever see an empty <div id="root">, plus
// the per-page <title>/meta/JSON-LD that usePageMeta() injects at runtime
// via useEffect, also invisible to them.
//
// This script boots a static server over the just-built dist/, drives a
// headless Chromium through every public route, waits for React to mount
// and usePageMeta's effects to run, and writes the fully rendered HTML
// (real content + real per-page <head>) to dist/<route>/index.html.
// nginx's `try_files $uri $uri/ /index.html` already serves a real file
// over the SPA fallback, so this needs no server config changes.
//
// Output, per route:
//   dist/<route>.html        what nginx serves for /<route> (no trailing slash)
//   dist/<route>/index.html  kept so a trailing-slash request still resolves
//                            until nginx 301s it (see deploy/nginx-seo.sh)
// plus dist/404.html (rendered from the SPA's NotFound route, noindex) and
// dist/sitemap.xml, generated from src/seo/manifest.ts with real lastmod dates.
//
// Client-side navigation is untouched: React re-renders over this markup
// on load (createRoot, not hydrateRoot, no hydration mismatch risk).

import { chromium } from 'playwright-chromium'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { DIST, loadManifest, resolveLastmod, canonicalFor, SITE } from './seo-lib.mjs'

const NOT_FOUND_PROBE = '/__not-found__'

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
}

function startStaticServer(template) {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0])
      let filePath = path.join(DIST, urlPath)
      const isFile = existsSync(filePath) && (await stat(filePath)).isFile()
      // SPA fallback (also for directories) always serves the pristine build template, never a
      // prerendered page, so one route's head tags and JSON-LD cannot leak into the next.
      const ext = isFile ? path.extname(filePath) : '.html'
      const body = isFile ? await readFile(filePath) : template
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
      res.end(body)
    } catch (err) {
      res.writeHead(500)
      res.end(String(err))
    }
  })
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

async function renderRoute(page, base, route, { expectCanonical }) {
  await page.goto(base + route, { waitUntil: 'networkidle' })
  // usePageMeta runs in a useEffect after mount, give it a beat past
  // networkidle to guarantee title/meta/JSON-LD are written to <head>.
  await page.waitForFunction(() => !!document.getElementById('root')?.children.length)
  if (expectCanonical) {
    await page.waitForFunction(
      (c) => document.querySelector('link[rel="canonical"]')?.getAttribute('href') === c,
      expectCanonical,
      { timeout: 10000 },
    )
  }
  await page.waitForTimeout(250)
  return page.content()
}

async function writeRoute(route, html) {
  const flat = path.join(DIST, `${route}.html`)
  const dir = path.join(DIST, route, 'index.html')
  await mkdir(path.dirname(flat), { recursive: true })
  await writeFile(flat, html)
  await mkdir(path.dirname(dir), { recursive: true })
  await writeFile(dir, html)
  return [flat, dir]
}

function sitemapXml(entries) {
  const urls = entries
    .map((e) => `  <url>\n    <loc>${e.loc}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

async function main() {
  if (!existsSync(DIST)) {
    console.error('[prerender] dist/ not found, run `vite build` first.')
    process.exit(1)
  }

  const { seoRoutes } = await loadManifest()
  const template = await readFile(path.join(DIST, 'index.html'))
  const server = await startStaticServer(template)
  const { port } = server.address()
  const base = `http://127.0.0.1:${port}`

  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log(`[prerender] rendering ${seoRoutes.length} routes + 404...`)

  const sitemap = []
  for (const r of seoRoutes) {
    const canonical = canonicalFor(r.path)
    const html = await renderRoute(page, base, r.path, { expectCanonical: canonical })
    if (r.path === '/') {
      await writeFile(path.join(DIST, 'index.html'), html)
      console.log('[prerender] / -> index.html')
    } else {
      await writeRoute(r.path, html)
      console.log(`[prerender] ${r.path} -> ${r.path.slice(1)}.html`)
    }
    sitemap.push({ loc: canonical, lastmod: resolveLastmod(r) })
  }

  // 404 page: nginx serves this with a real 404 status for unknown URLs.
  const notFoundHtml = await renderRoute(page, base, NOT_FOUND_PROBE, {})
  await writeFile(path.join(DIST, '404.html'), notFoundHtml)
  console.log('[prerender] 404 -> 404.html')

  await writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml(sitemap))
  console.log(`[prerender] sitemap.xml: ${sitemap.length} URLs (${sitemap.filter((e) => !e.lastmod).length} without lastmod)`)

  await browser.close()
  server.close()
  console.log(`[prerender] done. Site: ${SITE}`)
}

main().catch((err) => {
  console.error('[prerender] failed:', err)
  process.exit(1)
})
