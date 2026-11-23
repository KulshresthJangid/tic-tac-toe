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
# Not handled here: unknown single-segment paths such as /zzz-random are currently caught by the
# Kaizex brand-slug regexes (301 -> /kaizex/<slug>/). That needs the live regexes; see
# `--inspect` output and the note printed at the end.
set -euo pipefail

CONF=/etc/nginx/conf.d/services.conf
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

python3 - "$CONF" "$DEST" "$MARK_BEGIN" "$MARK_END" "$TOP_PAGES" <<'PY'
import re, sys
conf, dest, mark_begin, mark_end, top = sys.argv[1:6]
s = open(conf).read()

# 1. drop the old `location = /kaizex { return 301 /kaizex/; }` (we define /kaizex exactly below)
s, n = re.subn(r'\n[ \t]*location\s*=\s*/kaizex\s*\{[^{}]*\}[ \t]*', '\n', s)
print(f"removed old `location = /kaizex`: {n}")

# 2. reserved slugs
if '(?!services|blog|' not in s:
    s, n = re.subn(r'\(\?!productivity\|', '(?!services|blog|productivity|', s)
    print(f"lookaheads patched: {n} (expected 4; 0 means productivity patch was never applied, check --inspect)")

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
else:
    print("WARNING: default fallback block did not contain `try_files $uri $uri/ /index.html;`; unknown paths there still return 200. Check --inspect.")

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
