// Weekly Search Console report from the NDJSON that pull.mjs writes.
//
//   node scripts/gsc/report.mjs [--days 28] [--brand "kaizex|kulshresth|buildwithkulshresth"]
//
// Prints Markdown to stdout and saves reports/gsc-weekly-<date>.md. Sections:
//   1. Totals (and change vs the previous period)
//   2. Top pages, and a breakdown by site section (/projects, /services, /blog, ...)
//   3. Top non-brand queries
//   4. Pages with impressions but zero clicks
//   5. Queries ranking between position 8 and 20 (page 1 bottom / page 2: the cheapest wins)

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DATA = process.env.GSC_DATA_DIR ?? path.join(ROOT, 'data', 'gsc')
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : fallback
}
const days = Number(arg('days', 28))
const brand = new RegExp(arg('brand', 'kaizex|kulshresth|buildwithkulshresth|jangid'), 'i')
const MIN_IMPRESSIONS_ZERO_CLICK = Number(arg('min-zero-click-impressions', 20))

async function load() {
  const files = (await readdir(DATA).catch(() => [])).filter((f) => f.endsWith('.ndjson')).sort()
  const rows = []
  for (const f of files) {
    const text = await readFile(path.join(DATA, f), 'utf8')
    for (const line of text.split('\n')) if (line) rows.push(JSON.parse(line))
  }
  return rows
}

const sum = (rows, k) => rows.reduce((a, r) => a + r[k], 0)
const pct = (n, d) => (d ? `${((n / d) * 100).toFixed(1)}%` : '0%')
const pathOf = (u) => {
  try {
    return new URL(u).pathname || '/'
  } catch {
    return u
  }
}

/** Group rows by key; position is impression-weighted. */
function group(rows, keyFn) {
  const m = new Map()
  for (const r of rows) {
    const k = keyFn(r)
    const g = m.get(k) ?? { key: k, clicks: 0, impressions: 0, posWeighted: 0 }
    g.clicks += r.clicks
    g.impressions += r.impressions
    g.posWeighted += r.position * r.impressions
    m.set(k, g)
  }
  return [...m.values()].map((g) => ({ ...g, position: g.impressions ? g.posWeighted / g.impressions : 0 }))
}

const table = (head, rows) =>
  rows.length ? [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n') : '_none_'

const section = (rows) => {
  const p = pathOf(rows)
  if (p === '/') return 'home'
  return '/' + (p.split('/')[1] ?? '') + (p.split('/').length > 2 ? '/*' : '')
}

async function main() {
  const all = await load()
  if (!all.length) {
    console.error(`No data in ${DATA}. Run scripts/gsc/pull.mjs first.`)
    process.exit(1)
  }
  const dates = [...new Set(all.map((r) => r.date))].sort()
  const end = dates.at(-1)
  const cutoff = (n) => {
    const d = new Date(end)
    d.setUTCDate(d.getUTCDate() - n + 1)
    return d.toISOString().slice(0, 10)
  }
  const curStart = cutoff(days)
  const prevStart = cutoff(days * 2)
  const cur = all.filter((r) => r.date >= curStart)
  const prev = all.filter((r) => r.date >= prevStart && r.date < curStart)

  const out = []
  out.push(`# Search Console weekly report`, '', `Period: ${curStart} to ${end} (${days} days). Brand filter: \`${brand.source}\`.`, '')

  const delta = (a, b) => (b ? `${a - b >= 0 ? '+' : ''}${(((a - b) / b) * 100).toFixed(0)}%` : 'n/a')
  const c = sum(cur, 'clicks'), i = sum(cur, 'impressions'), pc = sum(prev, 'clicks'), pi = sum(prev, 'impressions')
  out.push('## Totals', '', table(['Metric', 'This period', 'Previous', 'Change'], [
    ['Clicks', c, pc || '-', delta(c, pc)],
    ['Impressions', i, pi || '-', delta(i, pi)],
    ['CTR', pct(c, i), pct(pc, pi), ''],
  ]), '')

  const countries = group(cur, (r) => r.country).sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 5)
  out.push('Top countries: ' + countries.map((g) => `${g.key.toUpperCase()} (${g.clicks} clicks, ${g.impressions} impr.)`).join(', '), '')

  const pages = group(cur, (r) => pathOf(r.page))
  out.push('## Top pages', '', table(['Page', 'Clicks', 'Impr.', 'CTR', 'Avg pos'],
    pages.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 15)
      .map((g) => [g.key, g.clicks, g.impressions, pct(g.clicks, g.impressions), g.position.toFixed(1)])), '')

  const sections = group(cur, (r) => section(r.page))
  out.push('## By section', '', table(['Section', 'Clicks', 'Impr.', 'CTR'],
    sections.sort((a, b) => b.impressions - a.impressions).map((g) => [g.key, g.clicks, g.impressions, pct(g.clicks, g.impressions)])), '')

  const nonBrand = cur.filter((r) => !brand.test(r.query))
  const nbQueries = group(nonBrand, (r) => r.query)
  const brandImpr = sum(cur.filter((r) => brand.test(r.query)), 'impressions')
  out.push('## Top non-brand queries', '', `Non-brand share of impressions: ${pct(sum(nonBrand, 'impressions'), i)} (brand: ${brandImpr}).`, '',
    table(['Query', 'Clicks', 'Impr.', 'Avg pos', 'Top page'],
      nbQueries.sort((a, b) => b.impressions - a.impressions).slice(0, 25).map((g) => {
        const top = group(nonBrand.filter((r) => r.query === g.key), (r) => pathOf(r.page)).sort((a, b) => b.impressions - a.impressions)[0]
        return [g.key, g.clicks, g.impressions, g.position.toFixed(1), top?.key ?? '']
      })), '')

  out.push(`## Pages with impressions but zero clicks (>= ${MIN_IMPRESSIONS_ZERO_CLICK} impr.)`, '', table(['Page', 'Impr.', 'Avg pos', 'Top query'],
    pages.filter((g) => g.clicks === 0 && g.impressions >= MIN_IMPRESSIONS_ZERO_CLICK).sort((a, b) => b.impressions - a.impressions).slice(0, 20).map((g) => {
      const q = group(cur.filter((r) => pathOf(r.page) === g.key), (r) => r.query).sort((a, b) => b.impressions - a.impressions)[0]
      return [g.key, g.impressions, g.position.toFixed(1), q?.key ?? '']
    })), '', 'Fix: rewrite the title and meta description to match the query, or improve the snippet with structured data.', '')

  out.push('## Queries ranking 8 to 20', '', table(['Query', 'Avg pos', 'Impr.', 'Clicks', 'Page'],
    nbQueries.filter((g) => g.position >= 8 && g.position <= 20 && g.impressions >= 3).sort((a, b) => b.impressions - a.impressions).slice(0, 25).map((g) => {
      const top = group(nonBrand.filter((r) => r.query === g.key), (r) => pathOf(r.page)).sort((a, b) => b.impressions - a.impressions)[0]
      return [g.key, g.position.toFixed(1), g.impressions, g.clicks, top?.key ?? '']
    })), '', 'Fix: these are one good internal link, heading or paragraph away from page 1. Strengthen the ranking page for the query.', '')

  const md = out.join('\n')
  console.log(md)
  const dir = path.join(ROOT, 'reports')
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, `gsc-weekly-${end}.md`), md + '\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
