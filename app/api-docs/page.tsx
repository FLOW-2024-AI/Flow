'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function APIPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-secondary-800 dark:bg-secondary-800 dark:bg-secondary-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">API de Flow</h1>
            <p className="text-xl text-gray-400 dark:text-gray-300">
              Integra Flow con tus sistemas mediante nuestra API RESTful
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-100 dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Endpoints Principales</h3>
              <div className="space-y-4">
                <div className="bg-white dark:bg-secondary-800 dark:bg-secondary-800 dark:bg-secondary-900 border border-gray-300 dark:border-gray-600 rounded-xl p-4">
                  <code className="text-green-400 text-sm">GET /api/v1/transactions</code>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Obtener transacciones</p>
                </div>
                <div className="bg-white dark:bg-secondary-800 dark:bg-secondary-800 dark:bg-secondary-900 border border-gray-300 dark:border-gray-600 rounded-xl p-4">
                  <code className="text-blue-400 text-sm">POST /api/v1/invoices</code>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Crear factura</p>
                </div>
                <div className="bg-white dark:bg-secondary-800 dark:bg-secondary-800 dark:bg-secondary-900 border border-gray-300 dark:border-gray-600 rounded-xl p-4">
                  <code className="text-purple-400 text-sm">GET /api/v1/reports</code>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Generar reportes</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-secondary-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Autenticación</h3>
              <p className="text-gray-400 dark:text-gray-300 mb-4">
                Usa API Keys para autenticar tus requests:
              </p>
              <div className="bg-white dark:bg-secondary-800 dark:bg-secondary-800 dark:bg-secondary-900 border border-gray-300 dark:border-gray-600 rounded-xl p-4">
                <code className="text-sm text-gray-600 dark:text-gray-400">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
                Las API Keys se generan desde tu dashboard en Configuración → API
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-2xl p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Necesitas acceso a la API?</h3>
            <p className="text-gray-400 dark:text-gray-300 mb-6">
              La API está disponible en los planes Professional y Enterprise
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/precios"
                className="inline-block bg-white dark:bg-secondary-800 dark:bg-secondary-800 text-gray-900 dark:text-gray-100 px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Ver planes
              </Link>
              <Link
                href="/consulta"
                className="inline-block border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-900 dark:text-white px-8 py-3 rounded-full font-semibold hover:border-neutral-500 transition-all"
              >
                Contactar ventas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
