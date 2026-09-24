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

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  relationship: string
  quote: string
  linkedinUrl?: string
  /**
   * DRAFT SAFETY FLAG — do not flip to true, do not deploy this testimonial,
   * until the named person has read their exact quote and explicitly said
   * it's fine to publish under their name. See TESTIMONIALS_TODO.md.
   */
  approved: boolean
}
