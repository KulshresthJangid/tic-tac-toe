import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import StatusBadge from '../components/StatusBadge'
import TerminalBlock from '../components/TerminalBlock'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import { appServices } from '../data/apps'

const terminalLines = [
  { prompt: true, text: 'system check', delay: 600 },
  { text: '[  OK  ] spring-boot-api    ACTIVE   :8080   p99=124ms', delay: 180, color: 'text-emerald-400' },
  { text: '[  OK  ] kafka-cluster      ACTIVE   3 brokers   consumer-lag=0', delay: 150, color: 'text-slate-300' },
  { text: '[  OK  ] kubernetes         ACTIVE   12/12 pods scheduled', delay: 150, color: 'text-slate-300' },
  { text: '[  OK  ] postgresql         ACTIVE   primary + 1 read-replica', delay: 150, color: 'text-slate-300' },
  { text: '[  OK  ] redis-scheduler    ACTIVE   capacity: 1M tasks/instance', delay: 150, color: 'text-slate-300' },
  { text: '[  OK  ] prometheus         ACTIVE   scraping 142 targets', delay: 150, color: 'text-slate-300' },
  { prompt: true, text: 'error_budget --window 30d', delay: 400 },
  { text: '  social-saas.availability   99.94% / 99.9% SLO   budget: 87% remaining', delay: 120, color: 'text-slate-400' },
  { text: '  content-api.latency_p99    99.97% / 99.9% SLO   budget: 97% remaining', delay: 100, color: 'text-slate-400' },
  { prompt: true, text: 'whoami', delay: 350 },
  { text: '  kulshresth jangid \u2014 senior software engineer, jaipur', delay: 80, color: 'text-cyan-400' },
]

const impactStats = [
  { value: '40%', label: 'p99 latency reduction', sub: 'MySQL + caching redesign' },
  { value: '1M+', label: 'tasks/instance', sub: 'scheduling engine' },
  { value: '28%', label: 'MTTR reduction', sub: 'microservices migration' },
  { value: '30%', label: 'fewer deploy failures', sub: 'canary + auto-rollback' },
]

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
}

export default function Home() {
  const otherProjects = projects.slice(1, 4)
  const onlineServices = appServices.filter((s) => s.status === 'ONLINE')

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-14">
      {/* Hero */}
      <motion.section {...fadeUp} className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-mono text-cyan-500 mb-2 tracking-[0.2em] uppercase">
              // entry point \u2014 jaipur, india
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.1] mb-4">
              I build the system.
              <br />
              I ship the product.
              <br />
              <span className="text-gradient">I own the outcome.</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-lg">
              4 years designing and operating distributed systems in production. Senior Engineer at
              Equinix. Built a full SaaS platform solo from architecture to deployment. I don't wait
              for requirements to arrive \u2014 I find the problem, define the solution, and ship it.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Java', 'Spring Boot', 'Kafka', 'Kubernetes', 'PostgreSQL', 'Redis'].map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 text-xs font-mono bg-white/[0.05] border border-white/[0.08] rounded text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              to="/projects"
              className="px-5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
            >
              View Projects
            </Link>
            <Link
              to="/apps"
              className="px-5 py-2 rounded-lg glass glass-hover text-slate-300 text-sm font-medium hover:text-white transition-all duration-200"
            >
              App Gateway
            </Link>
            <Link
              to="/about"
              className="px-5 py-2 rounded-lg glass glass-hover text-slate-300 text-sm font-medium hover:text-white transition-all duration-200"
            >
              About
            </Link>
          </div>
        </div>
        <TerminalBlock lines={terminalLines} />
      </motion.section>

      {/* Impact stats */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {impactStats.map(({ value, label, sub }) => (
          <GlassCard key={label} padding="md" className="text-center select-none">
            <div className="text-2xl font-bold text-white font-mono">{value}</div>
            <div className="text-xs text-slate-300 mt-1 leading-snug">{label}</div>
            <div className="text-[10px] font-mono text-slate-600 mt-1">{sub}</div>
          </GlassCard>
        ))}
      </motion.section>

      {/* Featured Case Study */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.16 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-base font-semibold text-white">Featured Product</h2>
          <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded tracking-wider">
            CASE STUDY
          </span>
        </div>

        <GlassCard className="lg:grid lg:grid-cols-5 gap-8 space-y-5 lg:space-y-0">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <h3 className="text-lg font-bold text-white">Social Media Automation SaaS</h3>
                <StatusBadge status="LIVE" pulse />
              </div>
              <p className="text-xs font-mono text-slate-600">Built solo \u00b7 2025 \u00b7 Production</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Problem</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Content teams burn hours on manual posting, platform-switching, and generic AI
                output with no strategic grounding. Existing schedulers (Buffer, Hootsuite) are dumb
                pipes \u2014 no content intelligence, no strategy layer, no ownership of the output.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Solution</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                A knowledge engine that transforms structured brand context into platform-native
                content. Backed by a distributed Kafka async pipeline and a scheduling system
                validated at 1M+ tasks/instance. Teams, roles, approvals, and analytics are
                all first-class features.
              </p>
            </div>

            <Link
              to="/projects/social-saas"
              className="self-start mt-1 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
            >
              Read full architecture \u2192
            </Link>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3 lg:border-l lg:border-white/[0.06] lg:pl-8">
            <p className="text-xs font-mono text-slate-600 uppercase tracking-wider">Key signals</p>
            {[
              ['Scale', '1M+ tasks/instance'],
              ['Transport', 'Kafka async pipeline'],
              ['Scheduling', 'Time-wheel + Redis'],
              ['Multi-tenant', 'Row-level security + RBAC'],
              ['Observability', 'Per-stage Prometheus metrics'],
              ['Platforms', 'LinkedIn, Twitter, Instagram'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline gap-3">
                <span className="text-[11px] font-mono text-slate-600 w-24 flex-shrink-0">{label}</span>
                <span className="text-xs text-slate-300">{value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.section>

      {/* Selected work */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.22 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Selected Work</h2>
            <p className="text-xs text-slate-600 font-mono mt-0.5">// production systems and architecture</p>
          </div>
          <Link to="/projects" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors">
            all projects \u2192
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </motion.section>

      {/* Active services */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.28 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">Active Services</h2>
            <p className="text-xs text-slate-600 font-mono mt-0.5">// nginx gateway \u2014 all systems nominal</p>
          </div>
          <Link to="/apps" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors">
            full registry \u2192
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {onlineServices.map((app) => (
            <a
              key={app.id}
              href={app.externalUrl ?? app.route}
              target={app.externalUrl ? '_blank' : undefined}
              rel={app.externalUrl ? 'noopener noreferrer' : undefined}
              className="block"
            >
              <GlassCard hoverable padding="sm" className="flex items-center gap-3">
                <div className="w-8 h-8 flex-shrink-0 rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-cyan-400 text-xs">
                  {app.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{app.name}</div>
                  <div className="text-[11px] font-mono text-slate-600 truncate">
                    {app.externalUrl ?? app.route}
                  </div>
                </div>
                <StatusBadge status={app.status} pulse />
              </GlassCard>
            </a>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
