import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { projects } from '../data/projects'
import GlassCard from '../components/GlassCard'
import StatusBadge from '../components/StatusBadge'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const project = projects.find((p) => p.id === id)
  const canonicalUrl = project
    ? `https://buildwithkulshresth.com/projects/${project.id}`
    : undefined
  const projectSchema = project
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: project.title,
        description: project.shortDescription,
        url: canonicalUrl,
        programmingLanguage: project.techStack,
        dateCreated: `${project.year}`,
        author: {
          '@type': 'Person',
          name: 'Kulshresth Jangid',
          url: 'https://buildwithkulshresth.com',
        },
        ...(project.liveUrl?.startsWith('http')
          ? { codeRepository: project.liveUrl }
          : {}),
        ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
      }
    : undefined
  usePageMeta(
    project
      ? `${project.title} — Architecture Case Study · Kulshresth Jangid`
      : 'Project not found | Kulshresth Jangid',
    project ? project.shortDescription : undefined,
    {
      canonical: canonicalUrl,
      jsonLd: projectSchema,
    },
  )

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
          className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white font-mono transition-colors"
        >
          ← back to projects
        </Link>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <StatusBadge status={project.status} pulse={project.status === 'LIVE'} />
            <span className="text-xs font-mono text-white/25">{project.year}</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">{project.title}</h1>
          <p className="text-white/45 text-sm leading-relaxed max-w-2xl">{project.description}</p>
        </div>

        {/* Action links */}
        <div className="flex gap-3 flex-wrap">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target={project.liveUrl.startsWith('http') ? '_blank' : undefined}
              rel={project.liveUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-150"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              Launch Application
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg glass glass-hover text-white/50 text-sm font-medium hover:text-white transition-all duration-200"
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
                <span className="text-white/30">$</span> Architecture
              </h2>
              <ul className="space-y-3">
                {project.architecture.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-white/20 font-mono text-xs mt-0.5 flex-shrink-0">→</span>
                    <span className="text-white/45 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          <GlassCard
            className={!project.architecture ? 'md:col-span-3' : undefined}
          >
            <h2 className="text-sm font-semibold text-white mb-4 font-mono flex items-center gap-2">
              <span className="text-white/30">$</span> Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-mono bg-white/[0.04] border border-white/[0.08] rounded text-white/50"
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
              <span className="text-white/30">$</span> Outcomes
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-white/25 text-xs font-mono mt-0.5 flex-shrink-0">→</span>
                  <span className="text-sm text-white/45 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </motion.div>
    </div>
  )
}
