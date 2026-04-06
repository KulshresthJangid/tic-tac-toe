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
]
