export type ProjectStatus = 'LIVE' | 'DEV' | 'INTERNAL' | 'ARCHIVED'
export type ServiceStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'MAINTENANCE'

export interface Project {
  id: string
  title: string
  shortDescription: string
  description: string
  techStack: string[]
  status: ProjectStatus
  liveUrl?: string
  githubUrl?: string
  architecture?: string[]
  features?: string[]
  year: number
}

export interface AppService {
  id: string
  name: string
  description: string
  route: string
  externalUrl?: string
  status: ServiceStatus
  version: string
  tags: string[]
}
