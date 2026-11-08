# /hire offer positioning — Ad Library research (2026-11-08)

Context: validating which of the three `offers` in `src/pages/Hire.tsx`
(LLM/Chatbot Backends, API & Microservice Builds, Backend Audit & Scaling)
to lead with, using Meta Ad Library as a signal — an ad still running
60+ days means the advertiser is still paying for it, i.e. it's working.

Searched via Claude in Chrome, US, All ads, active ads only, as of
8 Nov 2026.

## Findings

**"AI chatbot for startups"** (~600 results, 118 advertisers scanned,
mostly off-topic noise):
- Long-running (60+ days) and relevant:
  - Pinch Marketing — running since 23 Jan 2024 (~1,020 days). Cheap,
    productized: "your first custom AI chatbot for less than $199/month."
  - Tapflare — since 3 Apr 2025 (~584 days). $649/mo dev subscription,
    not AI-specific.
  - Podium, Floot, Lead Gen Jay — all SaaS products or DIY tools, not
    dev-service agencies. They're substitutes for hiring a dev, not
    competitors selling the same service.
- Everything else under 8 weeks old (too early to read as validated).

**"backend API development agency"** — zero active US ads. Three
inactive ads, each ran only a few days before stopping.

**"backend audit startup"** — zero active US ads, ~130 inactive, none
relevant. (Audits likely sell via referral/LinkedIn, not cold FB ads —
absence here isn't evidence of no demand.)

**Supplementary: "backend development"** (~120 active ads) surfaced the
strongest actual build-service signal:
- Neelgai — since 20 Jan 2025 (~657 days). "4 devs, 4 months, $4K/month,"
  full MVP team.
- Creme Digital — since late May 2026 (~163 days). "Working MVP in two
  weeks… 200 client products."
- Kalyxi — since 1 May 2026 (~191 days). White-label AI backend for
  agencies.
- Beetroot — since 3 Jun 2026 (~158 days). Dev capacity for AI teams.

## Pattern across every real long-running build-service ad

Fixed scope + fixed price + explicit timeline + team size. Every ad that
survived 150+ days as an actual dev-service (not a SaaS product) is
packaged this way. None of them pitch as an open-ended "agency."

## Recommendation

Reframe the **API & Microservice Builds** offer away from an open-ended
agency pitch into a named, fixed-scope package with a concrete timeline
and price anchor — e.g. "MVP backend in 3 weeks, fixed price, you own
the code." This is the offer with the strongest actual market signal
and should lead.

Keep **LLM/Chatbot Backends** secondary, and position it against "yet
another SaaS chatbot tool" — ownership/customization is the wedge, not
price (the one surviving build-style chatbot ad, Pinch, wins on price
instead, which isn't a fit for Kulshresth's positioning).

Leave **Backend Audit & Scaling** as a quiet secondary/upsell offer —
the Ad Library has no signal either way for it, consistent with audits
being sold through outbound/referral rather than cold ads.

## Caveats

- Sample is partial: only ~188/600 results read for the first search.
- Ad Library shows start dates, not spend or revenue — a long run is a
  hint an ad pays for itself, not proof.
- "backend API development agency" / "backend audit startup" returning
  zero ads doesn't prove no demand, just that nobody's selling those
  with that exact framing on Facebook.
