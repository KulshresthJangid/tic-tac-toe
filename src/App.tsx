import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Apps from './pages/Apps'
import About from './pages/About'
import DSA from './pages/DSA'
import DSAv2 from './pages/DSAv2'

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/about" element={<About />} />
          <Route path="/dsa" element={<DSA />} />
          <Route path="/dsa-v2" element={<DSAv2 />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}
