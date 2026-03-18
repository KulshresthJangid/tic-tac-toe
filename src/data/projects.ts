import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'social-saas',
    title: 'Social Media Automation SaaS',
    shortDescription:
      'Built solo end-to-end: a strategy-driven content automation platform. Multi-platform publishing, knowledge-driven generation, distributed scheduling tested at 1M+ tasks/instance.',
    description:
      'Designed and shipped solo from the ground up. The core problem: content teams are operationally bottlenecked — posting manually, context-switching across platforms, and generating generic AI content with no strategic grounding. Existing tools like Buffer and Hootsuite are schedulers. They have no intelligence layer. This platform is different: a knowledge engine transforms structured brand context (audience, voice, strategy pillars) into platform-native content — not one-shot prompts. An async Kafka-backed pipeline handles draft → review → approval → publish with full audit trails. The scheduling system is validated at 1M+ concurrent tasks per instance. Team workflows, role-based access, and per-platform analytics are all first-class features.',
    techStack: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Redis', 'React', 'Kubernetes', 'Docker'],
    status: 'LIVE',
    liveUrl: '/saas',
    architecture: [
      'Kafka-backed async pipeline decoupling content generation, review, and publishing stages — each stage independently scalable and failure-isolated',
      'Knowledge engine: brand voice, strategy pillars, and audience data compiled into a structured context object; content generated from that context, not from ad-hoc prompts — consistency by design',
      'Scheduling system using time-wheel algorithm over Redis sorted sets — validated at 1M+ concurrent tasks per instance with sub-second scheduling accuracy and at-least-once delivery guarantee',
      'Multi-tenant PostgreSQL schema with row-level security; team roles (owner, editor, reviewer, viewer) enforced at the API layer via Spring Security and JWT claim inspection',
      'Kubernetes deployment with per-service HPA scaling targets driven by Kafka consumer lag metrics — not CPU — for load-reactive scaling that matches actual queue pressure',
      'Prometheus instrumentation per pipeline stage (ingest lag, draft latency, publish success/failure rate) feeding error budget dashboards',
    ],
    features: [
      'Multi-platform publishing: LinkedIn, Twitter, Instagram — extensible connector architecture for new platforms without core changes',
      'Knowledge-driven content engine — output is strategy-aligned, not randomly generated; brand voice and positioning preserved across all content',
      'Full pipeline with audit trail: draft → review → approval → scheduled publish; every state transition logged with actor and timestamp',
      'Scheduling at 1M+ tasks/instance — at-least-once delivery, idempotent publish consumers, dead-letter queue with configurable retry backoff',
      'Team workflows with RBAC — owner, editor, reviewer, viewer — enforced at both API and UI layers',
      'Per-platform analytics: reach, engagement rate, publish success rate, and strategy performance attribution over time',
    ],
    year: 2025,
  },
  {
    id: 'microservices-migration',
    title: 'Monolith to Microservices Migration',
    shortDescription:
      'Led domain decomposition and phased service extraction at Rampwin. Reduced MTTR by 28%, eliminated cross-domain cascading failures, and enabled independent team deployments.',
    description:
      'At Rampwin, the monolith had become the org-level risk: deployment coupling meant any release could affect unrelated domains, a single bad query could degrade the entire platform, and a service failure could cascade everywhere. I led the migration. Started with event storming to map domain boundaries — no code changes until the boundaries were agreed and service contracts were defined. Used strangler fig for incremental extraction with feature-flag traffic routing. Built the observability layer in parallel so failure modes were tracked from day one, not discovered reactively. Result: MTTR dropped 28%, deployment frequency increased across teams, and cross-domain incidents became structurally impossible.',
    techStack: ['Java', 'Spring Boot', 'MongoDB', 'Kafka', 'Docker', 'Kubernetes', 'Istio'],
    status: 'INTERNAL',
    architecture: [
      'Event storming workshop output: 6 bounded contexts identified and agreed before any code was touched — domain boundaries as first-class design artifacts',
      'Strangler fig extraction: new service traffic routed via feature flags at the Nginx layer; monolith kept live and functional until consumer migration was verified complete',
      'Kafka event bus as the inter-service communication fabric — async, decoupled, replay-capable; services produce and consume domain events without direct coupling',
      'Distributed sagas for cross-service transactions (checkout, order lifecycle) — replacing monolith ACID guarantees with explicit eventual consistency and compensating actions',
      'Per-service MongoDB collections with no shared schema — data ownership enforced at the persistence layer, not just the API layer',
      'Istio service mesh for mTLS between services, distributed tracing via Jaeger, and controlled traffic shaping during phased cutover',
    ],
    features: [
      'MTTR reduced 28% — failures in one bounded context are now structurally contained and cannot cascade',
      'Independent deployment pipelines per service: teams release without coordination overhead or shared deployment windows',
      'API contract testing (Pact) enforced in CI — breaking changes caught before staging, on every commit',
      'Distributed saga orchestration for checkout and order workflows with full compensating transaction support and idempotent retry',
      'Per-service observability from day one: structured logs, distributed traces, and Prometheus metrics built into the service template',
      'MongoDB performance optimization under high-write load: compound index design, write concern tuning, and read replica routing',
    ],
    year: 2025,
  },
  {
    id: 'api-performance',
    title: 'API Performance Overhaul',
    shortDescription:
      'Systematic data-access and caching redesign at CarDekho: p99 DB latency -40%, API latency -35%, user conversion +12%.',
    description:
      'High-traffic API endpoints were degrading under load — p99 DB latency above 820ms, visible user drop-off at key conversion flows. I did a full diagnostic before touching any code: profiled query execution plans, mapped all N+1 patterns, audited cache TTL strategy, and identified three synchronous downstream calls that belonged off the critical path. The fix was systematic: rewrote the data-access layer with explicit batch-fetch queries, added composite covering indexes on the hot query patterns, replaced the self-defeating fine-grained cache TTLs with domain-aligned invalidation, and moved downstream enrichment to async CompletableFuture chains returning after the core response. Outcome: p99 DB latency dropped 40%, API latency dropped 35%, user conversion at the affected flow improved 12%.',
    techStack: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Prometheus', 'Grafana'],
    status: 'INTERNAL',
    architecture: [
      'JPA query audit: replaced ORM-generated N+1 patterns with explicit JPQL batch-fetch queries — DB round trips on the critical path reduced 6x',
      'Composite index design on MySQL: EXPLAIN-driven analysis of the top-10 hot query patterns; covering indexes added to eliminate full-table scans at load',
      'Redis caching redesign: domain-aligned TTLs, tag-based invalidation on write mutations, probabilistic early expiration to prevent cache stampede under burst traffic',
      'Async enrichment: downstream service calls moved off the critical path using CompletableFuture; core response returned immediately, enrichments applied without blocking the caller',
      'Prometheus latency histograms (p50/p95/p99) per endpoint added as deployment-gate signals in CI — regressions caught before production',
    ],
    features: [
      'p99 DB latency: 820ms to 490ms (-40%)',
      'API p99 latency: 1050ms to 680ms (-35%)',
      'User conversion +12% at the checkout and listing flow directly attributable to latency improvement',
      'Redis cache hit rate improved from 54% to 87% via TTL and invalidation strategy redesign',
      'Zero latency SLO regressions across two quarters post-deployment',
    ],
    year: 2023,
  },
  {
    id: 'cicd-automation',
    title: 'CI/CD Automation and Deployment Reliability',
    shortDescription:
      'Designed canary pipelines, automated rollback on Prometheus burn-rate triggers, and contract testing gates at Equinix. Deployment failure rate -30%.',
    description:
      'Deployment failures compound their damage: they pull engineers off feature work, erode team confidence in the release process, and inflate incident MTTR. At Equinix, I redesigned the deployment pipeline end-to-end: canary releases with traffic ramp gates based on live Prometheus error rate and p99 latency signals, automated rollback via Kubernetes rollout undo on burn-rate threshold breach, Pact contract testing in CI catching API breaking changes before staging, and Helm chart standardisation reducing pipeline onboarding to under 30 minutes per new service. Deployment failure rate dropped 30%, mean rollback time dropped from 12 minutes manual to under 60 seconds automated.',
    techStack: ['Jenkins', 'Kubernetes', 'Helm', 'Prometheus', 'Java', 'Spring Boot', 'Docker'],
    status: 'LIVE',
    architecture: [
      'Canary deployment strategy: 5% to 25% to 100% traffic ramp with automated hold gates based on HTTP error rate and p99 latency thresholds at each stage',
      'Automated rollback: Prometheus alerting rule firing on canary error budget burn triggers Kubernetes rollout undo via webhook — rollback completes in under 60 seconds without human intervention',
      'Contract testing (Pact) in CI pipeline — provider and consumer sides tested on every commit; breaking changes block merge before staging is ever touched',
      'Helm chart templating with per-environment value overlays and sealed secret management — configuration parity between staging and production enforced at the template layer',
      'Jenkins shared library encapsulating the full build-test-scan-deploy sequence — service onboarding requires only a Jenkinsfile referencing the shared library',
    ],
    features: [
      'Deployment failure rate -30% via canary gates and automated rollback',
      'Mean rollback time: 12 minutes manually to under 60 seconds automated via Prometheus-triggered Kubernetes webhook',
      'API breaking changes caught in CI before staging — 100% contract test gate coverage across 5 active service pairs',
      'Standardised deployment pipeline adopted across 5+ services; new service onboarding reduced to under 30 minutes',
      'Runbook library covering 12 failure modes — on-call MTTR improvement measurable within 2 sprint cycles',
    ],
    year: 2025,
  },
  {
    id: 'slo-observability',
    title: 'SLO-Based Observability Platform',
    shortDescription:
      'Shifted the team from reactive alerting to error budget engineering. SLOs defined per service, multi-window burn-rate alerting implemented, on-call noise reduced significantly.',
    description:
      'Most alerting systems page on symptoms — CPU spikes, memory pressure, error rate above threshold. The signal arrives too late and carries no context about actual service-level impact. I built an SLO-based observability layer: defined availability and latency SLOs per service, implemented multi-window burn-rate alerting (Google SRE Book Chapter 5 approach), and built Grafana dashboards showing error budget consumption in real time. The operational shift: on-call is paged only when burn rate indicates a genuine threat to SLO compliance within the measurement window — not on every transient spike. Alert noise dropped significantly, the team started treating error budgets as an engineering constraint rather than a vanity metric.',
    techStack: ['Prometheus', 'Grafana', 'ELK Stack', 'Java', 'Spring Boot', 'Kubernetes', 'PagerDuty'],
    status: 'INTERNAL',
    architecture: [
      'SLO definitions as code: availability (99.9% request success rate) and latency (p99 < 300ms) targets per service in version-controlled YAML, reviewed and signed off like any service contract',
      'Prometheus recording rules pre-computing burn rate over 1h, 6h, and 3d windows — fast-burn and slow-burn evaluation without query overhead at alert evaluation time',
      'Multi-window alerting: fast-burn (1h and 6h windows) triggers PagerDuty; slow-burn (3d) routes to Slack — alert noise reduced by removing single-spike false positives',
      'Grafana error budget dashboards: remaining budget percentage, projected exhaustion time, and per-endpoint SLO heatmap updated in real time',
      'ELK pipeline: Spring Boot JSON structured logs routed through Logstash to Elasticsearch; Kibana used for incident investigation with full correlation ID and trace ID join',
    ],
    features: [
      'SLO coverage across 8 production services with per-service error budget tracking and quarterly compliance reporting',
      'On-call alert noise reduced — multi-window burn rate eliminates single-spike false positives that previously triggered unnecessary pages',
      'Error budget as an engineering constraint: feature freeze and reliability work triggers defined by budget consumption, not subjective team decision',
      'Structured logging standard adopted org-wide: correlation IDs, trace IDs, and request context on every log line',
      'Automatic post-incident timeline generation from Kibana log queries and Jaeger trace spans — RCA time per incident reduced measurably',
    ],
    year: 2024,
  },
]
