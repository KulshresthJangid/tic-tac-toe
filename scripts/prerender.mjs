// Post-build static prerender.
//
// This app is a client-rendered Vite SPA (createRoot().render(), no SSR).
// That means AI/search crawlers that don't execute JS (GPTBot, ClaudeBot,
// PerplexityBot, and others) only ever see an empty <div id="root">, plus
// the per-page <title>/meta/JSON-LD that usePageMeta() injects at runtime
// via useEffect — also invisible to them.
//
// This script boots a static server over the just-built dist/, drives a
// headless Chromium through every public route, waits for React to mount
// and usePageMeta's effects to run, and writes the fully rendered HTML
// (real content + real per-page <head>) to dist/<route>/index.html.
// nginx's `try_files $uri $uri/ /index.html` already serves a real file
// over the SPA fallback, so this needs no server config changes.
//
// Client-side navigation is untouched: React re-renders over this markup
// on load (createRoot, not hydrateRoot — no hydration mismatch risk).

import { chromium } from 'playwright-chromium'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'dist')

// Public, indexable routes only — admin/dsa/ai-ml are behind ProtectedRoute
// and disallowed in robots.txt, so they're intentionally excluded here too.
const ROUTES = [
  '/',
  '/about',
  '/projects',
  '/projects/social-saas',
  '/projects/microservices-migration',
  '/projects/api-performance',
  '/projects/cicd-automation',
  '/projects/slo-observability',
  '/projects/session-logger',
  '/projects/sso-platform',
  '/projects/goalbegins',
  '/projects/webhook-proxy',
  '/projects/leadgen-pro',
  '/projects/twitter-ai-bot',
  '/apps',
]

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

function startStaticServer() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(req.url.split('?')[0])
      let filePath = path.join(DIST, urlPath)
      if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html')
      if (!existsSync(filePath)) filePath = path.join(DIST, 'index.html') // SPA fallback
      const ext = path.extname(filePath)
      const body = await readFile(filePath)
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

async function main() {
  if (!existsSync(DIST)) {
    console.error('[prerender] dist/ not found — run `vite build` first.')
    process.exit(1)
  }

  const server = await startStaticServer()
  const { port } = server.address()
  const base = `http://127.0.0.1:${port}`

  const browser = await chromium.launch()
  const page = await browser.newPage()

  console.log(`[prerender] rendering ${ROUTES.length} routes...`)

  for (const route of ROUTES) {
    await page.goto(base + route, { waitUntil: 'networkidle' })
    // usePageMeta runs in a useEffect after mount — give it a beat past
    // networkidle to guarantee title/meta/JSON-LD are written to <head>.
    await page.waitForFunction(() => !!document.getElementById('root')?.children.length)
    await page.waitForTimeout(250)

    const html = await page.content()
    const outDir = route === '/' ? DIST : path.join(DIST, route)
    const outFile = path.join(outDir, 'index.html')
    await mkdir(outDir, { recursive: true })
    await writeFile(outFile, html)
    console.log(`[prerender] ${route} -> ${path.relative(DIST, outFile)}`)
  }

  await browser.close()
  server.close()
  console.log('[prerender] done.')
}

main().catch((err) => {
  console.error('[prerender] failed:', err)
  process.exit(1)
})
