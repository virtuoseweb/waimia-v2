#!/usr/bin/env bash
# Phase 5 · Validation post-deploy `cal.waimia.com`
#
# Usage :
#   bash scripts/cal-deploy-validate.sh                       # → cal.waimia.com
#   bash scripts/cal-deploy-validate.sh waimia-cal-xxx.vercel.app  # → preview URL
#
# Couvre les 4 smoke tests de docs/cal-deploy-runbook.md §8 :
#   1. Page de connexion 200
#   2. /api/health JSON ok
#   3. Embed iframe public 200
#   4. Cookies NextAuth set sur le bon domaine
#
# Exit 0 si tous verts, 1 si au moins un rouge.

set -euo pipefail

HOST="${1:-cal.waimia.com}"
URL="https://${HOST}"

# Couleurs
GREEN=$'\033[0;32m'
RED=$'\033[0;31m'
YELLOW=$'\033[0;33m'
BLUE=$'\033[0;36m'
RESET=$'\033[0m'

ok() { echo "${GREEN}✓${RESET} $*"; }
ko() { echo "${RED}✗${RESET} $*"; FAIL=1; }
note() { echo "${BLUE}→${RESET} $*"; }
warn() { echo "${YELLOW}!${RESET} $*"; }

FAIL=0

echo
echo "${BLUE}=== Cal.waimia.com smoke test · ${URL} ===${RESET}"
echo

# ───── 0. DNS resolution ─────
note "0. DNS resolution"
DNS_TARGET="$(dig +short CNAME "$HOST" 2>/dev/null | head -1)"
if [ -z "$DNS_TARGET" ]; then
  warn "Pas de CNAME trouvé pour ${HOST}. Si tu testes une URL preview Vercel, c'est normal."
elif echo "$DNS_TARGET" | grep -qE "vercel-dns\.com\.?$"; then
  ok "CNAME → ${DNS_TARGET%?}"
else
  ko "CNAME inattendu : ${DNS_TARGET} (attendu : *.vercel-dns.com.)"
fi
echo

# ───── 1. Page de connexion ─────
note "1. Page de connexion (/auth/login)"
STATUS_LOGIN="$(curl -sk -o /dev/null -w '%{http_code}' "${URL}/auth/login" || echo "000")"
if [ "$STATUS_LOGIN" = "200" ]; then
  ok "/auth/login → HTTP 200"
elif [ "$STATUS_LOGIN" = "302" ] || [ "$STATUS_LOGIN" = "307" ]; then
  warn "/auth/login → HTTP ${STATUS_LOGIN} (redirect — vérifier NEXTAUTH_URL cohérent)"
else
  ko "/auth/login → HTTP ${STATUS_LOGIN}"
fi
echo

# ───── 2. /api/health ─────
note "2. /api/health (Cal.com endpoint healthcheck)"
HEALTH_BODY="$(curl -sk "${URL}/api/health" || echo '{}')"
if echo "$HEALTH_BODY" | grep -qE '"status"[[:space:]]*:[[:space:]]*"ok"'; then
  ok "/api/health → ${HEALTH_BODY:0:80}..."
else
  ko "/api/health body inattendu : ${HEALTH_BODY:0:200}"
fi
echo

# ───── 3. Embed public (slug Waimia) ─────
note "3. Embed public /simonberos/audit"
STATUS_EMBED="$(curl -sk -o /dev/null -w '%{http_code}' "${URL}/simonberos/audit" || echo "000")"
if [ "$STATUS_EMBED" = "200" ]; then
  ok "/simonberos/audit → HTTP 200 (event type publié + accessible)"
elif [ "$STATUS_EMBED" = "404" ]; then
  ko "/simonberos/audit → 404 (créer le event type 'audit' dans l'admin)"
else
  ko "/simonberos/audit → HTTP ${STATUS_EMBED}"
fi
echo

# ───── 4. Cookies NextAuth ─────
note "4. Cookies NextAuth domain check"
CK_FILE="$(mktemp -t cal-cookies.XXXXXX)"
curl -sk -o /dev/null -c "$CK_FILE" "${URL}/auth/login" || true
DOMAIN_COUNT="$(grep -cE "^[^#]*${HOST}" "$CK_FILE" 2>/dev/null || echo "0")"
if [ "$DOMAIN_COUNT" -ge 1 ]; then
  ok "Cookies NextAuth set sur Domain=${HOST} (count=${DOMAIN_COUNT})"
else
  warn "Aucun cookie NextAuth set pour ${HOST} (peut être normal sur /auth/login GET, ré-essayer après login réel)"
fi
rm -f "$CK_FILE"
echo

# ───── 5. Latence (bonus) ─────
note "5. Latence end-to-end (bonus)"
LATENCY="$(curl -sk -o /dev/null -w '%{time_total}' "${URL}/" || echo "0")"
LATENCY_MS="$(awk -v t="$LATENCY" 'BEGIN { printf "%d", t * 1000 }')"
if [ "$LATENCY_MS" -lt 2000 ]; then
  ok "Homepage rendue en ${LATENCY_MS} ms"
elif [ "$LATENCY_MS" -lt 5000 ]; then
  warn "Latence haute : ${LATENCY_MS} ms (cold start probable, refaire 1 hit)"
else
  ko "Latence > 5s : ${LATENCY_MS} ms (build size ? region Vercel ? cold start mémoire ?)"
fi
echo

# ───── Verdict ─────
if [ "$FAIL" -eq 0 ]; then
  echo "${GREEN}=== VERDICT : ✅ tous les smoke tests passent ===${RESET}"
  echo "${BLUE}→${RESET} Étape suivante : bumper apps/web/.../CalEmbed.astro vers ${URL}"
  echo "${BLUE}→${RESET} Cf docs/cal-deploy-runbook.md §9 (migration trafic)"
  exit 0
else
  echo "${RED}=== VERDICT : ❌ au moins un test rouge ===${RESET}"
  echo "${BLUE}→${RESET} Cf docs/cal-deploy-runbook.md §11 (troubleshooting)"
  exit 1
fi
