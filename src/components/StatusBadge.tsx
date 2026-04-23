import { useTheme } from '../context/ThemeContext'
import StatusBadgeBrutal from './StatusBadgeBrutal'
import StatusBadgeGlass from './StatusBadgeGlass'

export default function StatusBadge(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <StatusBadgeBrutal {...props} /> : <StatusBadgeGlass {...props} />
}
