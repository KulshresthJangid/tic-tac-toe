import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

// Prerendered pages already show their content. React replaces it on load, and the
// entry animations restart from opacity 0, which pushes LCP out to when JS finishes.
// While this flag is set, CSS keeps those elements visible (see index.css).
if (container.hasChildNodes() && !navigator.webdriver) {
  document.documentElement.setAttribute('data-prerendered', '')
  window.setTimeout(() => document.documentElement.removeAttribute('data-prerendered'), 1800)
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
