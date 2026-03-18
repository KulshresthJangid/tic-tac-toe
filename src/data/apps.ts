import type { AppService } from '../types'

export const appServices: AppService[] = [
  {
    id: 'social-saas',
    name: 'Social SaaS',
    description:
      'Content automation platform. Knowledge-driven generation, multi-platform publishing, team workflows, and engagement analytics.',
    route: '/saas',
    status: 'ONLINE',
    version: '2.1.0',
    tags: ['Kafka', 'Spring Boot', 'Multi-platform'],
  },
  {
    id: 'content-api',
    name: 'Content API',
    description:
      'Core REST API powering the SaaS platform. Pipeline orchestration, platform OAuth integrations, and publish lifecycle management.',
    route: '/api/v2',
    status: 'ONLINE',
    version: '2.1.0',
    tags: ['Spring Boot', 'JWT', 'REST'],
  },
  {
    id: 'scheduler',
    name: 'Scheduler Engine',
    description:
      'Distributed task scheduling. Time-wheel algorithm over Redis sorted sets. Validated at 1M+ concurrent tasks per instance with at-least-once delivery.',
    route: '/scheduler',
    status: 'ONLINE',
    version: '1.4.0',
    tags: ['Redis', 'Kafka', 'High-throughput'],
  },
  {
    id: 'analytics',
    name: 'Analytics Service',
    description:
      'Per-platform engagement tracking, content strategy attribution, and publishing performance dashboards.',
    route: '/analytics',
    status: 'ONLINE',
    version: '1.2.0',
    tags: ['PostgreSQL', 'Kafka', 'Materialized Views'],
  },
  {
    id: 'observability',
    name: 'Observability',
    description:
      'SLO dashboards, error budget tracking, burn-rate alerting, and structured log aggregation. Prometheus + Grafana + ELK.',
    route: '/monitor',
    status: 'ONLINE',
    version: '1.1.0',
    tags: ['Prometheus', 'Grafana', 'ELK'],
  },
  {
    id: 'auth',
    name: 'Auth Service',
    description:
      'JWT authentication, team RBAC enforcement, OAuth2 social login connectors (LinkedIn, Twitter), and immutable audit log.',
    route: '/auth',
    status: 'ONLINE',
    version: '1.3.0',
    tags: ['Spring Security', 'JWT', 'OAuth2'],
  },
]
