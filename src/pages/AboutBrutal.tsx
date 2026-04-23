import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useGenZ } from '../context/GenZContext'
import GlassCard from '../components/GlassCard'

const experience = [
  {
    role: 'Senior Software Engineer',
    company: 'Equinix',
    period: 'Jun 2025 – Present',
    location: 'Remote, India',
    notes: [
      'Rewrote the Spring Boot data-access layer with targeted query optimization and composite indexing — MySQL p99 latency down 40%, API latency down 35%, user conversion up 12% at the affected flow',
      'Designed canary deployment pipeline with automated rollback on Prometheus error budget burn-rate triggers — deployment failure rate down 30%',
      'Integrated Pact contract testing into CI — API breaking changes caught at the PR level before staging is ever deployed',
      'Led incident response and postmortem process; authored runbooks covering 12 failure modes; on-call MTTR measurably reduced',
      'Built JWT-secured partner APIs with Spring Security, enforcing team RBAC at the claim level rather than in application logic',
    ],
  },
  {
    role: 'Senior Software Engineer',
    company: 'Rampwin',
    period: 'Dec 2024 – May 2025',
    location: 'Jaipur, India',
    notes: [
      'Led monolith-to-microservices migration: ran event storming to identify 6 bounded contexts, defined inter-service contracts before any code was extracted, used strangler fig with feature-flag traffic routing for zero-downtime cutover',
      'Reduced MTTR by 28% through domain isolation — failures in one bounded context are now structurally contained and cannot cascade across unrelated services',
      'Designed distributed saga orchestration for checkout and order workflows with full compensating transaction support and idempotent retry',
      'Enforced Pact contract testing across 4 service pairs; breaking changes blocked at CI before reaching staging',
      'Optimized MongoDB under high-write load: compound index design, write concern tuning, and read replica routing across all hot query paths',
    ],
  },
  {
    role: 'Backend Engineer',
    company: 'CarDekho',
    period: 'Jan 2022 – Nov 2024',
    location: 'Jaipur, India',
    notes: [
      'Built chatbot automation system using a branching decision engine — increased weekly user engagement by 20%',
      'Diagnosed and eliminated N+1 query patterns, redesigned composite indexes, rebuilt Redis caching strategy — p99 DB latency down 40%, API latency down 35%',
      'Led LMS migration to zero-downtime using dual-write and progressive cutover — no user-visible impact across the full migration window',
      'Moved downstream enrichment calls off the critical response path using CompletableFuture — eliminated synchronous blocking on three high-traffic endpoints',
      'Improved Redis cache hit rate from 54% to 87% by replacing per-row TTLs with domain-aligned invalidation and tag-based cache busting',
    ],
  },
]

const technicalDepth = [
  {
    title: 'Distributed Systems',
    desc: 'Kafka event-driven pipelines, saga orchestration, eventual consistency, partition tolerance tradeoffs, and failure mode analysis across service boundaries.',
  },
  {
    title: 'Reliability Engineering',
    desc: 'SLO/SLA definition, error budget tracking, multi-window burn-rate alerting, runbook authoring, on-call participation, and blameless postmortem facilitation.',
  },
  {
    title: 'Performance Engineering',
    desc: 'Query profiling and index design, cache strategy architecture, async critical path separation, and instrumentation-driven optimization via Prometheus histograms.',
  },
  {
    title: 'Platform and Deployment',
    desc: 'Kubernetes with HPA, Helm chart templating, canary deployment pipelines, automated rollback via webhook, and contract-testing CI gates.',
  },
  {
    title: 'Observability Stack',
    desc: 'Prometheus metrics and recording rules, Grafana dashboards, structured logging with ELK, distributed tracing with Jaeger, and per-service error budget dashboards.',
  },
  {
    title: 'Security Engineering',
    desc: 'JWT authentication with Spring Security, RBAC at the claim level, mTLS via Istio, sealed secrets lifecycle management, and immutable audit logging.',
  },
]

