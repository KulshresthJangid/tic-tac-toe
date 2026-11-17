#!/usr/bin/env bash
# One-time, idempotent nginx patch for the /productivity section. Run on the server as root.
#   1. Adds "productivity" to the reserved-slug lookaheads so the Kaizex brand-slug
#      regexes stop swallowing /productivity (they would 301 it to /kaizex/productivity/).
#   2. Adds /productivity/transcriptor/ -> 127.0.0.1:8000 (the transcriptor container).
# /productivity itself is a React route, served by the existing `location /` fallback.
# Backs up the config first and restores it if `nginx -t` fails.
set -euo pipefail

CONF=/etc/nginx/conf.d/services.conf
BAK="$CONF.bak.$(date +%Y%m%d-%H%M%S)"
cp "$CONF" "$BAK"
echo "Backup: $BAK"

# 1. reserved slugs (skip if already patched)
if ! grep -q '(?!productivity|' "$CONF"; then
  sed -i.sedbak -E 's/\(\?!(lumen|assets)\|/(?!productivity|\1|/' "$CONF"
  rm -f "$CONF.sedbak"
fi
echo "Patched lookaheads: $(grep -c '(?!productivity|' "$CONF") (expected 4)"

# 2. transcriptor proxy block (skip if already present)
if ! grep -q 'location ^~ /productivity/transcriptor/' "$CONF"; then
  BLOCK=$(mktemp)
  cat > "$BLOCK" <<'NGX'
    # ===== PRODUCTIVITY: free transcriptor (docker compose app on 127.0.0.1:8000) =====
    # ^~ beats the brand-slug regex locations. Trailing slash on proxy_pass strips the
    # prefix; the app uses relative URLs so it works under this subpath.
    # Streaming NDJSON -> buffering off. Long timeouts: transcription is slow on CPU.
    location = /productivity/transcriptor {
        return 301 /productivity/transcriptor/;
    }
    location ^~ /productivity/transcriptor/ {
        proxy_pass         http://127.0.0.1:8000/;
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto https;
        client_max_body_size    4g;
        proxy_request_buffering off;
        proxy_buffering         off;
        proxy_read_timeout      3600s;
        proxy_send_timeout      3600s;
    }

NGX
  awk -v blk="$BLOCK" '/# ===== DEFAULT FALLBACK =====/ { while ((getline l < blk) > 0) print l } { print }' "$CONF" > "$CONF.new"
  mv "$CONF.new" "$CONF"
  rm -f "$BLOCK"
fi

if nginx -t; then
  systemctl reload nginx
  echo "nginx reloaded."
else
  echo "nginx -t FAILED, restoring backup."
  cp "$BAK" "$CONF"
  exit 1
fi
