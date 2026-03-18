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
        className="h-full flex flex-col gap-4 group-hover:border-white/[0.16] group-hover:-translate-y-0.5 transition-transform duration-300"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white leading-snug">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-sm text-slate-400 leading-relaxed flex-1">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] font-mono bg-white/[0.05] border border-white/[0.08] rounded text-slate-300"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="px-2 py-0.5 text-[10px] font-mono text-slate-600">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="text-xs text-slate-600 font-mono">{project.year}</span>
          <span className="text-xs text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
            View details →
          </span>
        </div>
      </GlassCard>
    </Link>
  )
}
