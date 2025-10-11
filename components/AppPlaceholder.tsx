'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Construction } from 'lucide-react'

interface AppPlaceholderProps {
  appName: string
  appDescription: string
  icon: any
  color: string
}

export default function AppPlaceholder({ appName, appDescription, icon: Icon, color }: AppPlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-secondary-900 dark:to-secondary-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/apps">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Aplicaciones</span>
          </motion.button>
        </Link>

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
              Este módulo está en desarrollo. Pronto estará disponible con todas sus funcionalidades.
            </p>
          </div>

          {/* Features Preview */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Funcionalidades Próximas:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Interfaz intuitiva y fácil de usar
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Integración con otros módulos de Flow
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Reportes y análisis en tiempo real
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Automatización con IA
                </span>
              </li>
            </ul>
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
    </div>
  )
}
