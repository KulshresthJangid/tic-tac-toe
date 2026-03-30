import { Navigate } from 'react-router-dom'
import { isAuthed } from '../lib/adminAuth'
import type { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthed()) {
    return <Navigate to="/admin" replace />
  }
  return <>{children}</>
}
