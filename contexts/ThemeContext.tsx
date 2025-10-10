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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)
  const [userPreference, setUserPreference] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const hasUserPreference = localStorage.getItem('theme_user_preference') === 'true'
    
    if (savedTheme && hasUserPreference) {
      // User has manually set a preference
      setTheme(savedTheme)
      setUserPreference(true)
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // No user preference, detect system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const systemTheme: Theme = prefersDark ? 'dark' : 'light'
      setTheme(systemTheme)
      setUserPreference(false)
      if (systemTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't manually set a preference
      const hasPreference = localStorage.getItem('theme_user_preference') === 'true'
      if (!hasPreference) {
        const newTheme: Theme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply theme changes when user toggles
  useEffect(() => {
    if (mounted && userPreference) {
      localStorage.setItem('theme', theme)
      localStorage.setItem('theme_user_preference', 'true')
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [theme, mounted, userPreference])

  const toggleTheme = () => {
    setUserPreference(true)
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', newTheme)
      localStorage.setItem('theme_user_preference', 'true')
      return newTheme
    })
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
