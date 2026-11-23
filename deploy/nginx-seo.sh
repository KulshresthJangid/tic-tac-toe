#!/usr/bin/env bash
# Idempotent nginx patch for SEO / indexing hygiene on buildwithkulshresth.com.
# Run on the server as root, AFTER the new build is deployed (deploy.sh), because
# it relies on the flat <route>.html files and 404.html that prerender.mjs writes.
#
#   ./nginx-seo.sh --inspect   read-only: print the parts of services.conf this patch depends on
#   ./nginx-seo.sh             apply (backs up first, rolls back if `nginx -t` fails)
#
# What it does, in /etc/nginx/conf.d/services.conf:
#   1. 301 /kaizex, /kaizex/, /kaizex/kaizex, /kaizex/kaizex/ -> /projects/social-saas
#      (replaces the old `location = /kaizex { return 301 /kaizex/; }`).
#   2. Adds services|blog to the reserved-slug lookaheads, like deploy/nginx-productivity.sh did
#      for "productivity", so the Kaizex brand-slug regexes stop swallowing the new sections.
#   3. Serves every site route as /<route> (no trailing slash) straight from the flat .html
#      files, 301s the trailing-slash form to it, and returns a REAL 404 (with 404.html,
#      which is noindex) for anything that is not a file or a known route.
#   4. Adds X-Robots-Tag: noindex for the private SPA routes (/admin, /ai-ml, /dsa*).
#
#   6. Adds X-Robots-Tag noindex to `location /kaizex/` (the product UI answers 200 for any slug).
#   5. Restricts the two catch-all brand-slug regexes (`^/<any-slug>$` and `^/<any-slug>/(.*)$`,
#      which 301 to /kaizex/<slug>/...) to BRAND_SLUGS (default "zoralis"), so unknown paths such as
#      /zzz-random fall through to the real 404. Override: BRAND_SLUGS="zoralis|acme" ./nginx-seo.sh
set -euo pipefail

CONF=/etc/nginx/conf.d/services.conf
# Real tenant brand slugs that keep the /<brand> -> /kaizex/<brand>/ shorthand. Pipe-separated.
# Anything else at the top level is no longer redirected into Kaizex and gets a real 404.
BRAND_SLUGS="${BRAND_SLUGS:-zoralis}"
[[ "$BRAND_SLUGS" =~ ^[a-z0-9_|-]+$ ]] || { echo "BRAND_SLUGS must match [a-z0-9_|-]+"; exit 1; }
DEST=/var/www/tic-tac-toe
MARK_BEGIN='# ===== SEO ROUTES (managed by deploy/nginx-seo.sh) ====='
MARK_END='# ===== END SEO ROUTES ====='

if [[ "${1:-}" == "--inspect" ]]; then
  echo "--- brand-slug / reserved-slug lookaheads"
  grep -nE '\(\?!' "$CONF" || true
  echo "--- every 'return 301' line"
  grep -nE 'return 301' "$CONF" || true
  echo "--- default fallback block"
  grep -n -A12 'DEFAULT FALLBACK' "$CONF" || true
  echo "--- /kaizex locations"
  grep -nE 'location.*kaizex' "$CONF" || true
  exit 0
fi

BAK="$CONF.bak.$(date +%Y%m%d-%H%M%S)_pre-seo"
cp "$CONF" "$BAK"
echo "Backup: $BAK"

# Routes with a flat <route>.html in $DEST (keep in sync with src/seo/manifest.ts).
TOP_PAGES="about hire privacy terms projects apps productivity blog"

python3 - "$CONF" "$DEST" "$MARK_BEGIN" "$MARK_END" "$TOP_PAGES" "$BRAND_SLUGS" <<'PY'
import re, sys
conf, dest, mark_begin, mark_end, top, brands = sys.argv[1:7]
s = open(conf).read()

# 1. drop the old `location = /kaizex { return 301 /kaizex/; }` (we define /kaizex exactly below)
s, n = re.subn(r'\n[ \t]*location\s*=\s*/kaizex/?\s*\{[^{}]*\}[ \t]*', '\n', s)
print(f"removed old `location = /kaizex` and `= /kaizex/`: {n} (expected 2)")

# 2. reserved slugs
if '(?!services|blog|' not in s:
    s, n = re.subn(r'\(\?!productivity\|', '(?!services|blog|productivity|', s)
    print(f"lookaheads patched: {n} (expected 4; 0 means productivity patch was never applied, check --inspect)")

# 2b. brand allowlist: the two catch-all regexes whose lookahead excludes kaizex
s, n1 = re.subn(r'location ~ \^/\(\(\?!([^)]*\|kaizex\|[^)]*)\)\[a-z0-9_-\]\+\)\$ \{', 'location ~ ^/(' + brands + ')$ {', s)
s, n2 = re.subn(r'location ~ \^/\(\?!([^)]*\|kaizex\|[^)]*)\)\(\[a-z0-9_-\]\+\)/\(\.\*\)\$ \{', 'location ~ ^/(' + brands + ')/(.*)$ {', s)
print(f"brand catch-all regexes restricted to ({brands}): {n1} + {n2} (expected 1 + 1; 0 + 0 means already applied)")

