'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {}
})

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Get system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light'
    
    // Check if there's a saved theme
    const savedTheme = localStorage.getItem('theme') as Theme | null
    
    // Use saved theme if exists, otherwise use system theme
    const initialTheme = (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : systemTheme
    setTheme(initialTheme)
    applyTheme(initialTheme)
    
    // ALWAYS listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme: Theme = e.matches ? 'dark' : 'light'
      setTheme(newTheme)
      applyTheme(newTheme)
      // Update localStorage to keep it in sync
      localStorage.setItem('theme', newTheme)
      console.log('🔄 Sistema cambió a:', newTheme)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
    // Save to localStorage
    localStorage.setItem('theme', newTheme)
    console.log('👤 Usuario cambió a:', newTheme)
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
