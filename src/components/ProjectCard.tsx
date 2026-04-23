import { useTheme } from '../context/ThemeContext'
import ProjectCardBrutal from './ProjectCardBrutal'
import ProjectCardGlass from './ProjectCardGlass'

export default function ProjectCard(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <ProjectCardBrutal {...props} /> : <ProjectCardGlass {...props} />
}
