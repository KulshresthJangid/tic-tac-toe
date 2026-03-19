# EchoPost — Marketing Operating System
## Architecture, System Design & Product Reference

> Internal codename: **SMAT**
> Version: 2.2.0 · Status: Production

---

## 1. Product Overview

### Positioning

EchoPost is **not** a content generator or a social media scheduler.

EchoPost is a **Marketing Operating System** — a structured pipeline that transforms raw organizational knowledge into consistent, high-quality content and automatically distributes it across platforms.

The product handles the full lifecycle:

```
Source → Insight → Content → Distribution
```

Every capability in the system serves this pipeline. Nothing is bolt-on.

### Core Differentiators

| Differentiator | Description |
|---|---|
| **Pipeline-first** | Every piece of content passes through validated stages — ingestion, extraction, generation, distribution — with audit at each step |
| **Insight-driven generation** | Content is produced from structured Insights extracted from your knowledge base, not from ad-hoc prompts — consistency is architectural |
| **Three automation modes** | Manual (full review), Review (AI drafts, human approves), Autopilot (zero-touch publishing) — teams choose their autonomy level |
| **BYO-AI** | Connect OpenAI, Anthropic, or any self-hosted LLM. No model lock-in. Persona and prompt templates are configurable per org, per channel |
| **Multi-tenant by design** | Row-level security, team RBAC, and org-scoped AI config from day one — not retrofitted |
| **Operational-grade** | Not prototype-quality. SLO tracking, error budget alerting, idempotent workers, dead-letter queues, distributed scheduling at 1M+ tasks/instance |

---

## 2. System Architecture

