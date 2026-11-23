// Pulls Search Console Search Analytics rows (date, query, page, country,
// device) into data/gsc/<date>.ndjson, one file per day, safe to re-run.
// Zero dependencies: signs the service-account JWT with node:crypto.
//
//   GSC_SA_KEY_FILE=/path/service-account.json \
//   GSC_SITE=sc-domain:buildwithkulshresth.com \
//   node scripts/gsc/pull.mjs [--days 7]
//
// Setup (once):
//  1. Google Cloud console -> enable "Google Search Console API", create a service account,
//     download its JSON key (keep it outside the repo, chmod 600).
//  2. Search Console -> Settings -> Users and permissions -> Add user -> the service
//     account's email, permission "Restricted" (read only).
//  3. GSC_SITE is "sc-domain:buildwithkulshresth.com" for a Domain property, or the exact
//     URL prefix ("https://buildwithkulshresth.com/") for a URL-prefix property.
//
// Search Console data lags about 2 days, and the last days are revised, so each run
// re-fetches the last N days (default 7) and overwrites those files.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createSign } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = process.env.GSC_DATA_DIR ?? path.join(ROOT, 'data', 'gsc')
const keyFile = process.env.GSC_SA_KEY_FILE
const site = process.env.GSC_SITE ?? 'sc-domain:buildwithkulshresth.com'
const daysArg = process.argv.indexOf('--days')
const days = daysArg > -1 ? Number(process.argv[daysArg + 1]) : 7

if (!keyFile) {
  console.error('Set GSC_SA_KEY_FILE to the service-account JSON key path.')
  process.exit(1)
}

const b64u = (b) => Buffer.from(b).toString('base64url')

async function accessToken() {
  const key = JSON.parse(await readFile(keyFile, 'utf8'))
  const now = Math.floor(Date.now() / 1000)
  const header = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = b64u(
    JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  )
  const sig = createSign('RSA-SHA256').update(`${header}.${claim}`).sign(key.private_key, 'base64url')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${sig}`,
    }),
  })
  const json = await res.json()
  if (!json.access_token) throw new Error(`token request failed: ${JSON.stringify(json)}`)
  return json.access_token
}

const iso = (d) => d.toISOString().slice(0, 10)

async function queryRows(token, startDate, endDate) {
  const rows = []
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`
  for (let startRow = 0; ; startRow += 25000) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['date', 'query', 'page', 'country', 'device'],
        rowLimit: 25000,
        startRow,
        dataState: 'final',
      }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(`searchAnalytics ${res.status}: ${JSON.stringify(json)}`)
    const batch = json.rows ?? []
    rows.push(...batch)
    if (batch.length < 25000) break
  }
  return rows
}

async function main() {
  const end = new Date(Date.now() - 2 * 86400000) // final data lags ~2 days
  const start = new Date(end.getTime() - (days - 1) * 86400000)
  const token = await accessToken()
  const rows = await queryRows(token, iso(start), iso(end))

  const byDate = new Map()
  for (const r of rows) {
    const [date, query, page, country, device] = r.keys
    if (!byDate.has(date)) byDate.set(date, [])
    byDate.get(date).push({ date, query, page, country, device, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })
  }

  await mkdir(OUT, { recursive: true })
  // Write a file for every day in range, even empty ones, so re-runs clear stale rows.
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const d = iso(new Date(t))
    const lines = (byDate.get(d) ?? []).map((r) => JSON.stringify(r)).join('\n')
    await writeFile(path.join(OUT, `${d}.ndjson`), lines ? lines + '\n' : '')
  }
  console.log(`[gsc] ${rows.length} rows, ${iso(start)} .. ${iso(end)} -> ${OUT}`)
}

main().catch((e) => {
  console.error('[gsc] failed:', e.message)
  process.exit(1)
})
