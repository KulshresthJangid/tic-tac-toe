import { useTheme } from '../context/ThemeContext'
import GlassCardBrutal from './GlassCardBrutal'
import GlassCardGlass from './GlassCardGlass'

export default function GlassCard(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <GlassCardBrutal {...props} /> : <GlassCardGlass {...props} />
}
