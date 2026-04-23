import { useTheme } from '../context/ThemeContext'
import HomeBrutal from './HomeBrutal'
import HomeGlass from './HomeGlass'

export default function Home(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <HomeBrutal {...props} /> : <HomeGlass {...props} />
}
