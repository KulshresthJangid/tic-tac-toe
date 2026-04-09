import { createContext, useContext, useState, type ReactNode } from 'react'

interface GenZContextType {
  genzMode: boolean
  toggleGenZ: () => void
}

const GenZContext = createContext<GenZContextType>({ genzMode: false, toggleGenZ: () => {} })

export function GenZProvider({ children }: { children: ReactNode }) {
  const [genzMode, setGenzMode] = useState(false)
  return (
    <GenZContext.Provider value={{ genzMode, toggleGenZ: () => setGenzMode((p) => !p) }}>
      {children}
    </GenZContext.Provider>
  )
}

export function useGenZ() {
  return useContext(GenZContext)
}
