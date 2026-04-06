import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Apps from './pages/Apps'
import About from './pages/About'
import DSA from './pages/DSA'
import DSAv2 from './pages/DSAv2'
import Admin from './pages/Admin'
import AdminPlan from './pages/AdminPlan'
import AIMLRoadmap from './pages/AIMLRoadmap'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

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
          <Route path="/ai-ml" element={<ProtectedRoute><AIMLRoadmap /></ProtectedRoute>} />
          <Route path="/dsa" element={<ProtectedRoute><DSA /></ProtectedRoute>} />
          <Route path="/dsa-v2" element={<ProtectedRoute><DSAv2 /></ProtectedRoute>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/plan" element={<ProtectedRoute><AdminPlan /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}
