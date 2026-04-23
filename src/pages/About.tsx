import { useTheme } from '../context/ThemeContext'
import AboutBrutal from './AboutBrutal'
import AboutGlass from './AboutGlass'

export default function About(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <AboutBrutal {...props} /> : <AboutGlass {...props} />
}
