import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useGenZ } from '../context/GenZContext'
import GlassCard from '../components/GlassCard'
import StatusBadge from '../components/StatusBadge'
import TerminalBlock from '../components/TerminalBlock'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import { appServices } from '../data/apps'

const terminalLines = [
  { prompt: true, text: 'status', delay: 600 },
  { text: '[  OK  ] tic-tac-toe    ACTIVE   :443    entry-point', delay: 160, color: 'text-white/70' },
  { text: '[  OK  ] kaizex       ACTIVE   /kaizex  kaizex-saas', delay: 140, color: 'text-white/50' },
  { text: '[  OK  ] smart-server   ACTIVE   :8080   backend-api', delay: 140, color: 'text-white/50' },
  { text: '[  OK  ] scheduler      ACTIVE   redis   1M tasks/inst', delay: 140, color: 'text-white/50' },
  { prompt: true, text: 'slo --window 30d', delay: 400 },
  { text: '  kaizex.availability    99.94%   SLO 99.9%   budget: 87%', delay: 120, color: 'text-white/30' },
  { text: '  smart-server.latency_p99  99.97%   SLO 99.9%   budget: 97%', delay: 100, color: 'text-white/30' },
  { prompt: true, text: 'whoami', delay: 350 },
  { text: '  kulshresth jangid — systems architect, jaipur', delay: 80, color: 'text-white/60' },
]

const impactStats = [
  { value: '40%', label: 'p99 latency cut', sub: 'MySQL + caching redesign' },
  { value: '1M+', label: 'tasks/instance', sub: 'scheduling engine' },
  { value: '28%', label: 'MTTR reduction', sub: 'microservices migration' },
  { value: '30%', label: 'fewer deploy failures', sub: 'canary + auto-rollback' },
]

const genzTerminalLines = [
  { prompt: true, text: 'vibe --check', delay: 600 },
  { text: '[  OK  ] tic-tac-toe    NOT CRASHED  :443    still standing', delay: 160, color: 'text-white/70' },
  { text: '[  OK  ] kaizex       ATE          /kaizex  no crumbs left', delay: 140, color: 'text-white/50' },
  { text: '[  OK  ] smart-server   COPING       :8080   its giving backend', delay: 140, color: 'text-white/50' },
  { text: '[  OK  ] scheduler      SENDING      redis   1M tasks bestie', delay: 140, color: 'text-white/50' },
  { prompt: true, text: 'slo --vibecheck 30d', delay: 400 },
  { text: '  kaizex   99.94%   eating       budget: 87%  slay', delay: 120, color: 'text-white/30' },
  { text: '  smart-server 99.97%   no cap       budget: 97%  ate', delay: 100, color: 'text-white/30' },
  { prompt: true, text: 'whoami', delay: 350 },
  { text: '  kul from jaipur — delulu enough to build this', delay: 80, color: 'text-white/60' },
]

const genzImpactStats = [
  { value: '40%', label: 'made db go fast', sub: 'fixed what was clearly broken' },
  { value: '1M+', label: 'tasks handled ngl', sub: 'scheduler was unhinged' },
  { value: '28%', label: 'panic time cut', sub: 'services stopped beefing' },
  { value: '30%', label: 'fewer 3am calls', sub: 'auto-rollback clocked in' },
]

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
}

