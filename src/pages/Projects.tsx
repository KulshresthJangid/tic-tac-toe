import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
import { useGenZ } from '../context/GenZContext'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'
import type { ProjectStatus } from '../types'

type Filter = ProjectStatus | 'ALL'

const filters: Array<{ value: Filter; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'LIVE', label: 'Live' },
  { value: 'DEV', label: 'In Dev' },
  { value: 'INTERNAL', label: 'Internal' },
  { value: 'ARCHIVED', label: 'Archived' },
]

export default function Projects() {
  usePageMeta(
    'Projects & Case Studies — Kulshresth Jangid · Backend Systems & SaaS Architecture',
    'Case studies and architecture breakdowns: real systems built, decisions made, outcomes measured. Node.js, Java, TypeScript, Go in production.',
    {
      canonical: 'https://buildwithkulshresth.com/projects',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Backend Engineering Projects — Kulshresth Jangid',
        description: 'Production systems and architecture case studies by Kulshresth Jangid: distributed SaaS platforms, microservices migrations, and API performance engineering.',
        url: 'https://buildwithkulshresth.com/projects',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            url: 'https://buildwithkulshresth.com/projects/social-saas',
            name: 'Kaizex — Marketing Operating System',
          },
          {
            '@type': 'ListItem',
            position: 2,
            url: 'https://buildwithkulshresth.com/projects/microservices-migration',
            name: 'Monolith to Microservices Migration',
          },
          {
            '@type': 'ListItem',
            position: 3,
            url: 'https://buildwithkulshresth.com/projects/api-performance',
            name: 'API Performance Overhaul',
          },
          {
            '@type': 'ListItem',
            position: 4,
            url: 'https://buildwithkulshresth.com/projects/sso-platform',
            name: 'Enterprise SSO Security Portal',
          },
          {
            '@type': 'ListItem',
            position: 5,
            url: 'https://buildwithkulshresth.com/projects/goalbegins',
            name: 'GoalBegins — Corporate Services Portal',
          },
          {
            '@type': 'ListItem',
            position: 6,
            url: 'https://buildwithkulshresth.com/projects/webhook-proxy',
            name: 'Secure Webhook Proxy & Relay Gateway',
          },
        ],
      },
    },
  )
  const { genzMode } = useGenZ()
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL')

  const filtered =
    activeFilter === 'ALL' ? projects : projects.filter((p) => p.status === activeFilter)

  const countFor = (f: Filter) =>
    f === 'ALL' ? projects.length : projects.filter((p) => p.status === f).length

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-mono text-white/20 mb-2 tracking-[0.25em] uppercase">
          {genzMode ? '// the damage' : '// projects'}
        </p>
        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
          {genzMode ? 'Stuff I Actually Built' : 'Engineering Work'}
        </h1>
        <p className="text-white/40 text-sm mb-8 max-w-lg leading-relaxed">
          {genzMode
            ? 'real code, real prod, real chaos. these are not side projects they are therapy. every single one of these has been in production and survived.'
            : 'Systems built with a focus on correctness under load and debuggability under incident. Microservices architecture, distributed systems, high-throughput API engineering, and cloud-native deployment.'}
        </p>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filters.map(({ value, label }) => {
            const count = countFor(value)
            if (count === 0 && value !== 'ALL') return null
            return (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200',
                  activeFilter === value
                    ? 'bg-white text-black'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.07]',
                ].join(' ')}
              >
                {label}
                <span className="ml-1.5 text-white/25">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="h-full"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/20 font-mono text-sm">
            No projects with status {activeFilter}.
          </div>
        )}
      </motion.div>
    </div>
  )
}