### High-Level Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        User (Browser)                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
┌───────────────────────────▼─────────────────────────────────────┐
│                     /smat-ui  (Next.js)                          │
│         Onboarding · Buckets · Sources · Insights · Posts        │
│         Scheduling · Analytics · AI Config · Review Queue        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ REST /api/v1/*  (JWT)
┌───────────────────────────▼─────────────────────────────────────┐
│                  /smat-server  (Spring Boot)                      │
│                                                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Auth + RBAC │  │  Ingestion   │  │   AI Processing Layer  │  │
│  │  (JWT/Org)  │  │  Pipeline    │  │  (Provider-agnostic)   │  │
│  └─────────────┘  └──────┬───────┘  └────────────┬───────────┘  │
│                          │                        │              │
│  ┌─────────────┐  ┌──────▼───────┐  ┌────────────▼───────────┐  │
│  │  Scheduling │  │  Post Gen    │  │   Execution Workers    │  │
│  │  (Redis)    │  │  Engine      │  │   (RabbitMQ consumers) │  │
│  └──────┬──────┘  └──────────────┘  └────────────┬───────────┘  │
│         │                                         │              │
└─────────┼─────────────────────────────────────────┼─────────────┘
          │                                         │
    ┌─────▼──────┐                         ┌────────▼─────────────┐
    │   Redis    │                         │  Platform Connectors  │
    │ (time-wheel│                         │  LinkedIn · X · IG    │
    │  sorted set│                         │  (OAuth2 per account) │
    └────────────┘                         └──────────────────────┘
```

---

### 2.1 Frontend — `/smat-ui`

**Stack:** Next.js 14, TypeScript, Tailwind CSS

**Responsibility:** All user interaction — onboarding, content workflow, configuration, and reporting. Stateless UI — all business logic lives in `/smat-server`.

**API integration layer:** All calls go through a typed API client module (`/smat-ui/lib/api/`). No frontend component talks directly to the backend; all requests are routed through this layer with JWT injection and error normalization.

#### Key Modules

| Module | Responsibility |
|---|---|
| `Onboarding` | Step-by-step setup wizard — org creation, first Bucket, first Source, first post generation. Designed for < 2 minute time-to-value. Demo content auto-populated. |
| `Buckets` | Topic-scoped content collections. Create, manage, and archive Buckets. Each Bucket has its own strategy config and channel assignments. |
| `Sources` | Ingest articles, notes, URLs, PDFs into a Bucket. Display ingestion + processing status per source. |
| `Insights` | Browse AI-extracted insights from each Source. Filter by signal type, relevance score, or recency. Select Insights for post generation. |
| `Posts` | Post editor with multi-platform preview. Inline review controls. Status progression (draft → review → approved → scheduled → published). |
| `Scheduling` | Calendar view + list view of scheduled posts. Drag-to-reschedule, per-platform slot management. |
| `Analytics` | Per-platform engagement metrics — reach, impressions, engagement rate. Strategy-pillar attribution and publishing performance over rolling windows. |
| `AI Config` | BYO-AI provider setup — API key, model selection, persona definition, system prompt templates. Per-channel persona override. |

#### Routing

```
/                     → Dashboard (active posts, slot summary, top Insights)
/onboarding           → Step wizard (org → bucket → source → first post)
/buckets              → Bucket list
/buckets/:id          → Bucket detail (Sources, Insights, Posts)
/sources/:id          → Source detail + extracted Insights
/posts                → All posts (filterable by status, platform, Bucket)
/posts/:id            → Post editor + preview
/schedule             → Scheduling calendar
/analytics            → Analytics dashboard
/settings/ai          → AI provider + persona config
/settings/channels    → Connected platform accounts
/settings/team        → Member management + RBAC
```

---

### 2.2 Backend — `/smat-server`

**Stack:** Java 21, Spring Boot 3.x, PostgreSQL, Redis, RabbitMQ, Elasticsearch

**Responsibility:** All processing, orchestration, storage, and execution. The frontend is a thin client over this API.

#### Core Modules

**Auth + Org + RBAC**
- JWT issuance and validation (Spring Security)
- Multi-tenant org model — every resource scoped to an org via row-level security
- Team roles: `owner` · `admin` · `editor` · `reviewer` · `viewer`
- Role enforcement at the API layer via JWT claim inspection — not in application business logic
- Immutable audit log on all org-scoped mutations
- OAuth2 connectors for platform accounts (LinkedIn, X) — per-org, per-channel token storage (encrypted at rest)

**Content Ingestion Pipeline**
- Source processors: URL scraper, PDF extractor, plain-text ingester
- Raw content normalized to a common document schema
- Documents indexed into Elasticsearch for full-text and semantic search
- Ingestion events published to RabbitMQ for async AI processing

**AI Processing Layer**
- Provider-agnostic LLM client: adaptor interface over OpenAI, Anthropic, self-hosted (Ollama-compatible)
- Org-level provider config resolved at request time (no global model dependency)
- Insight extraction: extracts structured signals (key claims, audience angles, strategic relevance scores) from ingested documents
- Prompt template engine: dynamic system prompts with org/channel persona variables — no hardcoded prompt strings

**Post Generation Engine**
- Accepts: selected Insights + target platform + persona context
- Produces: platform-native draft (character limits, hashtag conventions, CTA patterns per platform)
- Draft stored with lineage (which Insights it was generated from)
- Re-generation on demand with same Insight set

**Scheduling System**
- Redis sorted sets as the primary scheduling store (time-wheel algorithm)
- Posts enqueued with `scheduledAt` epoch score
- Polling worker sweeps due items into execution queue (RabbitMQ)
- Validated at 1M+ concurrent tasks per instance — sub-second scheduling accuracy
- At-least-once delivery guarantee; consumer idempotency enforced via deduplication key

**Execution Workers (RabbitMQ Consumers)**
- Per-platform worker pools
- Platform API calls with OAuth2 token refresh
- Publish lifecycle: executing → published / failed
- On failure: retry with exponential backoff, dead-letter queue after N attempts
- Publish result stored + analytics event emitted

**Platform Integrations**
- LinkedIn Publishing API (live) — org pages + personal profiles
- X / Twitter v2 API (in progress)
- Instagram Graph API (planned)
- Connector interface: each platform implements `PlatformConnector` — plugging in a new platform does not touch core publish logic

**Analytics Aggregation**
- Engagement metrics pulled from platform APIs on a scheduled basis
- Aggregated into PostgreSQL materialized views (per-platform, per-post, per-strategy-pillar)
- Exposed via `/api/v1/analytics/*`

---

## 3. End-to-End Flow

### User Flow

```
Signup
  └─ Onboarding wizard (/smat-ui)
       ├─ Create org
       ├─ (Auto) demo Bucket + 2–3 pre-loaded Sources created
       ├─ Connect platform account (LinkedIn)
       └─ One-click "Generate Post" → Review → Schedule → Publish

Normal operation:
  └─ Add Source (URL / note / document)
       └─ Ingestion processes + Insights extracted (async)
            └─ Browse Insights → Select → Generate Post
                 └─ Review (or auto-approve in Review/Autopilot mode)
                      └─ Schedule post
                           └─ Execution worker publishes to platform
```

### System Flow

```
/smat-ui Action          /smat-server Processing
─────────────────────────────────────────────────────────────────

POST /sources            → Source saved, ingestion job enqueued (RabbitMQ)
                          → Ingestion worker: extract + normalize text
                          → Content indexed to Elasticsearch
                          → AI processing job enqueued

(Async)                  → AI worker: LLM call (org provider + persona)
                          → Insights extracted + stored
                          → Insight-ready event: UI notified via polling

POST /posts/generate     → Insights + persona → LLM draft generation
                          → Draft stored (status: DRAFT)

PATCH /posts/:id/approve → Status DRAFT → APPROVED (reviewer role required)

POST /posts/:id/schedule → scheduledAt set, Redis sorted set updated
                          → Status: SCHEDULED

(Time-wheel sweep)       → Redis worker detects due item
                          → Execution job pushed to RabbitMQ

(RabbitMQ consumer)      → Platform connector: OAuth2 token refresh
                          → LinkedIn / X API call
                          → Status: PUBLISHED or FAILED
                          → Analytics event emitted
```

### Flow-to-Module Map

| UI Action | API Endpoint | Backend Module |
|---|---|---|
| Create org | `POST /orgs` | Auth + Org module |
| Ingest source | `POST /buckets/:id/sources` | Ingestion Pipeline |
| Browse insights | `GET /sources/:id/insights` | AI Processing Layer |
| Generate post | `POST /posts/generate` | Post Generation Engine |
| Approve post | `PATCH /posts/:id/status` | Post service + RBAC |
| Schedule post | `POST /posts/:id/schedule` | Scheduling System |
| Publish (auto) | Internal / RabbitMQ | Execution Workers |
| View analytics | `GET /analytics/posts` | Analytics Aggregation |
| Configure AI | `PUT /settings/ai` | AI Config module |

---

## 4. API Structure

All backend endpoints are served under:

```
/api/v1/...
```

Frontend API client base: `/smat-ui/lib/api/client.ts` → proxies to `/smat-server`

### Endpoint Groups

```
Auth
  POST   /api/v1/auth/signup
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh
  DELETE /api/v1/auth/logout

Org + Team
  GET    /api/v1/orgs/me
  PUT    /api/v1/orgs/me
  GET    /api/v1/orgs/me/members
  POST   /api/v1/orgs/me/invites
  PATCH  /api/v1/orgs/me/members/:id/role

Channels (Platform Accounts)
  GET    /api/v1/channels
  POST   /api/v1/channels/connect          ← initiates OAuth2 flow
  DELETE /api/v1/channels/:id
  GET    /api/v1/channels/:id/status

Buckets
  GET    /api/v1/buckets
  POST   /api/v1/buckets
  GET    /api/v1/buckets/:id
  PUT    /api/v1/buckets/:id
  DELETE /api/v1/buckets/:id

Sources
  POST   /api/v1/buckets/:bucketId/sources
  GET    /api/v1/buckets/:bucketId/sources
  GET    /api/v1/sources/:id
  DELETE /api/v1/sources/:id
  GET    /api/v1/sources/:id/status        ← ingestion + processing state

Insights
  GET    /api/v1/sources/:sourceId/insights
  GET    /api/v1/insights/:id
  PATCH  /api/v1/insights/:id              ← manual annotation

Posts
  GET    /api/v1/posts
  POST   /api/v1/posts/generate            ← insight IDs + channel + persona
  GET    /api/v1/posts/:id
  PUT    /api/v1/posts/:id
  DELETE /api/v1/posts/:id
  PATCH  /api/v1/posts/:id/status          ← approve / reject
  POST   /api/v1/posts/:id/regenerate

Scheduling
  POST   /api/v1/posts/:id/schedule
  PATCH  /api/v1/posts/:id/schedule        ← reschedule
  DELETE /api/v1/posts/:id/schedule        ← unschedule
  GET    /api/v1/schedule/slots?channel=&week=

Analytics
  GET    /api/v1/analytics/posts           ← per-post metrics
  GET    /api/v1/analytics/channels        ← per-platform aggregate
  GET    /api/v1/analytics/strategy        ← pillar attribution

AI Config
  GET    /api/v1/settings/ai
  PUT    /api/v1/settings/ai               ← provider, model, API key (encrypted)
  GET    /api/v1/settings/ai/personas
  POST   /api/v1/settings/ai/personas
  PUT    /api/v1/settings/ai/personas/:id
  DELETE /api/v1/settings/ai/personas/:id
```

---

## 5. Product Layers

```
┌─────────────────────────────────────────────────────────────┐
│  4. Growth Layer                                             │
│     Analytics · A/B signals · Referral · SEO content audit  │
├─────────────────────────────────────────────────────────────┤
│  3. Business Layer                                           │
│     Pricing plans · Feature limits · Billing (Stripe)        │
│     Usage metering · Seat limits · API quotas               │
├─────────────────────────────────────────────────────────────┤
│  2. Product Layer                                            │
│     Onboarding wizard · Time-to-value flow · Review UX       │
│     Autopilot mode · Notifications · Team collaboration      │
├─────────────────────────────────────────────────────────────┤
│  1. Core Engine                                              │
│     Ingestion · Insight extraction · Post generation         │
│     Scheduling · Execution · Platform integrations          │
│     BYO-AI · Multi-tenant RBAC · Observability              │
└─────────────────────────────────────────────────────────────┘
```

### Layer Definitions

**Core Engine** (Layer 1) — Exists. The pipeline, AI layer, scheduling, and execution system are production-grade.

**Product Layer** (Layer 2) — Partially built. Onboarding wizard needs a fast time-to-value path. Review UX in `/smat-ui` needs polish. Autopilot mode end-to-end needs validation. Notifications (email, in-app) not yet implemented.

**Business Layer** (Layer 3) — Not built. No billing, no plan limits, no usage metering. This is the primary gap between a working system and a monetizable SaaS.

**Growth Layer** (Layer 4) — Not built. Analytics exist for content performance but there is no acquisition tracking, referral mechanism, or growth-oriented instrumentation.

---

## 6. Gaps and Required Fixes

### Security

| Issue | Severity | Fix |
|---|---|---|
| JWT secrets must not be in application.properties | Critical | Move to environment variables / secrets manager (HashiCorp Vault or AWS Secrets Manager) |
| OAuth2 platform tokens stored — ensure encryption at rest | High | Verify AES-256 or equivalent encryption on platform token columns |
| No rate limiting on auth endpoints | High | Add Spring rate limiter on `/api/v1/auth/*` — prevent credential stuffing |
| AI provider API keys in DB need encryption at rest | High | Encrypt at application layer before persistence; decrypt on read |
| Audit log completeness | Medium | Ensure all org-scoped mutations emit an audit event — spot-check coverage |

### Missing Features

| Feature | Priority | Notes |
|---|---|---|
| Billing / subscription management | Critical | Stripe integration, plan enforcement, feature gates |
| Email notifications | High | Post published, review pending, ingestion complete |
| In-app notification center | High | Real-time or polling for status changes |
| Autopilot mode end-to-end | High | Auto-approve path through the pipeline, configurable per Bucket |
| Account deletion + data export | High | GDPR/compliance requirement |
| X / Twitter connector | Medium | OAuth2 flow started, publishing not complete |
| Instagram connector | Low | Planned; Graph API requires business account |
| Webhook support | Low | Let orgs subscribe to post lifecycle events |

### UX / Time-to-Value Gaps

| Gap | Fix |
|---|---|
| New user reaches an empty dashboard | Auto-create demo Bucket + pre-load 2 Sources on first login; surface "Generate your first post" CTA immediately |
| AI provider config blocks first use | Provide a system-default provider for first N generations (or trial tier) — remove config as a prerequisite for value |
| No default strategy template | Ship a generic strategy template (pillars: expertise, perspective, story, announcement) usable without customization |
| Scheduling UX needs drag-and-drop | Calendar view without drag interaction is low adoption; prioritize UX polish |

### Platform Gaps

| Platform | Status | Remaining Work |
|---|---|---|
| LinkedIn | Live | Org pages + personal profiles working; rich media (carousel) posts not yet supported |
| X / Twitter | In progress | OAuth2 + basic text posting near complete; media upload and thread support pending |
| Instagram | Planned | Business account requirement blocks testing; Graph API integration not started |
| Facebook Pages | Not planned | Evaluate against demand |

### Operational Gaps

| Gap | Fix |
|---|---|
| No structured onboarding telemetry | Instrument each onboarding step to measure where users drop off |
| Dead-letter queue monitoring | Ensure DLQ alerts surface to on-call immediately; add DLQ size to Grafana dashboards |
| No synthetic canary post | Run a scheduled synthetic publish test to verify the full execution path is live |

---

## 7. Final Summary

EchoPost has a production-grade core engine. The four-stage pipeline works end-to-end. BYO-AI is live. Scheduling handles scale. Multi-tenant RBAC is enforced. LinkedIn is publishing.

What it lacks to be a commercially viable SaaS:

1. **Billing** — no plan, no limits, no revenue path
2. **Onboarding polish** — the time-to-value path is slower than it needs to be; the demo content auto-seeding is the fastest fix
3. **Platform breadth** — LinkedIn alone is not a compelling distribution story for most buyers; X/Twitter completion is the immediate priority
4. **Notifications** — without email/in-app notifications, users have no reason to return after initial setup

The technical architecture is sound. The product gap is in the layers above the engine: product flow, business model, and growth instrumentation. These are sequencing problems, not structural ones.

**Recommended next build sequence:**
1. Time-to-value onboarding (demo Bucket + default strategy + first-post flow)
2. X / Twitter connector completion
3. Billing (Stripe, plan enforcement)
4. Email notifications (post published, review pending)
5. Autopilot mode end-to-end validation
6. Security audit (secrets, JWT, API key encryption)

---

*Last updated: March 2026 · EchoPost v2.2.0*
