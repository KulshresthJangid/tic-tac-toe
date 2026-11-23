// Landing pages for what clients actually search for. Every number below is
// lifted from a case study in projects.ts, so keep them in sync if a case
// study changes. `lastmod` is the date the page copy last meaningfully changed
// and feeds the sitemap.

export interface ServiceFaq {
  q: string
  a: string
}

export interface ServiceOutcome {
  metric: string
  detail: string
  projectId: string
  /** Descriptive anchor text for the link to the case study. */
  anchor: string
}

export interface ServiceSection {
  heading: string
  paragraphs: string[]
}

export interface ServicePageData {
  slug: string
  /** <title>, kept under 60 characters. */
  title: string
  /** meta description, kept under 155 characters. */
  description: string
  h1: string
  eyebrow: string
  /** Short label used in nav, footer and cross-links. */
  navLabel: string
  intro: string
  serviceType: string
  lastmod: string
  datePublished: string
  sections: ServiceSection[]
  stack: string[]
  outcomes: ServiceOutcome[]
  faqs: ServiceFaq[]
  /** Slugs of sibling services to cross-link at the bottom. */
  related: string[]
}

export const services: ServicePageData[] = [
  {
    slug: 'saas-backend-development',
    title: 'SaaS Backend Development, Freelance | Kulshresth Jangid',
    description:
      'Freelance SaaS backend development: multi-tenant APIs, auth, queues and deployment, built fixed scope and fixed price by one senior engineer.',
    h1: 'SaaS backend development for early-stage teams',
    eyebrow: 'Service / SaaS backend',
    navLabel: 'SaaS backend development',
    intro:
      'A SaaS backend has to do three unglamorous things well before it does anything clever: keep each customer’s data separate, run slow work off the request path, and make it obvious when something breaks. I build that foundation for early-stage teams as a fixed-scope, fixed-price project, and you own the code at the end.',
    serviceType: 'SaaS Backend Development',
    lastmod: '2026-11-21',
    datePublished: '2026-11-21',
    sections: [
      {
        heading: 'The problem with most first SaaS backends',
        paragraphs: [
          'Early SaaS backends tend to fail in the same three places. Tenancy is bolted on after the first larger customer asks how their data is isolated, which means rewriting every query. Slow work such as AI calls, emails and third-party API requests runs inside the HTTP request, so one slow provider degrades the whole product. And nobody can tell why something broke, because logs, metrics and deploys were never set up.',
          'None of this shows up in a demo. All of it shows up the week you onboard your tenth customer, usually while you are trying to close the eleventh.',
        ],
      },
      {
        heading: 'How I build it',
        paragraphs: [
          'Scope and the data model come first, because those are the decisions that are expensive to change later. We agree a written scope with a fixed price, then I design the schema, authentication and tenant model before any feature work. Every table and query is scoped to an organisation from day one, with role-based permissions seeded when an organisation is created. On Kaizex, a multi-tenant content platform I built, that means 15 default permissions seeded per organisation and method-level authorisation on every endpoint.',
          'Next come the core product flows and the asynchronous plumbing. Anything slow goes onto a queue instead of the request path. Kaizex runs three independent RabbitMQ pipelines for knowledge extraction, AI generation and platform dispatch, each failure-isolated so one stuck provider cannot stall the others. Scheduled work uses Redis time slots, 24 hourly buckets per day, instead of a heavyweight scheduler.',
          'The last stretch is tests, deployment and handover: CI, Docker images, environment configuration, database migrations through Liquibase or Flyway, basic dashboards and alerts, and a written handover so your next engineer can run and extend it without calling me.',
        ],
      },
      {
        heading: 'What you get at the end',
        paragraphs: [
          'A working API in your own repository, with authentication, tenant isolation, background workers, automated tests and a documented deployment. You get the migrations, the runbook and the architecture notes, not just the code. If you want me to stay on for the next phase, each phase gets its own fixed price. If you would rather hand it to your own team, the handover is written for that.',
        ],
      },
    ],
    stack: [
      'Node.js',
      'TypeScript',
      'Java',
      'Spring Boot',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'RabbitMQ',
      'Elasticsearch',
      'OAuth2 / OIDC',
      'Docker',
      'Nginx',
    ],
    outcomes: [
      {
        metric: '3 failure-isolated async pipelines',
        detail:
          'Knowledge extraction, AI generation and platform dispatch run as independent RabbitMQ pipelines, so a failure in one is contained and each scales on its own.',
        projectId: 'social-saas',
        anchor: 'Kaizex multi-tenant SaaS backend case study',
      },
      {
        metric: '-50% employee provisioning time',
        detail:
          'A multi-tenant OIDC authorisation server with tenant isolation at the data and routing layer, and an admin dashboard that replaced manual account setup.',
        projectId: 'sso-platform',
        anchor: 'multi-tenant SSO platform case study',
      },
      {
        metric: 'Inbound webhooks acknowledged immediately',
        detail:
          'Provider webhooks are acked and handed to a dedicated queue, so automation execution never depends on a third party’s delivery timeout.',
        projectId: 'social-saas',
        anchor: 'queue-decoupled webhook pipeline in Kaizex',
      },
    ],
    faqs: [
      {
        q: 'How long does a SaaS MVP backend take?',
        a: 'Typically about three weeks for a fixed scope that covers the API, authentication, tests and deployment. Larger scope is split into phases, each with its own fixed price, so you never sign up for an open-ended retainer.',
      },
      {
        q: 'Which stack do you use?',
        a: 'Node.js with TypeScript, or Java with Spring Boot, depending on your team and your hiring plans. I will tell you which one I would pick and why on the first call. Databases are PostgreSQL or MySQL, with Redis and RabbitMQ where the workload needs them.',
      },
      {
        q: 'Do I own the code?',
        a: 'Yes. Everything is built in your repository from the first commit, and code ownership is written into the agreement before work starts.',
      },
      {
        q: 'Can you build a multi-tenant product?',
        a: 'Yes, and I prefer to decide the tenancy model in the first week. Row-level scoping by organisation is enough for most products. Where a customer needs stronger isolation, the model can move to separate schemas without rewriting the application.',
      },
      {
        q: 'Can you work alongside our existing developers?',
        a: 'Yes. I work in your repository, follow your review process and leave documentation your team can use. Many projects are a short, focused build that an in-house team then takes over.',
      },
    ],
    related: ['node-typescript-api-development', 'microservices-migration', 'api-performance-optimization'],
  },
  {
    slug: 'node-typescript-api-development',
    title: 'Node.js & TypeScript API Development | Kulshresth Jangid',
    description:
      'Freelance Node.js and TypeScript API development: typed REST APIs, webhook handling, auth and tests, delivered to your repo by one senior engineer.',
    h1: 'Node.js and TypeScript API development',
    eyebrow: 'Service / Node.js and TypeScript APIs',
    navLabel: 'Node.js & TypeScript APIs',
    intro:
      'Most Node.js APIs are easy to start and hard to keep reliable. I build typed, tested Node.js and TypeScript APIs that handle the awkward parts properly: authentication, third-party webhooks, retries, validation and observability. The work is fixed scope, lands in your repository and comes with documentation your team can use.',
    serviceType: 'Node.js and TypeScript API Development',
    lastmod: '2026-11-21',
    datePublished: '2026-11-21',
    sections: [
      {
        heading: 'Where Node.js APIs usually go wrong',
        paragraphs: [
          'The framework is rarely the problem. The trouble starts at the edges. Request bodies are trusted without validation, so a malformed payload becomes a 500 deep inside a handler. Webhook endpoints verify nothing, or verify signatures with a plain string comparison that leaks timing information. Errors are swallowed in promise chains, so failures vanish instead of surfacing. And the type system stops at the HTTP boundary, so TypeScript gives a false sense of safety.',
          'Integrations make this worse. Stripe, Meta and WhatsApp each have their own verification handshake, retry behaviour and idea of how fast you must respond. An API that handles one of them well and the others badly is common.',
        ],
      },
      {
        heading: 'How I build Node.js APIs',
        paragraphs: [
          'I treat the HTTP boundary as the place types are enforced, not assumed. Inputs are validated against explicit schemas, outputs are typed, and errors are handled in one place so every failure produces a consistent response and a log line with a correlation ID. Authentication uses JWTs or an OIDC provider depending on your setup, with permissions checked per route.',
          'For integrations I verify vendor signatures with a timing-safe comparison, answer the vendor quickly and move real work to a queue or background worker. My webhook relay project does exactly this: Stripe payloads are checked against the stripe-signature header, Meta and WhatsApp challenge-response is handled on the GET endpoint before any POST is accepted, and every payload is stored with headers, body, forwarding status and latency.',
          'Delivery matters as much as code. You get automated tests, a Dockerfile, CI, environment configuration and a written handover. If your team prefers Java, the same principles apply on Spring Boot, and I will say so honestly if that is the better fit.',
        ],
      },
      {
        heading: 'What a typical engagement covers',
        paragraphs: [
          'A new service built from scratch, an API layer in front of an existing system, a webhook and integration gateway, or a rewrite of a fragile Express app into a typed, tested codebase. Scope and price are fixed before work starts, and the output is code you own.',
        ],
      },
    ],
    stack: [
      'Node.js',
      'TypeScript',
      'Express',
      'REST',
      'GraphQL',
      'JWT',
      'MongoDB',
      'PostgreSQL',
      'Redis',
      'React',
      'Docker',
      'Nginx',
    ],
    outcomes: [
      {
        metric: '2x faster integration testing',
        detail:
          'A webhook relay that stores every Stripe, Meta and WhatsApp payload and replays it with one call, replacing the manual re-trigger cycle.',
        projectId: 'webhook-proxy',
        anchor: 'secure webhook proxy and relay gateway case study',
      },
      {
        metric: 'Zero local network exposure',
        detail:
          'Developers receive live vendor events without opening a tunnel into their own machines, with HMAC signature validation handled at the relay.',
        projectId: 'webhook-proxy',
        anchor: 'Node.js webhook relay with HMAC verification',
      },
      {
        metric: 'API p99 latency -35%',
        detail:
          'Query patterns, caching and call ordering were reworked on a high-traffic marketplace API, which also lifted conversion at the affected flow.',
        projectId: 'api-performance',
        anchor: 'API performance overhaul case study',
      },
    ],
    faqs: [
      {
        q: 'Do you use Express, Fastify or NestJS?',
        a: 'I pick based on your team. Express is the safe default and what my webhook relay uses. Fastify or NestJS make sense when you want stronger structure or schema-driven validation out of the box. The architecture matters more than the framework.',
      },
      {
        q: 'Can you take over an existing Node.js codebase?',
        a: 'Yes. I usually start with a short review of the current code, tests and deployment, then agree a scoped plan: fix the riskiest parts first, add tests around them and refactor from there.',
      },
      {
        q: 'How do you handle third-party webhooks?',
        a: 'Verify the signature with a timing-safe comparison, acknowledge quickly, store the raw payload, and process asynchronously. Storing the raw event also lets you replay it when something goes wrong, which saves hours of debugging.',
      },
      {
        q: 'Will the API be typed end to end?',
        a: 'Inside the service, yes. At the HTTP boundary I validate input against explicit schemas so the types reflect what the code actually receives, rather than what you hope it receives.',
      },
      {
        q: 'What do I get at the end?',
        a: 'The API in your repository, automated tests, a Dockerfile and CI configuration, environment documentation and a short handover note covering architecture and operations.',
      },
    ],
    related: ['saas-backend-development', 'api-performance-optimization', 'microservices-migration'],
  },
  {
    slug: 'microservices-migration',
    title: 'Monolith to Microservices Migration | Kulshresth Jangid',
    description:
      'Freelance monolith to microservices migration using event storming and the strangler fig pattern, with Kafka, sagas and observability built in.',
    h1: 'Monolith to microservices migration, without the big-bang rewrite',
    eyebrow: 'Service / Microservices migration',
    navLabel: 'Microservices migration',
    intro:
      'A monolith becomes a risk when any release can affect unrelated features and one failure can cascade everywhere. I plan and lead phased migrations to microservices that keep the monolith running until each piece has been proven in production. No big-bang rewrite, no six-month freeze on features.',
    serviceType: 'Microservices Migration',
    lastmod: '2026-11-21',
    datePublished: '2026-11-21',
    sections: [
      {
        heading: 'When a monolith is worth splitting',
        paragraphs: [
          'Splitting a monolith is not a goal on its own. It is worth doing when deployment coupling slows teams down, when one bad query or one failing module degrades the whole platform, or when parts of the system need to scale independently. If none of those hurt, a well-structured monolith is usually the better choice, and I will tell you that before taking the work.',
          'When they do hurt, the usual mistake is to start extracting services before agreeing where the boundaries are. The result is a distributed monolith: all the operational cost of microservices with none of the independence.',
        ],
      },
      {
        heading: 'The approach: boundaries first, then strangle',
        paragraphs: [
          'I start with event storming to map the domain and agree the bounded contexts before touching code. On the Rampwin migration that produced six bounded contexts, and no code changed until the boundaries and service contracts were agreed.',
          'Extraction uses the strangler fig pattern. New service traffic is routed through feature flags at the Nginx layer while the monolith stays live and functional, and a piece is only retired once its consumers have been verified as migrated. Services communicate through a Kafka event bus, so they stay decoupled and events can be replayed. Cross-service transactions such as checkout become distributed sagas with explicit compensating actions, instead of pretending the old ACID guarantees still apply.',
          'Each service owns its data. Per-service MongoDB collections with no shared schema mean ownership is enforced at the persistence layer and not just the API. Observability is built in parallel, not afterwards: structured logs, distributed tracing through Jaeger and Prometheus metrics ship in the service template, and an Istio mesh provides mTLS and controlled traffic shaping during cutover.',
        ],
      },
      {
        heading: 'Guardrails that keep the migration safe',
        paragraphs: [
          'Contract tests with Pact run in CI so breaking API changes are caught before staging. Independent deployment pipelines let teams release without coordination. Canary releases with automatic rollback limit the damage of a bad deploy. The migration is delivered in phases, each with a defined outcome, so you can stop or change direction at any point without being left with half a system.',
        ],
      },
    ],
    stack: [
      'Java',
      'Spring Boot',
      'Kafka',
      'MongoDB',
      'Docker',
      'Kubernetes',
      'Istio',
      'Nginx',
      'Pact',
      'Jaeger',
      'Prometheus',
    ],
    outcomes: [
      {
        metric: 'MTTR -28%',
        detail:
          'Failures in one bounded context are structurally contained and can no longer cascade across domains.',
        projectId: 'microservices-migration',
        anchor: 'monolith to microservices migration case study',
      },
      {
        metric: '6 bounded contexts agreed before any code changed',
        detail:
          'Event storming produced the domain boundaries, treated as first-class design artifacts rather than an afterthought.',
        projectId: 'microservices-migration',
        anchor: 'event storming and strangler fig migration at Rampwin',
      },
      {
        metric: 'Deployment failure rate -30%',
        detail:
          'Canary gates driven by Prometheus signals, automatic rollback in under 60 seconds and contract tests across 5 active service pairs.',
        projectId: 'cicd-automation',
        anchor: 'CI/CD automation and canary deployment case study',
      },
    ],
    faqs: [
      {
        q: 'Do we need microservices at all?',
        a: 'Not always. If deploys are fast, teams are not blocking each other and nothing needs to scale independently, a modular monolith is simpler and cheaper to run. I will give you a straight recommendation after reviewing your system, even when that means not splitting it.',
      },
      {
        q: 'How long does a migration take?',
        a: 'It depends on the size of the system, but it is always phased. A first phase that extracts one well-understood bounded context usually takes a few weeks and proves the pattern. Further phases are scoped and priced separately.',
      },
      {
        q: 'Will the monolith keep running during the migration?',
        a: 'Yes. That is the point of the strangler fig pattern. Traffic is shifted gradually behind feature flags, and the monolith is only retired for a given capability after its consumers are verified as migrated.',
      },
      {
        q: 'How do you handle transactions across services?',
        a: 'With sagas and compensating actions, designed per workflow. Checkout and order lifecycle are typical examples. Idempotent retries and explicit failure states replace the single database transaction the monolith relied on.',
      },
      {
        q: 'What about observability?',
        a: 'It is built alongside the first extracted service, not added later. Structured logs, distributed traces and per-service metrics are part of the service template, so each new service is observable from its first deploy.',
      },
    ],
    related: ['saas-backend-development', 'api-performance-optimization', 'node-typescript-api-development'],
  },
  {
    slug: 'api-performance-optimization',
    title: 'API Performance Optimization Services | Kulshresth Jangid',
    description:
      'Freelance API performance optimization: find slow queries, N+1 patterns and cache misses, and cut p99 latency with measurable before and after numbers.',
    h1: 'API performance optimization with measurable results',
    eyebrow: 'Service / API performance',
    navLabel: 'API performance optimization',
    intro:
      'Slow APIs cost you conversions, support tickets and sleep. I diagnose where the time actually goes, fix the biggest causes first and report results as before and after numbers you can check. The work starts with measurement, because guessing at performance problems is how teams end up optimising the wrong thing.',
    serviceType: 'API Performance Optimization',
    lastmod: '2026-11-21',
    datePublished: '2026-11-21',
    sections: [
      {
        heading: 'Why APIs get slow',
        paragraphs: [
          'In my experience, a slow API usually has a handful of boring causes rather than one clever one. ORM-generated N+1 queries multiply database round trips on the critical path. Hot queries run without a covering index and fall back to scans under load. Cache TTLs are set so short, or invalidated so loosely, that the cache rarely helps. And downstream calls that could happen after the response are made synchronously before it.',
          'These problems hide until traffic grows, and then every one of them shows up at once as a p99 latency number that keeps climbing.',
        ],
      },
      {
        heading: 'The approach: measure, fix, verify',
        paragraphs: [
          'I do a full diagnostic before changing any code. That means profiling query execution plans, mapping every N+1 pattern, auditing cache behaviour and identifying calls that do not belong on the critical path. Then I fix in order of impact. On a high-traffic marketplace API that meant replacing ORM-generated queries with explicit batch fetches, which cut database round trips on the critical path by 6x, adding composite covering indexes driven by EXPLAIN analysis of the ten hottest query patterns, and moving downstream enrichment to async chains that run after the core response returns.',
          'Caching gets a proper redesign instead of a larger TTL: domain-aligned expiry, tag-based invalidation on writes, and probabilistic early expiration so a burst of traffic cannot stampede the database when a hot key expires.',
          'Then I make the improvement stick. Prometheus latency histograms at p50, p95 and p99 per endpoint become deployment-gate signals in CI, so a regression is caught before production rather than reported by a customer.',
        ],
      },
      {
        heading: 'What you receive',
        paragraphs: [
          'A written audit that ranks the causes by impact, the fixes themselves delivered as reviewable pull requests, and a before and after report with the same measurements taken both times. If you only want the audit and prefer your own team to implement it, that works too.',
        ],
      },
    ],
    stack: [
      'Java',
      'Spring Boot',
      'Node.js',
      'MySQL',
      'PostgreSQL',
      'Redis',
      'Elasticsearch',
      'Prometheus',
      'Grafana',
    ],
    outcomes: [
      {
        metric: 'p99 DB latency 820ms to 490ms (-40%)',
        detail:
          'Explicit batch-fetch queries and composite covering indexes on the hot query patterns.',
        projectId: 'api-performance',
        anchor: 'API performance overhaul case study',
      },
      {
        metric: 'API p99 1050ms to 680ms (-35%), conversion +12%',
        detail:
          'Async enrichment moved downstream calls off the critical path, and the faster checkout and listing flow converted better.',
        projectId: 'api-performance',
        anchor: 'how API latency was cut by 35% at CarDekho',
      },
      {
        metric: 'Redis cache hit rate 54% to 87%',
        detail:
          'A redesign of TTLs and invalidation replaced fine-grained expiry that was undermining the cache.',
        projectId: 'api-performance',
        anchor: 'Redis cache redesign in the API performance case study',
      },
      {
        metric: 'Zero latency SLO regressions across two quarters',
        detail:
          'Latency histograms became CI gates, and SLO-based alerting kept the gains visible. See the observability work behind it.',
        projectId: 'slo-observability',
        anchor: 'SLO-based observability platform case study',
      },
    ],
    faqs: [
      {
        q: 'How do you find the cause of slow endpoints?',
        a: 'By measuring. I profile query plans, trace the critical path of the slowest endpoints and compare cache hit rates before touching anything. The first deliverable is a ranked list of causes with evidence, not a list of opinions.',
      },
      {
        q: 'What results can I expect?',
        a: 'It depends on your system, so I do not promise a number up front. On one marketplace API the work cut p99 database latency by 40%, API latency by 35% and lifted conversion by 12%. You will get the same before and after measurements for your own system.',
      },
      {
        q: 'Can you do just an audit?',
        a: 'Yes. A fixed-price audit gives you a ranked, evidence-backed list of fixes that your own team can implement. I can also implement the top items if you want.',
      },
      {
        q: 'Which databases and stacks do you work with?',
        a: 'MySQL and PostgreSQL most often, with Redis for caching and Elasticsearch for search. The application side is Java with Spring Boot or Node.js with TypeScript.',
      },
      {
        q: 'How do you stop regressions?',
        a: 'Latency histograms per endpoint go into your CI as deployment gates, and SLO-based alerts tell you when an endpoint drifts. The goal is that performance stays fixed after I leave.',
      },
    ],
    related: ['node-typescript-api-development', 'saas-backend-development', 'microservices-migration'],
  },
]

export function getService(slug: string): ServicePageData | undefined {
  return services.find((s) => s.slug === slug)
}

/** Which service pages a case study should link to, with descriptive anchors. */
export const projectServiceLinks: Record<string, { slug: string; anchor: string }[]> = {
  'social-saas': [{ slug: 'saas-backend-development', anchor: 'SaaS backend development services' }],
  'sso-platform': [{ slug: 'saas-backend-development', anchor: 'multi-tenant SaaS backend development' }],
  'microservices-migration': [{ slug: 'microservices-migration', anchor: 'monolith to microservices migration service' }],
  'cicd-automation': [{ slug: 'microservices-migration', anchor: 'microservices migration with canary deployments' }],
  'api-performance': [{ slug: 'api-performance-optimization', anchor: 'API performance optimization service' }],
  'slo-observability': [{ slug: 'api-performance-optimization', anchor: 'API performance optimization with SLO alerting' }],
  'webhook-proxy': [{ slug: 'node-typescript-api-development', anchor: 'Node.js and TypeScript API development service' }],
}