export default function Home() {
  usePageMeta(
    'Kulshresth Jangid — Backend Engineer · Node.js, TypeScript, Java · Open to Remote',
    'Backend engineer with 4+ years shipping distributed systems, SaaS APIs, and real-time applications. Available for remote roles and consulting.',
    {
      canonical: 'https://buildwithkulshresth.com/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What does Kulshresth Jangid specialise in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Backend engineering — distributed systems, SaaS APIs, microservices architecture, and performance engineering using Node.js, Java, TypeScript, and Go.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Kulshresth Jangid available for remote roles?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Currently open to senior backend engineering roles and consulting engagements. Remote-first. Based in Jaipur, India.',
            },
          },
          {
            '@type': 'Question',
            name: 'What technologies does Kulshresth Jangid work with?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Node.js, TypeScript, Java, Spring Boot, Go, Python, React, Kafka, RabbitMQ, Redis, PostgreSQL, MySQL, MongoDB, Kubernetes, Docker, and AWS.',
            },
          },
        ],
      },
    },
  )
  const { genzMode } = useGenZ()
  const otherProjects = projects.slice(1, 4)
  const onlineServices = appServices.filter((s) => s.status === 'ONLINE')

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-14">
      {/* Hero */}
      <motion.section {...fadeUp} className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-mono text-white/25 mb-4 tracking-[0.25em] uppercase">
              {genzMode ? 'kul · jaipur, india · he/him' : 'Kulshresth Jangid — Jaipur, India'}
            </p>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
              {genzMode ? (
                <>
                  i make servers
                  <br />
                  go brrr.
                  <br />
                  <span className="text-white/30">no cap.</span>
                </>
              ) : (
                <>
                  Backend Engineer.
                  <br />
                  I build systems
                  <br />
                  <span className="text-white/30">that scale.</span>
                </>
              )}
            </h1>
            <p className="text-sm text-white/40 leading-relaxed max-w-md">
              {genzMode
                ? "been writing code since before it was a personality. founded a whole saas thing from scratch. senior engineer at equinix. lowkey just vibing and shipping."
                : 'Four years building distributed systems at scale. Founded Kaizex — a multi-tenant Marketing OS — from schema to Kubernetes, currently running in production. Senior Engineer at Equinix.'}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link
              to="/projects"
              className="px-5 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-150"
            >
              {genzMode ? 'witness the damage' : 'View my work'}
            </Link>
            <Link
              to="/about"
              className="px-5 py-2 rounded-lg glass glass-hover text-white/60 text-sm font-medium hover:text-white transition-all duration-150"
            >
              {genzMode ? 'shoot your shot' : "Let's talk"}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-xs font-mono text-white/35">
              {genzMode
                ? 'open to remote · will consider equity · april 2026'
                : 'Available for remote roles · Open to new projects · March 2026'}
            </span>
          </div>
        </div>
        <TerminalBlock lines={genzMode ? genzTerminalLines : terminalLines} />
      </motion.section>

      {/* Impact stats */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {(genzMode ? genzImpactStats : impactStats).map(({ value, label, sub }) => (
          <GlassCard key={label} padding="md" className="text-center select-none">
            <div className="text-2xl font-black text-white font-mono">{value}</div>
            <div className="text-xs text-white/50 mt-1 leading-snug">{label}</div>
            <div className="text-[10px] font-mono text-white/20 mt-1">{sub}</div>
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
          <h2 className="text-base font-semibold text-white">
            {genzMode ? 'the one i am actually proud of — Kaizex' : 'Featured Case Study — Kaizex'}
          </h2>
          <span className="px-2 py-0.5 text-[10px] font-mono bg-white/[0.05] border border-white/[0.1] text-white/50 rounded tracking-wider">
            {genzMode ? 'MY MAGNUM OPUS' : 'CASE STUDY'}
          </span>
        </div>

        <GlassCard className="lg:grid lg:grid-cols-5 gap-8 space-y-5 lg:space-y-0">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
          <h3 className="text-lg font-bold text-white">Kaizex — Marketing Operating System</h3>
                <StatusBadge status="LIVE" pulse />
              </div>
              <p className="text-xs font-mono text-white/25">Founded · 2025 · Production</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-white/25 font-mono uppercase tracking-wider">
                {genzMode ? 'the pain' : 'Problem'}
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                {genzMode
                  ? 'content teams were cooked. posting manually, switching between 10 tabs, getting mid AI output with zero strategic brain. buffer and hootsuite? glorified copy-paste tools. i said no.'
                  : 'Content teams are operationally bottlenecked: posting manually, context-switching across platforms, and getting generic AI output with no strategic grounding. Existing schedulers (Buffer, Hootsuite) are dumb pipes — no content intelligence, no insight layer, no ownership of the output.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-white/25 font-mono uppercase tracking-wider">
                {genzMode ? 'what i did about it' : 'Solution'}
              </p>
              <p className="text-sm text-white/50 leading-relaxed">
                {genzMode
                  ? 'built a whole marketing OS. four stages: dump your raw thoughts in, AI extracts the good bits, persona engine makes it sound like you, async workers publish it. three modes: do it yourself, let AI draft it, or just let it run while you sleep. bring your own AI model. the scheduler handles 1M+ tasks. yes, really.'
                  : 'A Marketing Operating System with a four-stage pipeline: Source → Insight → Content → Distribution. Raw knowledge enters as articles and notes; the AI layer extracts strategic signals; a configurable persona engine generates platform-native content; async workers publish it. Three automation modes: Manual, Review, Autopilot. BYO-AI: connect any LLM. Scheduling engine validated at 1M+ tasks/instance.'}
              </p>
            </div>

            <Link
              to="/projects/social-saas"
              className="self-start mt-1 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white/60 text-xs font-mono hover:bg-white/[0.09] hover:text-white transition-all duration-200"
            >
              {genzMode ? 'see the unhinged plan ->' : 'Read full architecture →'}
            </Link>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3 lg:border-l lg:border-white/[0.06] lg:pl-8">
            <p className="text-xs font-mono text-white/20 uppercase tracking-wider">
              {genzMode ? 'the receipts' : 'Key signals'}
            </p>
            {[
              ['Pipeline', 'Source → Insight → Content → Distribution'],
              ['Automation', 'Manual / Review / Autopilot'],
              ['Scale', '1M+ tasks/instance'],
              ['AI', 'BYO (OpenAI / Anthropic / self-hosted)'],
              ['Entry', 'tic-tac-toe (:443)'],
              ['Frontend', 'kaizex (/kaizex)'],
              ['Backend', 'smart-server (:8080)'],
              ['Platforms', 'LinkedIn (live) · X (WIP)'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline gap-3">
                <span className="text-[11px] font-mono text-white/20 w-24 flex-shrink-0">{label}</span>
                <span className="text-xs text-white/50">{value}</span>
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
            <h2 className="text-base font-semibold text-white">
              {genzMode ? 'other stuff that actually runs' : 'Selected Backend Engineering Work'}
            </h2>
            <p className="text-xs text-white/20 font-mono mt-0.5">
              {genzMode ? '// real code, real prod, real chaos' : '// production systems and architecture'}
            </p>
          </div>
          <Link to="/projects" className="text-xs text-white/40 hover:text-white font-mono transition-colors">
            {genzMode ? 'all the damage ->' : 'all projects →'}
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
            <h2 className="text-base font-semibold text-white">
              {genzMode ? 'things currently not crashing' : 'Live Infrastructure'}
            </h2>
            <p className="text-xs text-white/20 font-mono mt-0.5">
              {genzMode ? '// tic-tac-toe gateway — touch wood' : '// tic-tac-toe gateway — all systems nominal'}
            </p>
          </div>
          <Link to="/apps" className="text-xs text-white/40 hover:text-white font-mono transition-colors">
            {genzMode ? 'full roster ->' : 'full registry →'}
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
                <div className="w-8 h-8 flex-shrink-0 rounded-md bg-white/[0.05] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-white/50 text-xs">
                  {app.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{app.name}</div>
                  <div className="text-[11px] font-mono text-white/25 truncate">
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
