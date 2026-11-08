import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GenZProvider } from './context/GenZContext'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Apps from './pages/Apps'
import About from './pages/About'
import Hire from './pages/Hire'
import Privacy from './pages/Privacy'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

// Private pages carry ~340 KB of source (curricula, plans). Splitting them out
// keeps the public bundle small, which is what a first-time visitor downloads.
const DSA = lazy(() => import('./pages/DSA'))
const DSAv2 = lazy(() => import('./pages/DSAv2'))
const DSAv3 = lazy(() => import('./pages/DSAv3'))
const Admin = lazy(() => import('./pages/Admin'))
const AdminPlan = lazy(() => import('./pages/AdminPlan'))
const AIMLRoadmap = lazy(() => import('./pages/AIMLRoadmap'))

export default function App() {
  return (
    <GenZProvider>
      <BrowserRouter>
        <MainLayout>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/about" element={<About />} />
              <Route path="/hire" element={<Hire />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/ai-ml" element={<ProtectedRoute><AIMLRoadmap /></ProtectedRoute>} />
              <Route path="/dsa" element={<ProtectedRoute><DSA /></ProtectedRoute>} />
              <Route path="/dsa-v2" element={<ProtectedRoute><DSAv2 /></ProtectedRoute>} />
              <Route path="/dsa-v3" element={<ProtectedRoute><DSAv3 /></ProtectedRoute>} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/plan" element={<ProtectedRoute><AdminPlan /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </BrowserRouter>
    </GenZProvider>
  )
}
