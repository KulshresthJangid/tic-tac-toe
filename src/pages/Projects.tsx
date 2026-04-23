import { useTheme } from '../context/ThemeContext'
import ProjectsBrutal from './ProjectsBrutal'
import ProjectsGlass from './ProjectsGlass'

export default function Projects(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <ProjectsBrutal {...props} /> : <ProjectsGlass {...props} />
}
