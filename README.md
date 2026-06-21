# n8n-nodes-siftingio

This is an [n8n](https://n8n.io/) community node. It lets you use the
[SiftingIO](https://sifting.io) financial-data API in your n8n workflows.

SiftingIO is a single API for US capital-markets data: SEC filings and extracted
filing text, standardized XBRL financials, an economic calendar, global market
hours, historical OHLCV bars, live quotes/trades, currency conversion, and DEX
wallet portfolios.

[Installation](#installation) · [Credentials](#credentials) · [Operations](#operations) · [Resources](#resources)

## Installation

Follow the
[installation guide](https://docs.n8n.io/integrations/community-nodes/installation/)
in the n8n community nodes documentation.

In n8n: **Settings → Community Nodes → Install** and enter `n8n-nodes-siftingio`.

## Credentials

You need a SiftingIO API key (`sft_…`). Create one in your
[SiftingIO dashboard](https://sifting.io). In n8n, add a **SiftingIO API**
credential and paste the key. The credential sends it as the `X-API-Key` header.

## Operations

The **SiftingIO** node groups operations by resource:

- **Discovery** – ticker/company search, company profile.
- **SEC Filing** – list filings, get one, 8-K material events, 13D/G ownership, DEF 14A proxy, earnings history.
- **Filing Text** – extract all sections, extract one section, Risk Factors year-over-year diff.
- **Financials (XBRL)** – full bundle, single concept, cross-sectional screener, fundamental ratios.
- **Holdings** – insider (Form 3/4/5) transactions, 13F-HR institutional holdings.
- **Economic Calendar** – upcoming US economic events (CPI, NFP, FOMC, …).
- **Market** – list markets, open/closed status, weekly hours, holiday calendars.
- **Historical** – OHLCV bars for stocks, forex, crypto, DEX, and commodities.
- **Live** – last trade, top-of-book quote, full-venue snapshot, DEX TVL.
- **Convert** – live FX/crypto currency conversion.
- **DEX Wallet** – on-chain wallet portfolio.

The node is also usable as a **tool** for n8n AI Agents (`usableAsTool`).

### Full operation list

| Resource | Operation | Endpoint |
| --- | --- | --- |
| Discovery | Search | `GET /v1/fnd/stocks/search` |
| Discovery | Get Company Profile | `GET /v1/fnd/stocks/{ticker}/profile` |
| SEC Filing | List Filings | `GET /v1/fnd/stocks/{ticker}/filings` |
| SEC Filing | Get Filing | `GET /v1/fnd/stocks/{ticker}/filings/{accession}` |
| SEC Filing | Get Material Events (8-K) | `GET /v1/fnd/stocks/{ticker}/events` |
| SEC Filing | Get Ownership (13D/G) | `GET /v1/fnd/stocks/{ticker}/ownership` |
| SEC Filing | Get Proxy Statements (DEF 14A) | `GET /v1/fnd/stocks/{ticker}/compensation` |
| SEC Filing | Get Earnings History | `GET /v1/fnd/stocks/{ticker}/earnings` |
| Filing Text | Get All Sections | `GET /v1/fnd/stocks/{ticker}/filings/{accession}/sections` |
| Filing Text | Get One Section | `GET /v1/fnd/stocks/{ticker}/filings/{accession}/sections/{section}` |
| Filing Text | Get Risk Factors Diff | `GET /v1/fnd/stocks/{ticker}/risk-factors-diff` |
| Financials | Get Full Bundle | `GET /v1/fnd/stocks/{ticker}/financials` |
| Financials | Get Concept | `GET /v1/fnd/stocks/{ticker}/financials/{concept}` |
| Financials | Screener | `GET /v1/fnd/stocks/screener/{concept}/{period}` |
| Financials | Get Ratios | `GET /v1/fnd/stocks/{ticker}/ratios` |
| Holdings | Get Insider Transactions | `GET /v1/fnd/stocks/{ticker}/insiders` |
| Holdings | Get 13F Holdings | `GET /v1/fnd/filers/{filer}/holdings` |
| Economic Calendar | List Events | `GET /v1/fnd/economic-calendar` |
| Market | List Markets | `GET /v1/fnd/markets` |
| Market | Get Status (All / One) | `GET /v1/fnd/markets[/{market}]/status` |
| Market | Get Hours | `GET /v1/fnd/markets/{market}/hours` |
| Market | Get Calendar | `GET /v1/fnd/markets/{market}/calendar` |
| Historical | Get Stock / Forex / Crypto / DEX / Commodities Bars | `GET /v1/hist/{class}/{symbol}/bars` |
| Live | Get Last Trade / Quote | `GET /v1/last/{trade\|quote}/{venue}/{symbol}` |
| Live | Get Snapshot | `GET /v1/snapshot/{venue}` |
| Live | Get DEX TVL | `GET /v1/last/tvl/{chain}/{pair}` |
| Convert | Get Rate | `GET /v1/convert/{from}/{to}` |
| DEX Wallet | Get Portfolio | `GET /v1/fnd/dex/wallet/{chain}/{address}` |

Cursor-paginated list operations expose a **Return All** toggle; gzip-heavy endpoints
are handled automatically (the node always sends `Accept-Encoding: gzip`).

## Resources

- [SiftingIO API documentation](https://sifting.io/docs)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## Local development

```bash
npm install --ignore-scripts   # n8n pulls a native dep (isolated-vm) we don't need to build
npm run build                  # tsc + copy icon & codex into dist/
npm run lint                   # eslint-plugin-n8n-nodes-base (verification rules)
```

To try the node in a local n8n instance, link the built package into `~/.n8n/custom`
and run n8n. **Run n8n on Node.js 20 LTS** — n8n's task runner depends on `isolated-vm`,
which does not compile on very new Node versions (e.g. Node 26).

## Compatibility

Requires n8n with `n8nNodesApiVersion: 1`. Built against `n8n-workflow` 2.x.

## License

[MIT](LICENSE.md)
