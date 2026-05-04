import type { AppService } from '../types'

export const appServices: AppService[] = [
  {
    id: 'entry-point',
    name: 'tic-tac-toe',
    description:
      'Reverse proxy entry point (:443). Routes /lumen to echo-post frontend, /api/v1/ to smart-server backend. All production traffic passes through this layer.',
    route: '/',
    status: 'ONLINE',
    version: '1.0.0',
    tags: ['Nginx', 'Entry Point', 'Reverse Proxy'],
  },
  {
    id: 'echo-post',
    name: 'EchoPost (Lumen)',
    description:
      'Next.js frontend for the Lumen Marketing OS, served at /lumen. Onboarding, Bucket management, Source ingestion, Insights browser, Post editor, Scheduling calendar, Analytics, and AI provider config.',
    route: '/lumen',
    externalUrl: '/lumen',
    status: 'ONLINE',
    version: '2.2.0',
    tags: ['Next.js', 'TypeScript', 'Multi-tenant'],
  },
  {
    id: 'smart-server',
    name: 'smart-server',
    description:
      'Core Spring Boot backend (:8080). Auth + Org + RBAC, content ingestion pipeline, AI processing layer, post generation engine, scheduling system, RabbitMQ execution workers, and platform integrations.',
    route: '/api/v1',
    status: 'ONLINE',
    version: '2.2.0',
    tags: ['Spring Boot', 'JWT', 'RabbitMQ'],
  },
  {
    id: 'scheduler',
    name: 'Scheduler Engine',
    description:
      'Distributed task scheduling using a time-wheel algorithm over Redis sorted sets. Validated at 1M+ concurrent tasks/instance — at-least-once delivery with idempotent publish consumers.',
    route: '/scheduler',
    status: 'ONLINE',
    version: '1.4.0',
    tags: ['Redis', 'RabbitMQ', 'High-throughput'],
  },
  {
    id: 'ai-config',
    name: 'AI Config Service',
    description:
      'BYO-AI provider management. Org-level LLM provider config (OpenAI, Anthropic, self-hosted). Dynamic persona templates and strategy-driven prompt configuration per org and per channel.',
    route: '/ai',
    status: 'ONLINE',
    version: '1.0.0',
    tags: ['LLM', 'BYO-AI', 'Spring Boot'],
  },
  {
    id: 'analytics',
    name: 'Analytics Service',
    description:
      'Per-platform engagement tracking, strategy-pillar attribution, and publishing performance dashboards over rolling time windows.',
    route: '/analytics',
    status: 'ONLINE',
    version: '1.2.0',
    tags: ['PostgreSQL', 'Elasticsearch', 'Materialized Views'],
  },
  {
    id: 'observability',
    name: 'Observability',
    description:
      'SLO dashboards, error budget tracking, multi-window burn-rate alerting, and structured log aggregation. Prometheus + Grafana + ELK. Per-pipeline-stage instrumentation.',
    route: '/monitor',
    status: 'ONLINE',
    version: '1.1.0',
    tags: ['Prometheus', 'Grafana', 'ELK'],
  },
  {
    id: 'session-logger',
    name: 'Session Logger',
    description:
      'Freelance session tracker: one-click time tracking, billing snapshots, monthly reports with CSV export. React + Express + Prisma + PostgreSQL.',
    route: '/session-logger',
    externalUrl: 'https://buildwithkulshresth.com/session-logger',
    status: 'ONLINE',
    version: '1.0.0',
    tags: ['React', 'Express', 'Prisma', 'PostgreSQL'],
  },
  {
    id: 'session-logger-api',
    name: 'Session Logger API',
    description:
      'Express + TypeScript backend for Session Logger. JWT auth, Zod validation, billing snapshot on session start, concurrent session guard (409), server-side duration/cost computation.',
    route: '/session-logger/api',
    status: 'ONLINE',
    version: '1.0.0',
    tags: ['Express', 'TypeScript', 'JWT', 'Zod'],
  },
  {
    id: 'session-logger-db',
    name: 'Session Logger DB',
    description:
      'PostgreSQL 16 instance in Docker Compose. Prisma v5 ORM with billing snapshot schema — client rate frozen into each session row at start time.',
    route: '/session-logger/db',
    status: 'ONLINE',
    version: '16.0',
    tags: ['PostgreSQL', 'Prisma', 'Docker Compose'],
  },
  {
    id: 'leadgen-pro',
    name: 'LeadGen Pro',
    description:
      'AI-powered B2B lead generation dashboard: real-time WebSocket updates, lead filtering, manual category override, per-lead notes, CSV export. React + Vite + TailwindCSS + TanStack Query.',
    route: '/drip',
    externalUrl: 'https://buildwithkulshresth.com/drip',
    status: 'ONLINE',
    version: '1.0.0',
    tags: ['React', 'Vite', 'TailwindCSS', 'Socket.io'],
  },
  {
    id: 'leadgen-pro-api',
    name: 'LeadGen Pro API',
    description:
      'Node.js 20 (ESM) + Express.js backend. JWT HS256 auth, rate-limited endpoints, scraping orchestration, AI enrichment triggers, daily target mode, and CSV export.',
    route: '/drip-api',
    status: 'ONLINE',
    version: '1.0.0',
    tags: ['Express.js', 'Node.js', 'JWT', 'Socket.io'],
  },
  {
    id: 'leadgen-pro-ai',
    name: 'LeadGen Pro AI (Ollama)',
    description:
      'Mistral 7B via Ollama running on GTX 1050 GPU (CUDA). Two-pass enrichment: lead qualification + scoring, then hyper-personalised outreach copy. Zero API cost.',
    route: '/drip/ai',
    status: 'ONLINE',
    version: '7B',
    tags: ['Mistral 7B', 'Ollama', 'CUDA', 'GPU Inference'],
  },
  {
    id: 'leadgen-pro-db',
    name: 'LeadGen Pro DB',
    description:
      'SQLite (default) or PostgreSQL — swappable via env var. SHA-256 email fingerprinting and Levenshtein fuzzy deduplication at the persistence layer.',
    route: '/drip/db',
    status: 'ONLINE',
    version: '1.0.0',
    tags: ['SQLite', 'PostgreSQL', 'Deduplication'],
  },
  {
    id: 'sso-identity-provider',
    name: 'SSO Identity Provider',
    description:
      'Centralised authentication and identity management service. Multi-tenant Spring Authorization Server with a React UI. Provides OIDC-compliant JWTs for all internal applications.',
    route: '/sso',
    status: 'ONLINE',
    version: '1.0.0',
    tags: ['Spring Boot', 'React', 'OIDC', 'OAuth2', 'PostgreSQL'],
  },
]
