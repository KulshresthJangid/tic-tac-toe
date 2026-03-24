import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'
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
    'Engineering Projects — Microservices, Kafka, Kubernetes | Kulshresth Jangid',
    'Backend engineering projects: microservices architecture, distributed systems, API performance, CI/CD automation, and SLO observability. Java, Spring Boot, Kafka, Kubernetes.',
  )
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
          // projects
        </p>
        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Engineering Work</h1>
        <p className="text-white/40 text-sm mb-8 max-w-lg leading-relaxed">
          Systems built with a focus on correctness under load and debuggability under incident.
          Microservices architecture, distributed systems, high-throughput API engineering,
          and cloud-native deployment.
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
