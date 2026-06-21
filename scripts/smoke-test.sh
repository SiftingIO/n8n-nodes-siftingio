#!/usr/bin/env bash
#
# Smoke-test the SiftingIO API with a real key to validate the request contract the
# n8n node builds (paths, query params, gzip handling, tier gating).
#
# Key resolution order:
#   1. $SIFTINGIO_KEY environment variable
#   2. ~/.siftingio_key file (first non-whitespace token)
#
# The key is never echoed. Usage:  bash scripts/smoke-test.sh
set -uo pipefail

BASE="${SIFTINGIO_BASE:-https://api.sifting.io}"
KEY="${SIFTINGIO_KEY:-}"
if [ -z "$KEY" ] && [ -f "$HOME/.siftingio_key" ]; then
	KEY="$(tr -d '[:space:]' < "$HOME/.siftingio_key")"
fi
if [ -z "$KEY" ]; then
	echo "No API key found. Set SIFTINGIO_KEY or write it to ~/.siftingio_key" >&2
	exit 1
fi

pass=0
fail=0

hit() {
	local label="$1" path="$2"
	shift 2
	local out code body
	# --compressed mirrors the node's Accept-Encoding: gzip handling.
	out="$(curl -s -w $'\n%{http_code}' --compressed -H "X-API-Key: $KEY" "$@" "$BASE$path")"
	code="${out##*$'\n'}"
	body="${out%$'\n'*}"
	if [ "$code" = "200" ]; then
		pass=$((pass + 1))
		printf "  OK   %-3s %-22s %s\n" "$code" "$label" "$(printf '%s' "$body" | head -c 88 | tr '\n' ' ')"
	else
		fail=$((fail + 1))
		printf "  FAIL %-3s %-22s %s\n" "$code" "$label" "$(printf '%s' "$body" | head -c 120 | tr '\n' ' ')"
	fi
}

echo "Base: $BASE"
echo "-- Credential test endpoint --"
hit "markets/status" "/v1/fnd/markets/status"
echo "-- Fundamentals --"
hit "search" "/v1/fnd/stocks/search?q=apple&limit=2"
hit "profile" "/v1/fnd/stocks/AAPL/profile"
hit "filings" "/v1/fnd/stocks/AAPL/filings?form=10-K&limit=2"
hit "ratios" "/v1/fnd/stocks/AAPL/ratios"
hit "economic-calendar" "/v1/fnd/economic-calendar?limit=2"
echo "-- Financials (gzip) --"
hit "financials concept" "/v1/fnd/stocks/AAPL/financials/Revenues"
echo "-- Historical (gzip) --"
hit "crypto bars" "/v1/hist/crypto/BTCUSD/bars?start=2025-06-01&interval=1h&limit=2"
echo "-- Live --"
hit "last quote" "/v1/last/quote/crypto/BTCUSD"
echo "-- Convert --"
hit "convert" "/v1/convert/USD/EUR?amount=100"

echo ""
echo "Passed: $pass   Failed/blocked: $fail"
