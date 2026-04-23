import { Link } from 'react-router-dom'
import type { Project } from '../types'
import StatusBadge from './StatusBadge'
import GlassCard from './GlassCard'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.id}`} className="block group h-full">
      <GlassCard
        hoverable
        className="h-full flex flex-col gap-4 border-2 border-white group-hover:bg-white group-hover:text-black transition-none rounded-none"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-white group-hover:text-black leading-snug uppercase tracking-wider">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-sm text-gray-300 group-hover:text-black leading-relaxed flex-1 font-mono">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] font-bold font-mono bg-black text-primary border-2 border-primary uppercase"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-black text-primary border-2 border-primary uppercase">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t-2 border-white group-hover:border-black">
          <span className="text-xs font-bold font-mono text-white group-hover:text-black">{project.year}</span>
          <span className="text-xs font-bold uppercase group-hover:text-black transition-none">
            [ VIEW LOGS ]
          </span>
        </div>
      </GlassCard>
    </Link>
  )
}
