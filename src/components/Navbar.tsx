import { useTheme } from '../context/ThemeContext'
import NavbarBrutal from './NavbarBrutal'
import NavbarGlass from './NavbarGlass'

export default function Navbar(props: any) {
  const { theme } = useTheme()
  return theme === 'brutal' ? <NavbarBrutal {...props} /> : <NavbarGlass {...props} />
}
