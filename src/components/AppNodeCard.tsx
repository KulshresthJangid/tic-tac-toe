import { useTheme } from '../context/ThemeContext'
import AppNodeCardBrutal from './AppNodeCardBrutal'
import AppNodeCardGlass from './AppNodeCardGlass'

export default function AppNodeCard(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <AppNodeCardBrutal {...props} /> : <AppNodeCardGlass {...props} />
}
