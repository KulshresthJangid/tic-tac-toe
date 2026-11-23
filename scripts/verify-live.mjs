// Black-box check of the deployed site, using only raw HTTP (no JS), the way a
// crawler's first pass sees it. This is the proof for the "definition of done":
//
//   node scripts/verify-live.mjs [baseUrl]      (default https://buildwithkulshresth.com)
//
// Checks: unknown URLs 404, /kaizex* 301 to the case study, trailing-slash form
// 301s to the canonical, and every sitemap URL is a 200 with a real title, a
// self-referencing canonical, one h1 and JSON-LD in the raw HTML.

const base = (process.argv[2] ?? 'https://buildwithkulshresth.com').replace(/\/$/, '')
let failures = 0
const ok = (m) => console.log(`  ok    ${m}`)
const bad = (m) => {
  failures++
  console.log(`  FAIL  ${m}`)
}

async function get(path, init = {}) {
  return fetch(base + path, { redirect: 'manual', headers: { 'User-Agent': 'verify-live/1.0' }, ...init })
}

async function expectStatus(path, status, location) {
  const res = await get(path)
  const loc = res.headers.get('location')
  const target = loc ? new URL(loc, base).pathname : null
  if (res.status !== status) return bad(`${path} -> ${res.status} (wanted ${status})${loc ? ` Location: ${loc}` : ''}`)
  if (location && target !== location) return bad(`${path} -> ${res.status} Location: ${loc} (wanted ${location})`)
  ok(`${path} -> ${res.status}${loc ? ` ${loc}` : ''}`)
}

console.log('Indexing hygiene')
await expectStatus('/this-page-does-not-exist-12345', 404)
await expectStatus('/blog/does-not-exist', 404)
await expectStatus('/services/does-not-exist', 404)
await expectStatus('/kaizex', 301, '/projects/social-saas')
await expectStatus('/kaizex/', 301, '/projects/social-saas')
await expectStatus('/kaizex/kaizex/', 301, '/projects/social-saas')
await expectStatus('/hire/', 301, '/hire')
await expectStatus('/projects/social-saas/', 301, '/projects/social-saas')

const notFound = await get('/this-page-does-not-exist-12345')
const nfHtml = await notFound.text()
if (/noindex/i.test(nfHtml)) ok('404 body carries noindex')
else bad('404 body is missing noindex')

console.log('\nSitemap URLs (raw HTML, no JS)')
const smRes = await get('/sitemap.xml')
if (smRes.status !== 200) bad(`/sitemap.xml -> ${smRes.status}`)
const xml = await smRes.text()
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (!locs.length) bad('sitemap has no <loc> entries')

for (const loc of locs) {
  const path = new URL(loc).pathname
  const res = await get(path)
  const html = res.status === 200 ? await res.text() : ''
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? ''
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)?.[1]
  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length
  const ld = (html.match(/application\/ld\+json/gi) ?? []).length
  const problems = []
  if (res.status !== 200) problems.push(`status ${res.status}`)
  if (!title || /loading/i.test(title)) problems.push(`title "${title}"`)
  if (canonical !== loc) problems.push(`canonical ${canonical} != ${loc}`)
  if (h1s !== 1) problems.push(`${h1s} h1`)
  if (ld < 1) problems.push('no JSON-LD')
  if (problems.length) bad(`${path}: ${problems.join(', ')}`)
  else ok(`${path} 200, "${title.slice(0, 48)}", self-canonical, 1 h1, ${ld} JSON-LD`)
}

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed')
process.exit(failures ? 1 : 0)
