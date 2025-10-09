'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 60, height = 28, className = '' }: LogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Durante SSR o antes de montar, mostrar logo oscuro por defecto
  if (!mounted) {
    return (
      <img 
        src="/images/logo/flow-logo-dark.svg"
        alt="Flow" 
        width={width}
        height={height}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    )
  }

  // Usar logo claro u oscuro según el tema
  const logoSrc = theme === 'light' 
    ? '/images/logo/flow-logo-dark.svg'  // Logo oscuro para fondo claro
    : '/images/logo/flow-logo-light.svg' // Logo claro para fondo oscuro

  return (
    <img 
      src={logoSrc}
      alt="Flow" 
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
      onError={(e) => {
        console.error('Error loading logo')
        // Fallback: mostrar texto si la imagen falla
        const target = e.target as HTMLImageElement
        target.style.display = 'none'
        const parent = target.parentElement
        if (parent) {
          const fallback = document.createElement('span')
          fallback.textContent = 'FLOW'
          fallback.className = 'text-gray-900 dark:text-white font-bold text-xl'
          parent.appendChild(fallback)
        }
      }}
    />
  )
}
