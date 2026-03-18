import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import GlassCard from '../components/GlassCard'
import StatusBadge from '../components/StatusBadge'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)

  if (!project) return <Navigate to="/projects" replace />

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 font-mono transition-colors"
        >
          ← back to projects
        </Link>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <StatusBadge status={project.status} pulse={project.status === 'LIVE'} />
            <span className="text-xs font-mono text-slate-600">{project.year}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{project.title}</h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl">{project.description}</p>
        </div>

        {/* Action links */}
        <div className="flex gap-3 flex-wrap">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target={project.liveUrl.startsWith('http') ? '_blank' : undefined}
              rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Launch Application
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg glass glass-hover text-slate-300 text-sm font-medium hover:text-white transition-all duration-200"
            >
              GitHub →
            </a>
          )}
        </div>

        {/* Architecture + Tech stack */}
        <div className="grid md:grid-cols-3 gap-6">
          {project.architecture && (
            <GlassCard className="md:col-span-2">
              <h2 className="text-sm font-semibold text-white mb-4 font-mono flex items-center gap-2">
                <span className="text-cyan-500">$</span> Architecture
              </h2>
              <ul className="space-y-3">
                {project.architecture.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-slate-700 font-mono text-xs mt-0.5 flex-shrink-0">→</span>
                    <span className="text-slate-400 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          <GlassCard
            className={!project.architecture ? 'md:col-span-3' : undefined}
          >
            <h2 className="text-sm font-semibold text-white mb-4 font-mono flex items-center gap-2">
              <span className="text-cyan-500">$</span> Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono bg-white/[0.05] border border-white/[0.08] rounded text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Features */}
        {project.features && (
          <GlassCard>
            <h2 className="text-sm font-semibold text-white mb-4 font-mono flex items-center gap-2">
              <span className="text-cyan-500">$</span> Features
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-emerald-500 text-xs font-mono mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-sm text-slate-400 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </motion.div>
    </div>
  )
}
