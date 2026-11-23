// Shared by prerender.mjs and verify-seo.mjs: loads the route manifest
// (TypeScript, bundled on the fly with esbuild, which ships with vite) and
// resolves lastmod dates.
import { build } from 'esbuild'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.join(__dirname, '..')
export const DIST = path.join(ROOT, 'dist')
export const SITE = 'https://buildwithkulshresth.com'

export async function loadManifest() {
  const result = await build({
    entryPoints: [path.join(ROOT, 'src/seo/manifest.ts')],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  })
  const code = result.outputFiles[0].text
  const mod = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
  return mod
}

/** Last git commit date (YYYY-MM-DD) touching any of the files, or null when git history is unavailable. */
export function gitDate(files) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { cwd: ROOT, encoding: 'utf8' }).trim()
    return out || null
  } catch {
    return null
  }
}

export function resolveLastmod(route) {
  if (route.lastmod) return route.lastmod
  return (route.sources && gitDate(route.sources)) || null
}

export function canonicalFor(routePath) {
  return routePath === '/' ? `${SITE}/` : `${SITE}${routePath}`
}
