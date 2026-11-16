#!/bin/bash
# Dijalankan cron di server hosting (DirectAdmin). Menarik versi terbaru dari GitHub bila ada commit baru,
# menimpa kode aplikasi (data/, .env, node_modules tidak tersentuh), lalu me-restart aplikasi Node.
# Tidak butuh kredensial: repo bersifat publik.
set -euo pipefail
REPO="ptakamendunia-creator/biruwebsite"
BRANCH="master"
APP="${APP_DIR:-/home/rentalmo/domains/biruwebsite.my.id/app}"
VENV="${NODE_VENV:-/home/rentalmo/nodevenv/domains/biruwebsite.my.id/app/24}"
STATE="$APP/.deployed_sha"
LOCK="/tmp/biru-deploy.lock"

exec 9>"$LOCK"; flock -n 9 || exit 0

NEW=$(curl -fsS --max-time 20 -H "Accept: application/vnd.github.sha" "https://api.github.com/repos/$REPO/commits/$BRANCH") || exit 0
[[ "$NEW" =~ ^[0-9a-f]{40}$ ]] || exit 0
OLD=$(cat "$STATE" 2>/dev/null || true)
[ "$NEW" = "$OLD" ] && exit 0

TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
curl -fsSL --max-time 120 "https://codeload.github.com/$REPO/tar.gz/$NEW" -o "$TMP/src.tgz"
tar -xzf "$TMP/src.tgz" -C "$TMP"
SRC=$(find "$TMP" -mindepth 1 -maxdepth 1 -type d | head -1)
[ -f "$SRC/server.js" ] || { echo "arsip tidak valid"; exit 1; }

PKG_OLD=$(cat "$APP/package-lock.json" 2>/dev/null | md5sum || true)
PKG_NEW=$(cat "$SRC/package-lock.json" | md5sum)

# Salin kode; lindungi data, env, dependensi, log.
tar -C "$SRC" --exclude=./data --exclude=./.env --exclude=./node_modules --exclude=./tmp --exclude=./stderr.log -cf - . | tar -C "$APP" -xf -

if [ "$PKG_OLD" != "$PKG_NEW" ] && [ -f "$VENV/bin/activate" ]; then
  # shellcheck disable=SC1091
  source "$VENV/bin/activate" && (cd "$APP" && npm install --omit=dev --no-audit --no-fund)
fi

echo "$NEW" > "$STATE"
mkdir -p "$APP/tmp" && touch "$APP/tmp/restart.txt"
echo "$(date -u +%FT%TZ) deployed $NEW"
