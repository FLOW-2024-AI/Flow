'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Construction } from 'lucide-react'
import AppHeader from './AppHeader'
import AppSidebarInternal from './AppSidebarInternal'

interface SidebarSection {
  title: string
  items: {
    name: string
    icon: any
    href: string
    badge?: string
  }[]
}

interface AppPlaceholderProps {
  appName: string
  appDescription: string
  icon: any
  color: string
  sidebarSections: SidebarSection[]
  appSlug: string
}

export default function AppPlaceholder({ 
  appName, 
  appDescription, 
  icon: Icon, 
  color,
  sidebarSections,
  appSlug
}: AppPlaceholderProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <AppHeader appName={appName} appIcon={Icon} />
      
      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AppSidebarInternal sections={sidebarSections} appSlug={appSlug} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-secondary-900 dark:to-secondary-800 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-secondary-800 rounded-3xl shadow-2xl p-12 text-center"
            >
              {/* Icon */}
              <div className={`w-24 h-24 bg-gradient-to-br ${color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                <Icon className="w-12 h-12 text-white" />
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {appName}
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                {appDescription}
              </p>

              {/* Under Construction */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 mb-8">
                <Construction className="w-16 h-16 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                  En Construcción
                </h2>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Este módulo está en desarrollo. El sidebar muestra la navegación propuesta.
                </p>
              </div>

              {/* Sidebar Preview */}
              <div className="text-left bg-gray-50 dark:bg-secondary-900 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  📋 Navegación Propuesta (ver sidebar):
                </h3>
                <div className="space-y-4">
                  {sidebarSections.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {section.title}
                      </h4>
                      <ul className="space-y-2 ml-4">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                            {item.name}
                            {item.badge && (
                              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Link href="/apps/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Ir al Dashboard Principal
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
