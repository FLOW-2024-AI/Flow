'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const sections = [
  { id: 'hero', label: 'Inicio' },
  { id: 'integraciones', label: 'Integraciones' },
  { id: 'trust-badges', label: 'Seguridad' },
  { id: 'producto', label: 'Producto' },
  { id: 'soluciones', label: 'Soluciones' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'preguntas', label: 'FAQ' },
]

export default function ScrollProgress() {
  const [activeSection, setActiveSection] = useState('hero')
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id)
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Navbar height
      const elementPosition = element.offsetTop - offset
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block">
      <div className="flex flex-col gap-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id
          const isHovered = hoveredSection === section.id
          
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              className="group relative flex items-center"
            >
              {/* Dot indicator - más pequeño y sutil */}
              <div className="relative">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'bg-neutral-900 dark:bg-neutral-100 scale-150' 
                    : 'bg-neutral-400 dark:bg-neutral-600 hover:bg-neutral-500 dark:hover:bg-neutral-500'
                }`} />
              </div>

              {/* Label tooltip - solo visible en hover */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -10
                }}
                transition={{ duration: 0.2 }}
                className="absolute left-4 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg pointer-events-none"
              >
                {section.label}
              </motion.div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
