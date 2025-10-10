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
    
    // Check if user has manually set a preference
    const hasUserPreference = localStorage.getItem('theme_user_preference') === 'true'
    
    if (hasUserPreference) {
      // User has manually set a preference - use it
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme)
        applyTheme(savedTheme)
      }
    } else {
      // No user preference - use system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const systemTheme: Theme = mediaQuery.matches ? 'dark' : 'light'
      setTheme(systemTheme)
      applyTheme(systemTheme)
    }
    
    // ALWAYS listen for system theme changes (outside the if/else)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (localStorage.getItem('theme_user_preference') !== 'true') {
        const newTheme: Theme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        applyTheme(newTheme)
        console.log('🔄 Tema del sistema cambió a:', newTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
    // Mark that user has set a preference
    localStorage.setItem('theme', newTheme)
    localStorage.setItem('theme_user_preference', 'true')
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
