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
            name: 'EchoPost — Marketing Operating System',
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
    <div className="max-w-7xl mx-auto px-6 py-12 font-mono selection:bg-primary selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "linear" }}
      >
        <p className="text-sm font-bold text-primary mb-2 tracking-widest uppercase">
          {genzMode ? '// the damage' : '// projects'}
        </p>
        <h1 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase border-b-4 border-secondary inline-block pb-2">
          {genzMode ? 'Stuff I Actually Built' : 'Engineering Work'}
        </h1>
        <p className="text-white text-lg font-bold mb-12 max-w-2xl leading-relaxed">
          {genzMode
            ? 'real code, real prod, real chaos. these are not side projects they are therapy. every single one of these has been in production and survived.'
            : 'Systems built with a focus on correctness under load and debuggability under incident. Microservices architecture, distributed systems, high-throughput API engineering, and cloud-native deployment.'}
        </p>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-4 mb-12">
          {filters.map(({ value, label }) => {
            const count = countFor(value)
            if (count === 0 && value !== 'ALL') return null
            return (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={[
                  'px-4 py-2 font-bold uppercase tracking-widest border-2 transition-none border-white shadow-[4px_4px_0_0_#fff]',
                  activeFilter === value
                    ? 'bg-primary text-black border-primary shadow-[4px_4px_0_0_#00FF41] translate-x-[2px] translate-y-[2px]'
                    : 'bg-black text-white hover:bg-white hover:text-black hover:translate-x-[2px] hover:translate-y-[2px]',
                ].join(' ')}
              >
                {label}
                <span className="ml-2 font-black">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="h-full"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-secondary font-black text-2xl uppercase border-4 border-dashed border-secondary mt-8">
            [ No projects with status {activeFilter} ]
          </div>
        )}
      </motion.div>
    </div>
  )
}
