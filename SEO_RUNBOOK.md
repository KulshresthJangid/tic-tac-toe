# SEO + measurement runbook

What the code now does, and the steps only you can do (they need your Google/Cloudflare accounts).

## 1. Deploy order (matters)

1. Set the GA4 measurement ID (step 3) in `src/lib/analytics.ts`, then push.
2. On the server run `./deploy.sh` as usual. `npm run build` now also prerenders every route, writes
   `dist/sitemap.xml` and `dist/404.html`, and **fails the deploy** if `scripts/verify-seo.mjs` finds a bad
   title, canonical, h1 or sitemap entry.
3. Then, once, on the server: `./deploy/nginx-seo.sh --inspect` (read-only), then `./deploy/nginx-seo.sh`.
   It backs up `services.conf`, rolls back if `nginx -t` fails, and is safe to re-run.
   Do step 3 only after step 2, because nginx now serves the flat `<route>.html` files from step 2.
4. Verify from anywhere: `npm run verify:live` (raw HTTP, no JS).

## 2. Known gap: unknown single-segment URLs

`/zzz-random` still answers `301 -> /kaizex/zzz-random/` (then 200 "Loading..."), because the Kaizex
brand-slug regexes in `services.conf` match any `/<slug>`. Fixing it means deciding which slugs are real
brands (today: `zoralis`). Either allow-list them in those regexes or make them match only known slugs.
`nginx-seo.sh --inspect` prints the regexes. Until then `verify:live` fails its first three checks.

## 3. GA4

1. analytics.google.com -> Admin -> Create property -> Web data stream for `buildwithkulshresth.com`.
2. Copy the `G-XXXXXXXXXX` ID into `GA_MEASUREMENT_ID` in `src/lib/analytics.ts`. Empty = analytics off.
3. Admin -> Events -> mark `generate_lead` as a **key event**.
4. Events sent: `page_view` (every route change), `cta_click` (`cta_name`, `link_url`, `page_path`),
   `generate_lead` (`lead_source`, `service`), `project_view` (`project_id`), `outbound_click`
   (`link_domain`). Verify in Admin -> DebugView (open the site with the GA Debugger extension on).
5. Link to Search Console: Admin -> Product links -> Search Console links -> Link -> pick the property ->
   choose the web stream. Then Reports -> Search Console shows query -> landing page -> conversion.
6. Visitors in Europe (by browser timezone) get a consent banner; nobody else does. Privacy page was updated.

## 4. Search Console

- Submit `https://buildwithkulshresth.com/sitemap.xml` again after deploy.
- URL Inspection -> Request indexing for: the 4 `/services/*` pages, `/blog` and its 3 posts, `/hire`.
- Add URL-prefix properties (Settings -> Add property -> URL prefix): `/projects/`, `/services/`, `/blog/`
  (use the full `https://buildwithkulshresth.com/services/` form). The weekly report also splits by section.
- Settings -> Bulk data export -> BigQuery (needs a Google Cloud project; grant
  `search-console-data-export@system.gserviceaccount.com` BigQuery Job User + Data Editor). Optional if you
  use the script below.

## 5. Daily pull + weekly report (no BigQuery needed)

```
# one-time: service account with the Search Console API enabled, added as a Restricted user in Search Console
export GSC_SA_KEY_FILE=/root/secrets/gsc-sa.json   # chmod 600, outside the repo
export GSC_SITE=sc-domain:buildwithkulshresth.com  # or the URL-prefix property

# cron (server): daily pull at 06:10, weekly report Monday 06:30
10 6 * * *  cd /root/apps/tic-tac-toe && node scripts/gsc/pull.mjs --days 7
30 6 * * 1  cd /root/apps/tic-tac-toe && node scripts/gsc/report.mjs --days 28
```
`data/gsc/` holds one NDJSON file per day (date, query, page, country, device, clicks, impressions, ctr,
position). Reports land in `reports/gsc-weekly-<date>.md`: totals, top pages, by section, non-brand queries,
pages with impressions but zero clicks, queries ranking 8 to 20. Brand regex: `--brand "kaizex|kulshresth"`.

## 6. Rich Results Test (needs the deployed URL)

search.google.com/test/rich-results, test: `/`, `/services/saas-backend-development`, `/projects/api-performance`.
Expect: FAQ (home, services), Breadcrumb (all inner pages). Article types (`TechArticle`) are not a rich
result type, so they validate in the Schema Markup Validator (validator.schema.org) instead.

## 7. Core Web Vitals

pagespeed.web.dev, mobile, for `/`, `/hire`, `/projects/api-performance`. Field data (CrUX) takes 28 days to
move. Local lab numbers from this change are in the hand-off message.
