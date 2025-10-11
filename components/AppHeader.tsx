'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

interface AppHeaderProps {
  appName: string
  appIcon?: any
}

export default function AppHeader({ appName, appIcon: Icon }: AppHeaderProps) {
  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo + Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/apps">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100">Flow</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Volver a Apps
                </div>
              </div>
            </motion.div>
          </Link>
          
          {/* Divider */}
          <div className="h-10 w-px bg-gray-200 dark:bg-gray-700"></div>
          
          {/* App Name */}
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {appName}
            </h1>
          </div>
        </div>

        {/* Mobile Back Button */}
        <Link href="/apps" className="sm:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </motion.button>
        </Link>
      </div>
    </header>
  )
}
