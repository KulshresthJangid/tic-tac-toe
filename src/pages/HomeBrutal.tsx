import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useGenZ } from '../context/GenZContext'
import StatusBadge from '../components/StatusBadge'
import TerminalBlock from '../components/TerminalBlock'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import { appServices } from '../data/apps'

const terminalLines = [
  { prompt: true, text: 'init --core-systems', delay: 600 },
  { text: '[ SYS ] booting backend command...', delay: 160, color: 'text-primary' },
  { text: '[ OK  ] memory allocated: 128TB', delay: 140, color: 'text-white' },
  { text: '[ OK  ] caffeine injection: stable', delay: 140, color: 'text-white' },
  { prompt: true, text: 'query --role backend_engineer', delay: 400 },
  { text: '  => optimizing query performance...', delay: 120, color: 'text-secondary' },
  { text: '  => dropping production DB... (just kidding)', delay: 100, color: 'text-secondary' },
  { prompt: true, text: 'whoami', delay: 350 },
  { text: '  kulshresth jangid — systems architect, making servers go brrr', delay: 80, color: 'text-primary' },
]

const genzTerminalLines = [
  { prompt: true, text: 'vibe --check', delay: 600 },
  { text: '[ SYS ] entering delulu mode...', delay: 160, color: 'text-primary' },
  { text: '[ OK  ] backend is giving main character energy', delay: 140, color: 'text-white' },
  { text: '[ OK  ] 0 crumbs left in the codebase', delay: 140, color: 'text-white' },
  { prompt: true, text: 'query --role backend_engineer', delay: 400 },
  { text: '  => doing the absolute most...', delay: 120, color: 'text-secondary' },
  { text: '  => serving scalable realness...', delay: 100, color: 'text-secondary' },
  { prompt: true, text: 'whoami', delay: 350 },
  { text: '  kulshresth jangid — high key carrying the team rn', delay: 80, color: 'text-primary' },
]

