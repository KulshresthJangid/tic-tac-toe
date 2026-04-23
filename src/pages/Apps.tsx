import { useTheme } from '../context/ThemeContext'
import AppsBrutal from './AppsBrutal'
import AppsGlass from './AppsGlass'

export default function Apps(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <AppsBrutal {...props} /> : <AppsGlass {...props} />
}