export default function About() {
  usePageMeta(
    'About Kulshresth Jangid — Senior Backend Engineer · Jaipur, India',
    'Senior backend engineer from Jaipur, India. I build scalable APIs, SaaS backends, and distributed systems. 4+ years at CarDekho, Rampwin, and Equinix. Open to remote roles globally.',
    {
      canonical: 'https://buildwithkulshresth.com/about',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        name: 'About Kulshresth Jangid',
        url: 'https://buildwithkulshresth.com/about',
        mainEntity: {
          '@type': 'Person',
          name: 'Kulshresth Jangid',
          jobTitle: 'Senior Backend Engineer',
          description: 'Senior backend engineer from Jaipur, India. I build scalable APIs, SaaS backends, and distributed systems. 4+ years at CarDekho, Rampwin, and Equinix.',
          worksFor: { '@type': 'Organization', name: 'Equinix' },
          knowsAbout: [
            'Node.js', 'TypeScript', 'Java', 'Spring Boot', 'Distributed Systems',
            'Microservices', 'Kafka', 'Redis', 'PostgreSQL', 'Kubernetes',
          ],
          sameAs: [
            'https://github.com/kulshresthjangid',
            'https://www.linkedin.com/in/kulshresth-jangid/',
            'https://x.com/nerdy_ge3k',
            'https://medium.com/@kulshresthjangid',
          ],
        },
      },
    },
  )
  const { genzMode } = useGenZ()
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-mono selection:bg-primary selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "linear" }}
        className="space-y-16"
      >
        {/* Positioning */}
        <div>
          <p className="text-sm font-bold text-primary mb-2 tracking-widest uppercase">
            {genzMode ? '// who is this guy' : '// about'}
          </p>
          <div className="flex items-start gap-5 mb-8 flex-wrap sm:flex-nowrap">
            <div className="w-16 h-16 flex-shrink-0 bg-black border-2 border-white flex items-center justify-center text-xl font-black text-white shadow-brutal transition-none">
              KJ
            </div>
            <div>
              <h1 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase border-b-4 border-secondary inline-block pb-1">
                {genzMode ? 'kul. just kul.' : 'Kulshresth Jangid'}
              </h1>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">
                {genzMode
                  ? 'makes servers work · ships things · jaipur, india'
                  : 'Senior Backend Engineer · Node.js, TypeScript, Java · Jaipur, India'}
              </p>
            </div>
          </div>

          <GlassCard className="space-y-6">
            <p className="text-white font-bold leading-relaxed text-base">
              {genzMode
                ? 'i write backend code and somehow systems do not fall over. four years. cartech, fintech, saas. real traffic, real incidents, real 2am pages. i own what i build end to end, which means i have to fix it when it breaks, which means i try very hard not to break it.'
                : 'I design distributed systems, ship production software, and operate what I build. Four years as an engineer across cartech, fintech, and SaaS — working on microservices architectures that handle real traffic, real failure modes, and real consequence when something breaks at 2am. My default orientation is ownership: I define the problem, choose the architecture, write the code, instrument it, and stay on-call for it.'}
            </p>
            <p className="text-white font-bold leading-relaxed text-base">
              {genzMode
                ? 'i think in systems before i think in features. what breaks first? where does data get lost? what happens at 100x load? boring obvious solutions that compose well beat clever abstractions that hide failure modes every single time.'
                : 'I think in systems before I think in features. Before writing code, I want to understand the consistency requirements, the failure boundary, the scaling inflection point, and the operational cost. I don\'t optimize for elegance — I optimize for correctness under load and debuggability under incident. Boring, obvious solutions that compose well are better than clever abstractions that hide failure modes.'}
            </p>
            <p className="text-white font-bold leading-relaxed text-base">
              {genzMode ? (
                <>
                  i founded <span className="text-primary uppercase">Lumen</span> (EchoPost). built a whole marketing OS from scratch. four stages, three automation modes, bring your own AI, 1M+ tasks per instance. named the entry point <span className="text-secondary uppercase">tic-tac-toe</span> because why not. frontend at <span className="text-secondary uppercase">/lumen</span>. backend is <span className="text-secondary uppercase">smart-server</span>. designed, deployed, operated, still running.
                </>
              ) : (
                <>
                  I founded <span className="text-primary uppercase">Lumen</span> (EchoPost) — a multi-tenant Marketing Operating System — as a product, not a side project. Four-stage pipeline: Source → Insight → Content → Distribution. Three automation modes. BYO-AI with no model lock-in. Scheduling engine validated at 1M+ tasks/instance. Entry point: <span className="text-secondary uppercase">tic-tac-toe</span>. Frontend at <span className="text-secondary uppercase">/lumen</span>. Backend: <span className="text-secondary uppercase">smart-server</span>. Designed, deployed, and operated end-to-end.
                </>
              )}
            </p>
          </GlassCard>
        </div>

        {/* Technical depth */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6 uppercase border-l-4 border-primary pl-4">
            Technical Depth
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {technicalDepth.map(({ title, desc }) => (
              <GlassCard key={title} padding="sm" hoverable className="space-y-2 group hover:bg-white hover:text-black transition-none">
                <div className="text-lg font-black text-primary group-hover:text-black uppercase">{title}</div>
                <div className="text-sm font-bold text-gray-300 group-hover:text-gray-800 leading-relaxed">{desc}</div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6 uppercase border-l-4 border-secondary pl-4">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map(({ role, company, period, location, notes }) => (
              <GlassCard key={`${role}-${company}`} className="group transition-none">
                <div className="flex items-start justify-between gap-4 mb-6 flex-wrap border-b-2 border-white pb-4 group-hover:border-primary">
                  <div>
                    <div className="text-2xl font-black text-white uppercase tracking-tight">{role}</div>
                    <div className="text-lg text-primary font-bold mt-1 uppercase">{company}</div>
                    <div className="text-sm text-gray-400 font-bold mt-1 uppercase">{location}</div>
                  </div>
                  <span className="text-sm font-bold text-white bg-black border-2 border-white px-2 py-1 uppercase">{period}</span>
                </div>
                <ul className="space-y-4">
                  {notes.map((note, i) => (
                    <li key={i} className="flex gap-4 text-base font-bold text-gray-300 group-hover:text-white transition-none">
                      <span className="text-primary flex-shrink-0">►</span>
                      <span className="leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Connect */}
        <div>
          <h2 className="text-2xl font-black text-white mb-6 uppercase border-l-4 border-primary pl-4">
            Connect
          </h2>
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'GitHub', href: 'https://github.com/kulshresthjangid', external: true },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kulshresth-jangid/', external: true },
              { label: 'X / Twitter', href: 'https://x.com/nerdy_ge3k', external: true },
              { label: 'Medium', href: 'https://medium.com/@kulshresthjangid', external: true },
              { label: 'Email', href: 'mailto:kulshresth@example.dev', external: false },
            ].map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="brutal-btn"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