export default function Home() {
  usePageMeta(
    'Kulshresth Jangid — Backend Engineer | System Architect',
    'Backend engineer architecting high-performance, scalable systems that handle the heavy lifting while you sleep.',
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
              text: 'Backend engineering — distributed systems, SaaS APIs, microservices architecture, and performance engineering.',
            },
          }
        ],
      },
    },
  )
  const { genzMode } = useGenZ()
  const otherProjects = projects.slice(1, 4)
  const onlineServices = appServices.filter((s) => s.status === 'ONLINE')

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-mono selection:bg-primary selection:text-black">
      
      {/* Brutalist Marquee */}
      <div className="w-full bg-white text-black py-2 overflow-hidden border-b-2 border-white flex">
        <div className="whitespace-nowrap animate-marquee flex items-center gap-8 font-bold uppercase tracking-widest text-sm">
          <span>{genzMode ? 'NO CAP' : 'SYSTEMS ONLINE'}</span>
          <span>•</span>
          <span>{genzMode ? 'FR FR' : '100% UPTIME'}</span>
          <span>•</span>
          <span>{genzMode ? 'GO BRRR' : 'ZERO LATENCY'}</span>
          <span>•</span>
          <span>{genzMode ? 'SHEESH' : 'DEPLOYED'}</span>
          <span>•</span>
          <span>{genzMode ? 'NO CAP' : 'SYSTEMS ONLINE'}</span>
          <span>•</span>
          <span>{genzMode ? 'FR FR' : '100% UPTIME'}</span>
          <span>•</span>
          <span>{genzMode ? 'GO BRRR' : 'ZERO LATENCY'}</span>
          <span>•</span>
          <span>{genzMode ? 'SHEESH' : 'DEPLOYED'}</span>
          <span>•</span>
          <span>{genzMode ? 'NO CAP' : 'SYSTEMS ONLINE'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24 relative z-10">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="flex flex-col gap-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border-2 border-primary bg-black text-primary font-bold mb-8 uppercase tracking-widest shadow-[4px_4px_0_0_#00FF41]">
                <span className="w-3 h-3 bg-primary animate-none" />
                {genzMode ? 'System Slaying: Active' : 'System Status: Active'}
              </div>
              
              <h1 className="text-6xl sm:text-8xl font-black text-white leading-[1] tracking-tighter mb-6 uppercase">
                {genzMode ? (
                  <>Backend Engineer.<br/><span className="text-primary hover:text-secondary transition-none">I make servers</span><br/>go brrr.</>
                ) : (
                  <>Backend Engineer.<br/><span className="text-primary hover:text-secondary transition-none">I architect</span><br/>systems.</>
                )}
              </h1>
              <p className="text-xl text-white font-bold leading-relaxed max-w-lg">
                {genzMode 
                  ? "Shipping code so clean it feels illegal. Founded a SaaS, survived Equinix, currently writing systems that don't panic at 3AM." 
                  : "Bridging the gap between complex logic and seamless execution. 4+ years of building fault-tolerant microservices and high-throughput APIs."}
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <a
                href="/resume.pdf"
                target="_blank"
                className="brutal-btn"
              >
                {genzMode ? 'Grab the receipts' : 'Download Resume'}
              </a>
              <Link
                to="/projects"
                className="brutal-btn-secondary"
              >
                {genzMode ? 'View the damage' : 'Explore Architecture'}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="relative"
          >
            <div className="brutal-card p-6 shadow-brutal-primary">
              <TerminalBlock lines={genzMode ? genzTerminalLines : terminalLines} />
            </div>
          </motion.div>
        </section>

        {/* Featured Case Study */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-4xl font-black text-white uppercase border-b-4 border-primary inline-block pb-2">
              {genzMode ? 'The Magnum Opus' : 'Featured Architecture'}
            </h2>
          </div>

          <div className="brutal-card p-0 flex flex-col lg:flex-row group transition-none">
            
            <div className="p-10 flex flex-col justify-center flex-1 border-b-2 lg:border-b-0 lg:border-r-2 border-white group-hover:bg-white group-hover:text-black transition-none">
              <div className="inline-flex items-center gap-2 mb-6">
                <StatusBadge status="LIVE" pulse={false} />
                <span className="text-xs font-bold tracking-widest uppercase">EchoPost OS</span>
              </div>
              
              <h3 className="text-5xl font-black mb-6 uppercase tracking-tighter">
                {genzMode ? 'Marketing, but make it big brain.' : 'A Next-Gen Marketing OS.'}
              </h3>
              
              <p className="text-xl font-bold leading-relaxed mb-8">
                {genzMode 
                  ? 'Built an entire orchestration layer so you don\'t have to post manually like a pleb. 1M+ tasks handled while you sleep.'
                  : 'A 4-stage pipeline (Source → Insight → Content → Distribution) processing over 1M+ tasks/instance with a custom LLM orchestration layer.'}
              </p>
              
              <Link
                to="/projects/social-saas"
                className="brutal-btn-secondary w-fit"
              >
                {genzMode ? 'Dive into the madness' : 'Read Technical Case Study'}
              </Link>
            </div>
            
            <div className="bg-black text-white p-10 flex flex-col justify-center w-full lg:w-[400px]">
              <h4 className="text-lg font-bold uppercase tracking-widest mb-6 border-b-2 border-white pb-2">System Capabilities</h4>
              
              <div className="space-y-6">
                {[
                  ['Pipeline Architecture', 'Source → Insight → Content → Distribution'],
                  ['Scale Metrics', 'Validated at 1M+ tasks/instance'],
                  ['AI Integration', 'BYO-LLM (OpenAI / Anthropic ready)'],
                  ['Infrastructure', 'K8s, Redis, Postgres, Node.js'],
                ].map(([label, value]) => (
                  <div key={label} className="group/item border-l-4 border-primary pl-4 hover:border-secondary transition-none">
                    <div className="text-sm font-bold text-primary mb-1 uppercase">{label}</div>
                    <div className="text-base font-bold text-white group-hover/item:text-secondary">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Selected Work Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-end justify-between mb-8 border-b-4 border-secondary pb-2">
            <h2 className="text-4xl font-black text-white uppercase">
              {genzMode ? 'Other side quests' : 'Selected Systems'}
            </h2>
            <Link to="/projects" className="text-lg font-bold text-secondary hover:text-white uppercase transition-none bg-black px-2">
              [ View All Systems ]
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherProjects.map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Live Services Tracker */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.2 }}
          className="pb-20"
        >
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-4xl font-black text-white uppercase border-b-4 border-primary inline-block pb-2">
              {genzMode ? 'Stuff currently breathing' : 'Live Infrastructure'}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineServices.map((app, i) => (
              <motion.a
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                key={app.id}
                href={app.externalUrl ?? app.route}
                target={app.externalUrl ? '_blank' : undefined}
                rel={app.externalUrl ? 'noopener noreferrer' : undefined}
                className="block brutal-card brutal-card-hover p-4 group hover:bg-white transition-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black border-2 border-white group-hover:border-black flex items-center justify-center font-bold text-primary text-lg transition-none">
                    {app.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-black text-white group-hover:text-black uppercase truncate transition-none">{app.name}</div>
                    <div className="text-xs font-bold text-gray-400 group-hover:text-gray-800 truncate transition-none">
                      {app.externalUrl ?? app.route}
                    </div>
                  </div>
                  <StatusBadge status={app.status} pulse={false} />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