# 3. managed block
if mark_begin in s:
    s = re.sub(re.escape(mark_begin) + r'.*?' + re.escape(mark_end) + r'\n?', '', s, flags=re.S)

pages = top.split()
lines = [mark_begin,
         "    # Real 404 page (prerendered, noindex). `internal` so /404.html itself is not a public URL.",
         f"    location = /404.html {{ internal; root {dest}; }}",
         "",
         "    # Kaizex product URLs that Google indexed as soft-404s now go to the case study.",
         "    location = /kaizex          { return 301 /projects/social-saas; }",
         "    location = /kaizex/         { return 301 /projects/social-saas; }",
         "    location = /kaizex/kaizex   { return 301 /projects/social-saas; }",
         "    location = /kaizex/kaizex/  { return 301 /projects/social-saas; }",
         "",
         "    # Homepage",
         f"    location = / {{ root {dest}; try_files /index.html =404; error_page 404 /404.html; }}",
         ""]
for p in pages:
    lines += [f"    location = /{p}  {{ root {dest}; try_files /{p}.html =404; error_page 404 /404.html; }}",
              f"    location = /{p}/ {{ return 301 /{p}; }}"]
lines += ["",
          "    # Sections with one page per slug: /projects/<id>, /services/<slug>, /blog/<slug>",
          "    location = /services { return 301 /hire; }",
          "    location = /services/ { return 301 /hire; }"]
for sec in ("projects", "services", "blog"):
    lines += [f"    location ^~ /{sec}/ {{",
              f"        rewrite ^/{sec}/(.+)/$ /{sec}/$1 permanent;",
              f"        root {dest};",
              "        try_files $uri.html =404;",
              "        error_page 404 /404.html;",
              "    }"]
lines += ["",
          "    # Private SPA routes: serve the app shell, never index it.",
          "    location ^~ /admin  { root " + dest + "; add_header X-Robots-Tag \"noindex, nofollow\" always; try_files /index.html =404; }",
          "    location ^~ /ai-ml  { root " + dest + "; add_header X-Robots-Tag \"noindex, nofollow\" always; try_files /index.html =404; }",
          "    location ^~ /dsa    { root " + dest + "; add_header X-Robots-Tag \"noindex, nofollow\" always; try_files /index.html =404; }",
          mark_end, ""]
block = "\n".join(lines)

anchor = '# ===== DEFAULT FALLBACK ====='
if anchor not in s:
    sys.exit("DEFAULT FALLBACK marker not found in services.conf; refusing to guess where to insert. Run --inspect and send me the output.")
s = s.replace(anchor, block + "\n    " + anchor, 1)

# 4. default fallback: stop answering 200 + index.html for unknown paths
i = s.index(anchor)
j = s.find('location /', i)
k = s.find('}', j)
fb = s[j:k]
if 'try_files $uri $uri/ /index.html;' in fb:
    new = fb.replace('try_files $uri $uri/ /index.html;', 'try_files $uri $uri.html =404;\n        error_page 404 /404.html;')
    s = s[:j] + new + s[k:]
    print("default fallback now returns 404 for unknown paths")
elif 'try_files $uri $uri.html =404;' in fb:
    print("default fallback already returns 404 for unknown paths")
else:
    print("WARNING: default fallback block did not contain `try_files $uri $uri/ /index.html;`; unknown paths there still return 200. Check --inspect.")

# 5. /kaizex/ is the product UI (a client-rendered app that answers 200 "Loading..." for ANY slug, so Google
#    indexes junk like /kaizex/foo/ as soft-404s). Keep the whole section out of the index.
NOINDEX = 'add_header X-Robots-Tag "noindex, nofollow" always;'
m = re.search(r'location /kaizex/ \{', s)
if m:
    end = s.find('}', m.end())
    if NOINDEX not in s[m.end():end]:
        s = s[:m.end()] + '\n        ' + NOINDEX + s[m.end():]
        print("noindex header added to `location /kaizex/`")
    else:
        print("`location /kaizex/` already sends noindex")
else:
    print("WARNING: `location /kaizex/ {` not found; /kaizex/* is still indexable")

open(conf, 'w').write(s)
PY

if nginx -t; then
  systemctl reload nginx
  echo "nginx reloaded."
else
  echo "nginx -t FAILED, restoring backup."
  cp "$BAK" "$CONF"
  exit 1
fi

cat <<'NOTE'

Next: unknown single-segment URLs (e.g. /zzz-random) are still caught by the Kaizex brand-slug
regexes and answer 301 -> /kaizex/<slug>/ (then 200 "Loading..."). Fixing that means deciding which
slugs are real brands. Run `./nginx-seo.sh --inspect` and review the regex blocks.

Verify:  npm run verify:live   (from the repo, or: node scripts/verify-live.mjs https://buildwithkulshresth.com)
NOTE
